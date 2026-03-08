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

    return {
        weight: shortestPaths[destination]!.distance,
        path: runExtractPath(shortestPaths, source, destination)
    };
}

function runExtractPath(
    shortestPaths: Record<string, Path>,
    source: string,
    destination: string
): string[] {
    const path: string[] = [];
    let currentNode = destination;

    while (currentNode !== source) {
        path.push(currentNode);
        currentNode = shortestPaths[currentNode]!.predecessor!;
    }
    path.push(source);
    return path.reverse();
}
