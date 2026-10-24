Changelog: @dagrejs/graphlib (v3.0.0+)

## v4.0.7

Fixes & Improvements
* ESM & Package Exports: Added `"type": "module"` to `package.json` and renamed the CommonJS bundle to `dist/graphlib.cjs` so both ESM `import` and CommonJS `require()` resolve properly (#233, #237).
* TypeScript Declarations: Added `.js` extensions to relative imports and updated `tsconfig.build.json` to use `nodenext` resolution so emitted `.d.ts` files resolve cleanly under `node16`/`nodenext` (#238, #239).
* TypeScript Types: Strengthened generic type definitions across `Graph`, `json`, and `alg` functions (#236).
* json.read: Preserved empty-string (`""`) parent IDs during JSON serialization roundtrips (#247).
* Release & Tooling: Added a preflight release check to ensure `changelog.md` is updated before releasing (#251) and added `.pre-commit-config.yaml` to run tests (#250).
* Dependency Updates: Maintenance updates for devDependencies (`@babel/core`, `handlebars`, `brace-expansion`, `baseline-browser-mapping`, `js-yaml`, `browserslist`, `@humanfs/node`).

## v4.0.3

Fixes & Improvements
* alg.findCycles: Fixed detection of self-loop cycles created with named edges in multigraphs (#111, #235).
* Dependency Updates: Maintenance updates for dependencies (lodash, handlebars, flatted, minimatch, picomatch, esbuild, tsx).

Major Improvements & Modernization
Organization Migration: Transitioned package ownership to the @dagrejs scope for long-term community maintenance.

Toolchain Overhaul: * Replaced JSHint with ESLint for modern syntax support and stricter code quality.

Removed legacy build tools including Karma, Browserify, and Bower.

TypeScript Enhancements: * Significant updates to index.d.ts to improve IntelliSense and type safety.

Refined generic type definitions for Graph, Node, and Edge objects.

Fixes & Refactoring
Formatting Standardization: Resolved the conflict between .eslintrc and .editorconfig to enforce a consistent 2-space indentation across the codebase.

Dependency Audit: Cleared high-severity security vulnerabilities by updating core devDependencies via Dependabot.

Project Structure: Cleaned up the root directory by removing deprecated configuration files (bower.json, karma.conf.js).

Breaking Changes
Bower Support Dropped: Official support for Bower has been removed. Users are encouraged to migrate to npm or yarn.

Development Workflow: Developers contributing to the library must now use npm run lint (ESLint) instead of the previous JSHint commands.
