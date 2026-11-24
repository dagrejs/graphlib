import {Graph} from '../graph.js';
import type {Edge} from '../types.js';
import {CycleException, topsort} from './topsort.js';

/**
 * Given a Graph, graph, this function returns true if the graph has no cycles and returns false if it
 * does. This algorithm returns as soon as it detects the first cycle. You can use alg.findCycles
 * to get the actual list of cycles in the graph.
 *
 * @param graph - graph to detect whether it acyclic or not.
 * @returns whether graph contain cycles or not.
 */
export function isAcyclic(graph: Graph): boolean {
    if (graph.isDirected()) {
        try {
            topsort(graph);
        } catch (e) {
            if (e instanceof CycleException) {
                return false;
            }
            throw e;
        }
        return true;
    }

    return isUndirectedAcyclic(graph);
}

function isUndirectedAcyclic(graph: Graph): boolean {
    const visited = new Set<string>();

    function hasCycle(v: string, parentEdge?: Edge): boolean {
        visited.add(v);
        for (const edge of graph.nodeEdges(v) ?? []) {
            if (edge === parentEdge) continue;
            const w = edge.v === v ? edge.w : edge.v;
            if (visited.has(w) || hasCycle(w, edge)) {
                return true;
            }
        }
        return false;
    }

    for (const v of graph.nodes()) {
        if (!visited.has(v) && hasCycle(v)) {
            return false;
        }
    }
    return true;
}
