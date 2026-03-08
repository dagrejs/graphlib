import type { Path } from '../types';
interface ExtractedPath {
    weight: number;
    path: string[];
}
export declare function extractPath(shortestPaths: Record<string, Path>, source: string, destination: string): ExtractedPath;
export {};
//# sourceMappingURL=extract-path.d.ts.map