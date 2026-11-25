import type {Path} from '../types.js';

interface ExtractedPath {
    weight: number;
    path: string[];
}

export function extractPath(
    shortestPaths: Record<string, Path>,
    source: string,
    destination: string
): ExtractedPath {
    const sourcePath = shortestPaths[source];
    if (sourcePath?.predecessor !== '' || sourcePath.distance !== 0) {
        throw new Error("Invalid source vertex");
    }

    const destPath = shortestPaths[destination];
    if (!destPath || !Number.isFinite(destPath.distance)) {
        throw new Error("Invalid destination vertex");
    }

    return {
        weight: destPath.distance,
        path: runExtractPath(shortestPaths, source, destination)
    };
}

function runExtractPath(
    shortestPaths: Record<string, Path>,
    source: string,
    destination: string
): string[] {
    const path: string[] = [];
    const visited = new Set<string>();
    let currentNode = destination;

    while (currentNode !== source) {
        const entry = shortestPaths[currentNode];
        if (!entry || visited.has(currentNode)) {
            throw new Error("Invalid destination vertex");
        }
        visited.add(currentNode);
        path.push(currentNode);
        currentNode = entry.predecessor;
    }
    path.push(source);
    return path.reverse();
}
