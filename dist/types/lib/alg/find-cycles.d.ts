import { Graph } from '../graph.js';
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
export declare function findCycles(graph: Graph): CycleNodeIds[];
//# sourceMappingURL=find-cycles.d.ts.map