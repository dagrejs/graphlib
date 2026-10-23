// Regression test for the published type declarations (dagrejs/graphlib #238).
//
// tsconfig.build.json compiles with moduleResolution "nodenext", so the build
// itself now rejects an extensionless relative specifier in lib/** or index.ts.
// This test covers the half that a compile of this repo cannot: that a real
// dependent resolving @dagrejs/graphlib through node_modules and the package
// "exports" map gets working types out of the generated declarations. That
// wiring (package.json "exports" -> "types") can regress on its own, as #233
// showed.
//
// The failure mode has two faces, and the test catches both. With skipLibCheck
// off, tsc reports TS2834 against dist/types/index.d.ts. With it on -- the
// common default -- that error is silenced while every graphlib export quietly
// degrades to `any`; the @ts-expect-error in the consumer below is what catches
// that quieter case, since it only holds if the types resolved.
//
// Declarations are built fresh into a temp package rather than read from the
// committed dist/, so this tests the current source and leaves the working tree
// alone. The real package.json is copied in unmodified, so the "exports" map
// under test is the one that ships.

import {execFileSync} from 'child_process';
import {copyFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync} from 'fs';
import {tmpdir} from 'os';
import {join} from 'path';

const repoRoot = process.cwd();
// Resolved rather than hardcoded so this survives a hoisted or pnpm layout.
const tsc = require.resolve('typescript/bin/tsc');

const consumerTsconfig = {
    compilerOptions: {
        module: 'nodenext',
        moduleResolution: 'nodenext',
        target: 'es2022',
        strict: true,
        skipLibCheck: false,
        noEmit: true,
        // The consumer lives under the OS temp dir, so tsc's automatic @types
        // lookup would walk up into directories we do not control and check
        // whatever it found. Pin it to nothing; graphlib needs no ambient types.
        types: [],
    },
    include: ['src'],
};

// Mirrors the #238 repro: a plain consumer calling into the public API.
const consumerSource = `import {Graph, alg, json} from '@dagrejs/graphlib';
import type {Edge} from '@dagrejs/graphlib';

const g = new Graph();
g.setEdge('a', 'b');
const edges: Edge[] = g.edges();
alg.isAcyclic(g);
json.write(g);

// If the declarations failed to resolve, Graph is \`any\`, this assignment stops
// erroring, and tsc flags the directive as unused (TS2578).
// @ts-expect-error nodes() returns string[], not number
const nodes: number = g.nodes();
`;

// tsc exits non-zero on any diagnostic, so execFileSync throws and fails the
// test; 'inherit' puts the diagnostics themselves in the jest output.
function runTsc(args: string[], cwd: string): void {
    execFileSync(process.execPath, [tsc, ...args], {cwd, stdio: ['ignore', 'inherit', 'inherit']});
}

describe('dist type declarations', () => {
    let tmpDir: string;
    let consumerDir: string;

    beforeAll(() => {
        tmpDir = mkdtempSync(join(tmpdir(), 'graphlib-dist-types-'));
        const packageDir = join(tmpDir, 'package');
        consumerDir = join(tmpDir, 'consumer');

        // A stand-in for the published package: the real package.json plus
        // declarations emitted from the current source.
        mkdirSync(packageDir);
        copyFileSync(join(repoRoot, 'package.json'), join(packageDir, 'package.json'));
        runTsc(['-p', 'tsconfig.build.json', '--outDir', join(packageDir, 'dist', 'types')], repoRoot);

        // Resolve that package the way a dependent does, through node_modules
        // and the "exports" map, rather than by pointing tsc at the .d.ts.
        mkdirSync(join(consumerDir, 'node_modules', '@dagrejs'), {recursive: true});
        mkdirSync(join(consumerDir, 'src'));
        symlinkSync(packageDir, join(consumerDir, 'node_modules', '@dagrejs', 'graphlib'), 'junction');
        writeFileSync(join(consumerDir, 'package.json'), JSON.stringify({name: 'consumer', private: true, type: 'module'}));
        writeFileSync(join(consumerDir, 'tsconfig.json'), JSON.stringify(consumerTsconfig));
        writeFileSync(join(consumerDir, 'src', 'index.ts'), consumerSource);
    }, 30000);

    afterAll(() => {
        if (tmpDir) {
            rmSync(tmpDir, {recursive: true, force: true});
        }
    });

    it('type-check cleanly in a NodeNext consumer', () => {
        runTsc(['-p', 'tsconfig.json'], consumerDir);
    }, 30000);
});
