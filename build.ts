import {build as esbuild, BuildOptions} from 'esbuild';
import {readFileSync} from 'fs';

// Get all production dependencies to be marked as external (not bundled)
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const external = Object.keys(packageJson.dependencies || {});

const sharedConfig: BuildOptions = {
    entryPoints: ['index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: 'es2018',
    legalComments: 'linked',
    external: external.concat([]),
};

async function build(): Promise<void> {
    // 1. CommonJS (CJS) - For Node.js `require()`
    await esbuild({
        ...sharedConfig,
        outfile: 'dist/graphlib.cjs.js',
        format: 'cjs',
        platform: 'node',
    });

    // 2. ES Module (ESM) - For modern bundlers/native ES imports
    await esbuild({
        ...sharedConfig,
        outfile: 'dist/graphlib.esm.js',
        format: 'esm',
        platform: 'neutral',
    });

    const iifeConfig: BuildOptions = {
        ...sharedConfig,
        format: 'iife',
        globalName: 'graphlib',
        platform: 'browser',
    };

    // 3. IIFE/UMD - For direct browser script tag (minified)
    await esbuild({
        ...iifeConfig,
        outfile: 'dist/graphlib.min.js',
    });

    // 4. IIFE/UMD - For direct browser script tag (unminified)
    await esbuild({
        ...iifeConfig,
        outfile: 'dist/graphlib.js',
        minify: false,
    });

    console.log('Build complete! 🚀');
}

build().catch(() => process.exit(1));
