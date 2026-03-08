Changelog: @dagrejs/graphlib (v3.0.0+)

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
