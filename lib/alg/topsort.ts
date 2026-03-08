import {Graph} from '../graph';

export class CycleException extends Error {
    constructor(...args: unknown[]) {
        super(...args as ConstructorParameters<typeof Error>);
    }
}

/**
 * Given a graph this function applies topological sorting to it.
 * If the graph has a cycle it is impossible to generate such a list and CycleException is thrown.
 * Complexity: O(|V| + |E|).
 *
 * @param graph - graph to apply topological sorting to.
 * @returns an array of nodes such that for each edge u -> v, u appears before v in the array.
 */
export function topsort(graph: Graph): string[] {
    const visited: Record<string, boolean> = {};
    const stack: Record<string, boolean> = {};
    const results: string[] = [];

    function visit(node: string): void {
        if (node in stack) {
            throw new CycleException();
        }

        if (!(node in visited)) {
            stack[node] = true;
            visited[node] = true;
            graph.predecessors(node)!.forEach(visit);
            delete stack[node];
            results.push(node);
        }
    }

    graph.sinks().forEach(visit);

    if (Object.keys(visited).length !== graph.nodeCount()) {
        throw new CycleException();
    }

    return results;
}
