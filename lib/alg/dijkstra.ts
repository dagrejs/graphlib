import {Graph} from '../graph';
import {PriorityQueue} from '../data/priority-queue';
import type {Edge, EdgeFunction, Path, WeightFunction} from '../types';

const DEFAULT_WEIGHT_FUNC: WeightFunction = () => 1;

/**
 * This function is an implementation of Dijkstra's algorithm which finds the shortest
 * path from source to all other nodes in graph. This function returns a map of
 * v -> { distance, predecessor }. The distance property holds the sum of the weights
 * from source to v along the shortest path or Number.POSITIVE_INFINITY if there is no path
 * from source. The predecessor property can be used to walk the individual elements of the
 * path from source to v in reverse order.
 * Complexity: O((|E| + |V|) * log |V|).
 *
 * @param graph - graph where to search paths.
 * @param source - node to start paths from.
 * @param weightFn - function which takes edge e and returns the weight of it. If no weightFn
 * is supplied then each edge is assumed to have a weight of 1. This function throws an
 * Error if any of the traversed edges have a negative edge weight.
 * @param edgeFn - function which takes a node v and returns the ids of all edges incident to it
 * for the purposes of shortest path traversal. By default this function uses the graph.outEdges.
 * @returns shortest paths map that starts from node source
 */
export function dijkstra(
    graph: Graph,
    source: string,
    weightFn?: WeightFunction,
    edgeFn?: EdgeFunction
): Record<string, Path> {
    const defaultEdgeFn: EdgeFunction = function (v) {
        return graph.outEdges(v)!;
    };

    return runDijkstra(graph, String(source),
        weightFn || DEFAULT_WEIGHT_FUNC,
        edgeFn || defaultEdgeFn);
}

function runDijkstra(
    graph: Graph,
    source: string,
    weightFn: WeightFunction,
    edgeFn: EdgeFunction
): Record<string, Path> {
    const results: Record<string, Path> = {};
    const pq = new PriorityQueue();
    let v: string, vEntry: Path;

    const updateNeighbors = function (edge: Edge): void {
        const w = edge.v !== v ? edge.v : edge.w;
        const wEntry = results[w]!;
        const weight = weightFn(edge);
        const distance = vEntry.distance + weight;

        if (weight < 0) {
            throw new Error("dijkstra does not allow negative edge weights. " +
                "Bad edge: " + edge + " Weight: " + weight);
        }

        if (distance < wEntry.distance) {
            wEntry.distance = distance;
            wEntry.predecessor = v;
            pq.decrease(w, distance);
        }
    };

    graph.nodes().forEach(function (v) {
        const distance = v === source ? 0 : Number.POSITIVE_INFINITY;
        results[v] = {distance: distance, predecessor: ''};
        pq.add(v, distance);
    });

    while (pq.size() > 0) {
        v = pq.removeMin()!;
        vEntry = results[v]!;
        if (vEntry.distance === Number.POSITIVE_INFINITY) {
            break;
        }

        edgeFn(v).forEach(updateNeighbors);
    }

    return results;
}
