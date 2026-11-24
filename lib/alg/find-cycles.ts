import {Graph} from '../graph.js';
import {tarjan, tarjanUndirected} from './tarjan.js';

export type CycleNodeIds = string[];

/**
 * Given a Graph, graph, this function returns all nodes that are part of a cycle. As there
 * may be more than one cycle in a graph this function return an array of these cycles,
 * where each cycle is itself represented by an array of ids for each node involved in
 * that cycle.
 *
 * Use alg.isAcyclic if you only need to know if a cycle exists.
 * Complexity: O(|V| + |E|).
 *
 * @param graph - graph where to search cycles.
 * @returns cycles list.
 */
export function findCycles(graph: Graph): CycleNodeIds[] {
    let components: string[][];
    if (graph.isDirected()) {
        components = tarjan(graph);
    } else {
        components = tarjanUndirected(graph);
    }

    return components.filter(function (cmpt) {
        const firstNode = cmpt[0];
        if (!firstNode) return false;
        return cmpt.length > 1
            || (cmpt.length === 1 && (graph.outEdges(firstNode, firstNode) ?? []).length > 0);
    });
}
