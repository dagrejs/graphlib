import { Graph } from '../graph';
export declare class CycleException extends Error {
    constructor(...args: unknown[]);
}
/**
 * Given a graph this function applies topological sorting to it.
 * If the graph has a cycle it is impossible to generate such a list and CycleException is thrown.
 * Complexity: O(|V| + |E|).
 *
 * @param graph - graph to apply topological sorting to.
 * @returns an array of nodes such that for each edge u -> v, u appears before v in the array.
 */
export declare function topsort(graph: Graph): string[];
//# sourceMappingURL=topsort.d.ts.map