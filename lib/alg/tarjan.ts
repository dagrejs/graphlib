import {Graph} from '../graph';

interface VisitedEntry {
    onStack: boolean;
    lowlink: number;
    index: number;
}

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
    let index = 0;
    const stack: string[] = [];
    const visited: Record<string, VisitedEntry> = {}; // node id -> { onStack, lowlink, index }
    const results: string[][] = [];

    function dfs(v: string): void {
        const entry = visited[v] = {
            onStack: true,
            lowlink: index,
            index: index++
        };
        stack.push(v);

        graph.successors(v)!.forEach(function (w) {
            if (!(w in visited)) {
                dfs(w);
                entry.lowlink = Math.min(entry.lowlink, visited[w]!.lowlink);
            } else if (visited[w]!.onStack) {
                entry.lowlink = Math.min(entry.lowlink, visited[w]!.index);
            }
        });

        if (entry.lowlink === entry.index) {
            const cmpt: string[] = [];
            let w: string;
            do {
                w = stack.pop()!;
                visited[w]!.onStack = false;
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
