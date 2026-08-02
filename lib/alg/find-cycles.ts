import {Graph} from '../graph';
import type {Edge} from '../types';
import {tarjan} from './tarjan';

/**
 * Given a Graph, graph, this function returns all nodes that are part of a cycle. As there
 * may be more than one cycle in a graph this function return an array of these cycles,
 * where each cycle is itself represented by an array of ids for each node involved in
 * that cycle. Method alg.isAcyclic is more efficient if you only need to determine whether a graph has a
 * cycle or not.
 * Complexity: O(|V| + |E|).
 *
 * @param graph - graph where to search cycles.
 * @returns cycles list.
 */
export function findCycles(graph: Graph): string[][] {
    return tarjan(graph).filter(function (cmpt) {
        // A single-node component is a cycle iff the node has a self-loop. We check via outEdges
        // rather than hasEdge(v, v) because the latter only matches the default (unnamed) edge and
        // would miss a named self-loop edge in a multigraph.
        return cmpt.length > 1
            || (cmpt.length === 1 && (graph.outEdges(cmpt[0]!, cmpt[0]!) as Edge[]).length > 0);
    });
}
