import {Graph} from '../graph';
import {PriorityQueue} from '../data/priority-queue';
import type {Edge, WeightFunction} from '../types';

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
export function prim(graph: Graph, weightFn: WeightFunction): Graph {
    const result = new Graph();
    const parents: Record<string, string> = {};
    const pq = new PriorityQueue();
    let v: string;

    function updateNeighbors(edge: Edge): void {
        const w = edge.v === v ? edge.w : edge.v;
        const pri = pq.priority(w);
        if (pri !== undefined) {
            const edgeWeight = weightFn(edge);
            if (edgeWeight < pri) {
                parents[w] = v;
                pq.decrease(w, edgeWeight);
            }
        }
    }

    if (graph.nodeCount() === 0) {
        return result;
    }

    graph.nodes().forEach(function (v) {
        pq.add(v, Number.POSITIVE_INFINITY);
        result.setNode(v);
    });

    // Start from an arbitrary node
    pq.decrease(graph.nodes()[0]!, 0);

    let init = false;
    while (pq.size() > 0) {
        v = pq.removeMin()!;
        if (v in parents) {
            result.setEdge(v, parents[v]!);
        } else if (init) {
            throw new Error("Input graph is not connected: " + graph);
        } else {
            init = true;
        }

        graph.nodeEdges(v)!.forEach(updateNeighbors);
    }

    return result;
}
