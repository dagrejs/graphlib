import {Graph} from '../graph.js';
import type {Edge} from '../types.js';
import {tarjan} from './tarjan.js';

/**
 * Given a Graph, graph, this function returns all nodes that are part of a cycle.
 * For undirected graphs, connected components of non-bridge edges are returned.
 * Complexity: O(|V| + |E|).
 *
 * @param graph - graph where to search cycles.
 * @returns cycles list.
 */
export function findCycles(graph: Graph): string[][] {
    if (!graph.isDirected()) {
        return findUndirectedCycles(graph);
    }

    return tarjan(graph).filter(function (cmpt) {
        const firstNode = cmpt[0];
        if (!firstNode) return false;
        return cmpt.length > 1
            || (cmpt.length === 1 && (graph.outEdges(firstNode, firstNode) ?? []).length > 0);
    });
}

/**
 * In an undirected graph, an edge belongs to a cycle if and only if it is not a bridge.
 * Return the connected components formed by those edges.
 */
function findUndirectedCycles(graph: Graph): string[][] {
    const nodes = graph.nodes();
    const edges = graph.edges();

    const adjacency = new Map<string, {edge: Edge; neighbor: string}[]>();

    nodes.forEach(node => adjacency.set(node, []));

    edges.forEach(edge => {
        if (edge.v === edge.w) return;

        adjacency.get(edge.v)!.push({
            edge,
            neighbor: edge.w
        });

        adjacency.get(edge.w)!.push({
            edge,
            neighbor: edge.v
        });
    });

    const discovery = new Map<string, number>();
    const low = new Map<string, number>();
    const bridges = new Set<Edge>();

    let nextIndex = 0;

    function visit(node: string, parentEdge?: Edge): void {
        const nodeIndex = nextIndex++;

        discovery.set(node, nodeIndex);
        low.set(node, nodeIndex);

        adjacency.get(node)!.forEach(({edge, neighbor}) => {
            if (edge === parentEdge) return;

            if (!discovery.has(neighbor)) {
                visit(neighbor, edge);

                const childLow = low.get(neighbor)!;

                low.set(
                    node,
                    Math.min(low.get(node)!, childLow)
                );

                if (childLow > nodeIndex) {
                    bridges.add(edge);
                }
            } else {
                low.set(
                    node,
                    Math.min(
                        low.get(node)!,
                        discovery.get(neighbor)!
                    )
                );
            }
        });
    }

    nodes.forEach(node => {
        if (!discovery.has(node)) {
            visit(node);
        }
    });

    // Keep all non-bridge edges and self-loops.
    const cyclicAdjacency = new Map<string, Set<string>>();

    nodes.forEach(node => cyclicAdjacency.set(node, new Set()));

    edges.forEach(edge => {
        if (edge.v === edge.w || !bridges.has(edge)) {
            cyclicAdjacency.get(edge.v)!.add(edge.w);
            cyclicAdjacency.get(edge.w)!.add(edge.v);
        }
    });

    // Extract connected components containing cycle edges.
    const visited = new Set<string>();
    const cycles: string[][] = [];

    nodes.forEach(node => {
        const neighbors = cyclicAdjacency.get(node)!;

        if (visited.has(node) || neighbors.size === 0) {
            return;
        }

        const component: string[] = [];
        const stack = [node];

        visited.add(node);

        while (stack.length > 0) {
            const current = stack.pop()!;

            component.push(current);

            cyclicAdjacency.get(current)!.forEach(neighbor => {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    stack.push(neighbor);
                }
            });
        }

        cycles.push(component);
    });

    return cycles;
}
