## CLI to Module

CLI to Moduleを用いると、CLIをモジュール化することができます。  
ワーカースレッドを内部で使用しているため、プロセスが終了するようなことはありません。

## インストール

```bash
$ npm install @kokiito0926/cli-to-module
```

## コード

```javascript
import { ctm } from "@kokiito0926/cli-to-module";

const result = await ctm("zx/cli", ["--help"]);
console.log(result);

const result2 = await ctm("zx/cli", [], 'console.log("Hello, world!")');
console.log(result2);
```

## ライセンス

[MIT](LICENSE)
