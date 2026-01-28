#!/usr/bin/env node

import { fs, path } from "zx";
import { ctm } from "./index.js";

// const result = await ctm("zx/cli", []);
const result = await ctm("zx/cli", ["--help"]);
// const result = await ctm("zx/cli", ["--version"]);
console.log(result);
console.log(result?.code);
console.log(result?.stdout);
console.log(result?.stderr);
