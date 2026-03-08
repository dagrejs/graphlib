#!/usr/bin/env node

/**
 * Bumps the patch version and sets the prerelease tag.
 */

import fs from 'fs';
import semver from 'semver';

const packageFile = fs.readFileSync('package.json', 'utf-8');
const packageJson = JSON.parse(packageFile);

if (!('version' in packageJson)) {
    bail('ERROR: Could not find version in package.json');
}

const ver = semver.parse(packageJson.version);

if (!ver) {
    bail('ERROR: Could not parse version');
}

packageJson.version = ver.inc('patch')!.toString() + '-pre';

fs.writeFileSync('package.json', JSON.stringify(packageJson, undefined, 2) + '\n');

console.log('Bumped version to:', packageJson.version);

// Write an error message to stderr and then exit immediately with an error.
function bail(msg: string): never {
    console.error(msg + '\n');
    process.exit(1);
}
