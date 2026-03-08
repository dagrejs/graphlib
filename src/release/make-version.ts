#!/usr/bin/env node

/**
 * Generates the version.ts file content from package.json version
 */

import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
console.log(`export const version = '${packageJson.version}';`);
