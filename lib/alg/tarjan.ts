import {Graph} from '../graph.js';
import type {Edge} from '../types.js';

interface VisitedEntry {
    onStack: boolean;
    lowlink: number;
    index: number;
}

type VisitNeighbor = (w: string, edge?: Edge) => void;
type ForEachNeighbor = (visit: VisitNeighbor, v: string, parentEdge?: Edge) => void;

/**
 * This function is an implementation of Tarjan's algorithm which finds all strongly connected
 * components in the directed graph g. Each strongly connected component is composed of nodes that
 * can reach all other nodes in the component via directed edges. A strongly connected component
 * can consist of a single node if that node cannot both reach and be reached by any other
 * specific node in the graph. Components of more than one node are guaranteed to have at least
 * one cycle.
 * Complexity: O(|V| + |E|).
 *
 * @param graph - graph to find all strongly connected components of.
 * @returns an array of components. Each component is itself an array that contains
 * the ids of all nodes in the component.
 */
export function tarjan(graph: Graph): string[][] {
    return tarjanCore(graph, (visit, v) => {
        graph.successors(v)?.forEach(w => visit(w));
    });
}

export function tarjanUndirected(graph: Graph): string[][] {
    return tarjanCore(graph, (visit, v, parentEdge) => {
        graph.nodeEdges(v)?.forEach(edge => {
            if (edge === parentEdge) return;
            visit(edge.v === v ? edge.w : edge.v, edge);
        });
    });
}

function tarjanCore(graph: Graph, forEachNeighbor: ForEachNeighbor): string[][] {
    let index = 0;
    const stack: string[] = [];
    const visited: Record<string, VisitedEntry> = Object.create(null); // node id -> { onStack, lowlink, index }
    const results: string[][] = [];

    function dfs(v: string, parentEdge?: Edge): void {
        const entry = visited[v] = {
            onStack: true,
            lowlink: index,
            index: index++
        };
        stack.push(v);

        forEachNeighbor((w: string, edge?: Edge): void => {
            if (!(w in visited)) {
                dfs(w, edge);
                const wEntry = visited[w];
                if (wEntry) {
                    entry.lowlink = Math.min(entry.lowlink, wEntry.lowlink);
                }
            } else {
                const wEntry = visited[w];
                if (wEntry?.onStack) {
                    entry.lowlink = Math.min(entry.lowlink, wEntry.index);
                }
            }
        }, v, parentEdge);

        if (entry.lowlink === entry.index) {
            const cmpt: string[] = [];
            let w: string;
            do {
                w = stack.pop()!;
                const wEntry = visited[w];
                if (wEntry) {
                    wEntry.onStack = false;
                }
                cmpt.push(w);
            } while (v !== w);
            results.push(cmpt);
        }
    }

    graph.nodes().forEach(function (v) {
        if (!(v in visited)) {
            dfs(v);
        }
    });

    return results;
}
