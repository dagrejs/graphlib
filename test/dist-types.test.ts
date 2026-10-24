import {execFileSync} from 'child_process';
import {copyFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync} from 'fs';
import {tmpdir} from 'os';
import {join} from 'path';

const repoRoot = process.cwd();
const tsc = require.resolve('typescript/bin/tsc');

const consumerTsconfig = {
    compilerOptions: {
        module: 'nodenext',
        moduleResolution: 'nodenext',
        target: 'es2022',
        strict: true,
        skipLibCheck: false,
        noEmit: true,
        types: [],
    },
    include: ['src'],
};

const consumerSource = `import {Graph, alg, json} from '@dagrejs/graphlib';
import type {Edge} from '@dagrejs/graphlib';

const g = new Graph();
g.setEdge('a', 'b');
const edges: Edge[] = g.edges();
alg.isAcyclic(g);
json.write(g);

// @ts-expect-error nodes() returns string[], not number
const nodes: number = g.nodes();
`;

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

        mkdirSync(packageDir);
        copyFileSync(join(repoRoot, 'package.json'), join(packageDir, 'package.json'));
        runTsc(['-p', 'tsconfig.build.json', '--outDir', join(packageDir, 'dist', 'types')], repoRoot);

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
