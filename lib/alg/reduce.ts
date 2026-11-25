import {Graph} from '../graph.js';

/*
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and processes the nodes in the order they are visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * Order must be one of "pre" or "post".
 */
export function reduce<T>(
    g: Graph,
    vs: string | string[],
    order: "pre" | "post",
    fn: (acc: T, v: string) => T,
    acc: T
): T {
    if (!Array.isArray(vs)) {
        vs = [vs];
    }

    const navigation = ((v: string) => (g.isDirected() ? g.successors(v) : g.neighbors(v)) ?? []);

    const visited: Record<string, boolean> = {};
    vs.forEach(function (v) {
        if (!g.hasNode(v)) {
            throw new Error("Graph does not have node: " + v);
        }

        acc = doReduce(v, order === "post", visited, navigation, fn, acc);
    });
    return acc;
}

function doReduce<T>(
    v: string,
    postorder: boolean,
    visited: Record<string, boolean>,
    navigation: (v: string) => string[],
    fn: (acc: T, v: string) => T,
    acc: T
): T {
    if (v in visited) {
        return acc;
    }

    const stack: {node: string; neighbors: string[]; next: number}[] = [];
    const enter = (node: string): void => {
        visited[node] = true;

        if (!postorder) {
            acc = fn(acc, node);
        }
        stack.push({node, neighbors: navigation(node), next: 0});
    };

    enter(v);
    while (stack.length > 0) {
        const frame = stack[stack.length - 1]!;
        if (frame.next < frame.neighbors.length) {
            const neighbor = frame.neighbors[frame.next++]!;
            if (!(neighbor in visited)) {
                enter(neighbor);
            }
        } else {
            stack.pop();
            if (postorder) {
                acc = fn(acc, frame.node);
            }
        }
    }
    return acc;
}
