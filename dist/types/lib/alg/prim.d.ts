import { Graph } from '../graph';
import type { WeightFunction } from '../types';
/**
 * Prim's algorithm takes a connected undirected graph and generates a minimum spanning tree. This
 * function returns the minimum spanning tree as an undirected graph. This algorithm is derived
 * from the description in "Introduction to Algorithms", Third Edition, Cormen, et al., Pg 634.
 * Complexity: O(|E| * log |V|);
 *
 * @param graph - graph to generate a minimum spanning tree of.
 * @param weightFn - function which takes edge e and returns the weight of it. It throws an Error if
 * the graph is not connected.
 * @returns minimum spanning tree of graph.
 */
export declare function prim(graph: Graph, weightFn: WeightFunction): Graph;
//# sourceMappingURL=prim.d.ts.map