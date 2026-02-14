#!/usr/bin/env node

import { cli2module } from "./index.js";

// const result = await cli2module("zx/cli", []);
const result = await cli2module("zx/cli", ["--help"]);
// const result = await cli2module("zx/cli", ["--version"]);
console.log(result);
console.log(result?.code);
console.log(result?.stdout);
console.log(result?.stderr);

const result2 = await cli2module("zx/cli", [], 'console.log("Hello, world!")');
console.log(result2);
console.log(result2?.code);
console.log(result2?.stdout);
console.log(result2?.stderr);
