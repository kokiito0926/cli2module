import { fileURLToPath, pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";

// zxのCLIのパスを取得しなければいけない。
// 通常通りにzxをimportしてしまうと、ライブラリとして解決されてしまう。
/*
"bin": {
	"zx": "build/cli.js"
},
*/
// >> C:\Users\kouki\root\playground\node\node_modules\zx\package.json
// >> 2026/01/28 10:43.

function runInWorker(scriptPath, args = [], input = "") {
	return new Promise((resolve, reject) => {
		const workerCode = `
      import { workerData } from 'node:worker_threads';
      
      process.argv = ['node', workerData.path, ...workerData.args];

      try {
        await import('file:///' + workerData.path.replace(/\\\\/g, '/'));
      } catch (err) {
        // ワーカースレッド内での例外（構文エラーやインポートエラー等）を確実に投げ、
        // 親スレッドの 'error' イベントでキャッチできるようにする。
        throw err;
      }
    `;

		const worker = new Worker(workerCode, {
			eval: true,
			type: "module",
			workerData: { path: scriptPath, args },
			stdin: true,
			stdout: true,
			stderr: true,
		});

		let output = "";
		let errorOutput = "";

		if (input) {
			worker.stdin.write(input);
			worker.stdin.end();
		}

		worker.stdout.on("data", (chunk) => {
			output += chunk.toString();
		});

		worker.stderr.on("data", (chunk) => {
			errorOutput += chunk.toString();
		});

		worker.on("exit", (code) => {
			resolve({
				code,
				stdout: output.trim(),
				stderr: errorOutput.trim(),
			});
		});

		worker.on("error", (err) => {
			reject(err);
		});
	});
}

/**
 * CLIツールをワーカースレッドで実行します。
 * 
 * @param {string} specifier 実行するCLIツールのパスまたはモジュール名
 * @param {string[]} [args=[]] コマンドライン引数の配列
 * @param {string} [input=""] 標準入力に渡す文字列
 * @returns {Promise<{code: number, stdout: string, stderr: string}>}
 */
export async function cli2module(specifier, args = [], input = "") {
	let cliUrl;
	try {
		// 相対パス（./ か ../）で始まる場合は、直感的な動作のために process.cwd() を基準に解決を試みる
		if (specifier.startsWith("./") || specifier.startsWith("../")) {
			cliUrl = pathToFileURL(path.resolve(process.cwd(), specifier)).href;
		} else {
			cliUrl = await import.meta.resolve(specifier);
		}
	} catch (err) {
		throw new Error(`Failed to resolve specifier "${specifier}": ${err.message}`);
	}

	const cliPath = fileURLToPath(cliUrl);
	return await runInWorker(cliPath, args, input);
}
