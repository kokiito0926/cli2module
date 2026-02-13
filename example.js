#!/usr/bin/env node

import { cli2module } from "./index.js";

console.log('--- Case 1: Running zx help ---');
const result = await cli2module("zx/cli", ["--help"]);
console.log(`Code: ${result.code}`);
console.log(`Stdout length: ${result.stdout.length}`);

console.log('\n--- Case 2: Passing stdin to zx ---');
const result2 = await cli2module("zx/cli", [], 'console.log("Hello, zx!")');
console.log(`Stdout: ${result2.stdout}`);

console.log('\n--- Case 3: Error handling (invalid module) ---');
try {
    await cli2module("non-existent-module");
} catch (err) {
    console.log(`Caught expected error: ${err.message}`);
}
