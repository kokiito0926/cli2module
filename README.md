## cli2module

cli2moduleは、CLIのツールをワーカースレッドで実行することができるライブラリです。  
通常、CLIのツールをimportして実行すると、内部でprocess.exitが呼び出されたときに、呼び出し元のプログラムも終了してしまいます。  
このライブラリはワーカースレッドを使用することで、プロセスを終了させることなく、CLIのツールを実行することができます。

## インストール

```bash
$ npm install @kokiito0926/cli2module
```

## 使用方法

CLIのツールを指定して、コマンドライン引数を配列で渡します。

```javascript
import { cli2module } from "@kokiito0926/cli2module";

const result = await cli2module("zx/cli", ["--help"]);
console.log(result.code);
console.log(result.stdout);
console.log(result.stderr);
```

第3引数に文字列を渡すことで、CLIのツールの標準入力として扱われます。

```javascript
import { cli2module } from "@kokiito0926/cli2module";

const result = await cli2module("zx/cli", [], 'console.log("Hello, world!")');
console.log(result.code);
console.log(result.stdout);
console.log(result.stderr);
```

## ライセンス

[MIT](LICENSE)
