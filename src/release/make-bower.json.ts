#!/usr/bin/env node

/**
 * Renders the bower.json template and prints it to stdout
 */

import fs from 'fs';

interface PackageJson {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
}

interface BowerTemplate {
    name: string;
    version: string;
    main: string[];
    ignore: string[];
    dependencies?: Record<string, string>;
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8')) as PackageJson;
const packageNameParts = packageJson.name.split('/');
const packageName = packageNameParts[packageNameParts.length - 1]!;

const template: BowerTemplate = {
    name: packageName,
    version: packageJson.version,
    main: [`dist/${packageName}.core.js`],
    ignore: [
        '.*',
        'README.md',
        'CHANGELOG.md',
        'Makefile',
        'browser.js',
        `dist/${packageName}.js`,
        `dist/${packageName}.min.js`,
        'index.js',
        'karma*',
        'lib/**',
        'package.json',
        'src/**',
        'test/**',
    ],
    dependencies: packageJson.dependencies,
};

console.log(JSON.stringify(template, null, 2));
