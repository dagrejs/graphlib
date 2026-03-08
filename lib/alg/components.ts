import {Graph} from '../graph';

/**
 * Finds all connected components in a graph and returns an array of these components.
 * Each component is itself an array that contains the ids of nodes in the component.
 * Complexity: O(|V|).
 *
 * @param graph - graph to find components in.
 * @returns array of nodes list representing components
 */
export function components(graph: Graph): string[][] {
    const visited: Record<string, boolean> = {};
    const cmpts: string[][] = [];
    let cmpt: string[];

    function dfs(v: string): void {
        if (v in visited) return;
        visited[v] = true;
        cmpt.push(v);
        graph.successors(v)!.forEach(dfs);
        graph.predecessors(v)!.forEach(dfs);
    }

    graph.nodes().forEach(function (v) {
        cmpt = [];
        dfs(v);
        if (cmpt.length) {
            cmpts.push(cmpt);
        }
    });

    return cmpts;
}
