import {Graph} from '../graph.js';
import type {Edge, EdgeFunction, Path, WeightFunction} from '../types.js';

const DEFAULT_WEIGHT_FUNC: WeightFunction = () => 1;

export function bellmanFord(
    g: Graph,
    source: string,
    weightFn?: WeightFunction,
    edgeFn?: EdgeFunction
): Record<string, Path> {
    return runBellmanFord(
        g,
        String(source),
        weightFn || DEFAULT_WEIGHT_FUNC,
        edgeFn || function (v) {
            return g.outEdges(v) ?? [];
        }
    );
}

function runBellmanFord(
    g: Graph,
    source: string,
    weightFn: WeightFunction,
    edgeFn: EdgeFunction
): Record<string, Path> {
    const results: Record<string, Path> = {};
    let didADistanceUpgrade: boolean;
    let iterations = 0;
    const nodes = g.nodes();

    const relaxEdge = function (edge: Edge, v: string): void {
        const w = edge.v === v ? edge.w : edge.v;
        const uEntry = results[v];
        const wEntry = results[w];
        if (!uEntry || !wEntry) return;
        const edgeWeight = weightFn(edge);
        if (uEntry.distance + edgeWeight < wEntry.distance) {
            results[w] = {
                distance: uEntry.distance + edgeWeight,
                predecessor: v
            };
            didADistanceUpgrade = true;
        }
    };

    const relaxAllEdges = function (): void {
        nodes.forEach(function (vertex) {
            edgeFn(vertex).forEach(function (edge) {
                // Keep the original edge for weight lookup, even when traversed in reverse.
                relaxEdge(edge, vertex);
            });
        });
    };

    // Initialization
    nodes.forEach(function (v) {
        const distance = v === source ? 0 : Number.POSITIVE_INFINITY;
        results[v] = {distance: distance, predecessor: ''};
    });

    const numberOfNodes = nodes.length;

    // Relax all edges in |V|-1 iterations
    for (let i = 1; i < numberOfNodes; i++) {
        didADistanceUpgrade = false;
        iterations++;
        relaxAllEdges();
        if (!didADistanceUpgrade) {
            // Ιf no update was made in an iteration, Bellman-Ford has finished
            break;
        }
    }

    // Detect if the graph contains a negative weight cycle
    if (iterations === numberOfNodes - 1) {
        didADistanceUpgrade = false;
        relaxAllEdges();
        if (didADistanceUpgrade) {
            throw new Error("The graph contains a negative weight cycle");
        }
    }

    return results;
}
