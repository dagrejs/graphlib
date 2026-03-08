import { Graph } from '../graph';
import type { EdgeFunction, Path, WeightFunction } from '../types';
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
export declare function dijkstra(graph: Graph, source: string, weightFn?: WeightFunction, edgeFn?: EdgeFunction): Record<string, Path>;
//# sourceMappingURL=dijkstra.d.ts.map