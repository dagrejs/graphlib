// Regression test for the published dist package format (dagrejs/graphlib #233).
//
// test/bundle-test.ts imports ../index (source) via ts-jest, so it cannot catch a
// dist-format bug. This test exercises the BUILT dist bundles through real
// runtimes (tsx for ESM, node for CJS) by importing them at an absolute path.
//
// Importing by absolute path is what makes this faithful: Node/tsx reads the
// "type" field from the dist file's nearest package.json to decide whether a
// ".js" file is ESM or CJS. Without "type": "module" the ESM bundle
// (dist/graphlib.esm.js, ESM syntax) is treated as CJS, so named imports are
// undefined and `new Graph()` throws. Adding "type": "module" fixes the ESM
// path; renaming the CJS bundle to .cjs keeps `require()` working under it.

import {execFileSync} from 'child_process';
import {existsSync, mkdtempSync, rmSync, writeFileSync} from 'fs';
import {tmpdir} from 'os';
import {join, resolve} from 'path';

const repoRoot = process.cwd();
const esmPath = resolve(repoRoot, 'dist', 'graphlib.esm.js');
const cjsPath = resolve(repoRoot, 'dist', 'graphlib.cjs');

// ESM smoke check run under tsx — mirrors the #233 repro. Under a correct
// package.json the named exports resolve; under the buggy format only `default`
// is present, so `Graph` is undefined and `new Graph()` throws.
const esmCheck = `import {Graph, alg, json, version} from ${JSON.stringify(esmPath)};

const problems = [];
if (typeof Graph !== 'function') problems.push('Graph is ' + typeof Graph + ', expected function');
if (typeof alg !== 'object') problems.push('alg is ' + typeof alg + ', expected object');
if (typeof json !== 'object') problems.push('json is ' + typeof json + ', expected object');
if (typeof version !== 'string') problems.push('version is ' + typeof version + ', expected string');
try {
    const g = new Graph();
    g.setNode('a');
    if (!g.hasNode('a')) problems.push('Graph operation failed');
} catch (e) {
    problems.push('new Graph() threw: ' + e.message);
}
if (problems.length) { console.error('ESM FAIL: ' + problems.join('; ')); process.exit(1); }
console.log('ESM OK');
`;

// CJS smoke check run under node — guards the CJS regression that a naive
// "type": "module" (without renaming the CJS bundle to .cjs) would introduce:
// `require()` of a .js file under "type": "module" throws ERR_REQUIRE_ESM.
const cjsCheck = `const {Graph} = require(${JSON.stringify(cjsPath)});
const g = new Graph();
g.setNode('a');
if (!g.hasNode('a')) { console.error('CJS FAIL: Graph operation failed'); process.exit(1); }
console.log('CJS OK');
`;

describe('dist exports', () => {
    let tmpDir: string;

    beforeAll(() => {
        if (!existsSync(esmPath) || !existsSync(cjsPath)) {
            execFileSync('npm', ['run', 'build'], {
                cwd: repoRoot,
                stdio: 'pipe',
                shell: process.platform === 'win32',
            });
        }
        tmpDir = mkdtempSync(join(tmpdir(), 'graphlib-dist-exports-'));
        writeFileSync(join(tmpDir, 'esm-check.mts'), esmCheck);
        writeFileSync(join(tmpDir, 'cjs-check.cjs'), cjsCheck);
    }, 60000);

    afterAll(() => {
        if (tmpDir) {
            rmSync(tmpDir, {recursive: true, force: true});
        }
    });

    it('ESM bundle exposes named exports under tsx', () => {
        const out = execFileSync('npx', ['tsx', join(tmpDir, 'esm-check.mts')], {
            cwd: repoRoot,
            encoding: 'utf8',
            shell: process.platform === 'win32',
        });
        expect(out).toContain('ESM OK');
    }, 30000);

    it('CJS bundle is requireable under node', () => {
        const out = execFileSync(process.execPath, [join(tmpDir, 'cjs-check.cjs')], {
            cwd: repoRoot,
            encoding: 'utf8',
        });
        expect(out).toContain('CJS OK');
    }, 30000);
});
