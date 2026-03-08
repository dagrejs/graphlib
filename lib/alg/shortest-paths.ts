import {dijkstra} from './dijkstra';
import {bellmanFord} from './bellman-ford';
import {Graph} from '../graph';
import type {EdgeFunction, Path, WeightFunction} from '../types';

export function shortestPaths(
    g: Graph,
    source: string,
    weightFn?: WeightFunction,
    edgeFn?: EdgeFunction
): Record<string, Path> {
    return runShortestPaths(
        g,
        source,
        weightFn,
        edgeFn ?? ((v: string) => {
            const edges = g.outEdges(v);
            return edges ?? [];
        })
    );
}

function runShortestPaths(
    g: Graph,
    source: string,
    weightFn: WeightFunction | undefined,
    edgeFn: EdgeFunction
): Record<string, Path> {
    if (weightFn === undefined) {
        return dijkstra(g, source, weightFn, edgeFn);
    }

    let negativeEdgeExists = false;
    const nodes = g.nodes();

    for (let i = 0; i < nodes.length; i++) {
        const adjList = edgeFn(nodes[i]!);

        for (let j = 0; j < adjList.length; j++) {
            const edge = adjList[j]!;
            const inVertex = edge.v === nodes[i] ? edge.v : edge.w;
            const outVertex = inVertex === edge.v ? edge.w : edge.v;

            if (weightFn({v: inVertex, w: outVertex}) < 0) {
                negativeEdgeExists = true;
            }
        }

        if (negativeEdgeExists) {
            return bellmanFord(g, source, weightFn, edgeFn);
        }
    }

    return dijkstra(g, source, weightFn, edgeFn);
}
