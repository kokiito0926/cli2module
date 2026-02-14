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

export async function cli2module(specifier, args = [], input = "") {
	const cliUrl = await import.meta.resolve(specifier);
	const cliPath = fileURLToPath(cliUrl);
	return await runInWorker(cliPath, args, input);
}
