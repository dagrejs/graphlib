import { Graph } from '../graph';
import type { EdgeFunction, Path, WeightFunction } from '../types';
/**
 * This function finds the shortest path from each node to every other reachable node in
 * the graph. It is similar to alg.dijkstra, but instead of returning a single-source
 * array, it returns a mapping of source -> alg.dijkstra(g, source, weightFn, edgeFn).
 * Complexity: O(|V| * (|E| + |V|) * log |V|).
 *
 * @param graph - graph where to search paths.
 * @param weightFn - function which takes edge e and returns the weight of it. If no weightFn
 * is supplied then each edge is assumed to have a weight of 1. This function throws an
 * Error if any of the traversed edges have a negative edge weight.
 * @param edgeFn - function which takes a node v and returns the ids of all edges incident to it
 * for the purposes of shortest path traversal. By default this function uses the graph.outEdges.
 * @returns shortest paths map.
 */
export declare function dijkstraAll(graph: Graph, weightFn?: WeightFunction, edgeFn?: EdgeFunction): Record<string, Record<string, Path>>;
//# sourceMappingURL=dijkstra-all.d.ts.map