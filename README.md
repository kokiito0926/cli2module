## CLI to Module

CLI to Moduleを用いると、CLIをモジュール化することができます。  
内部では、ワーカースレッドを使用しているため、プロセスが終了するようなこともありません。

## インストール

```bash
$ npm install @kokiito0926/cli-to-module
```

## コード

```javascript
import { ctm } from "@kokiito0926/cli-to-module";

const result = await ctm("zx/cli", ["--help"]);
console.log(result);
```

## ライセンス

[MIT](LICENSE)
