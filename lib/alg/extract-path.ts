import type {Path} from '../types';

interface ExtractedPath {
    weight: number;
    path: string[];
}

export function extractPath(
    shortestPaths: Record<string, Path>,
    source: string,
    destination: string
): ExtractedPath {
    if (shortestPaths[source]?.predecessor !== '') {
        throw new Error("Invalid source vertex");
    }
    if (shortestPaths[destination]?.predecessor === '' && destination !== source) {
        throw new Error("Invalid destination vertex");
    }

    const destPath = shortestPaths[destination];
    if (!destPath) {
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
    let currentNode: string | undefined = destination;

    while (currentNode !== undefined && currentNode !== source) {
        path.push(currentNode);
        currentNode = shortestPaths[currentNode]?.predecessor;
    }
    if (currentNode === source) {
        path.push(source);
    }
    return path.reverse();
}
