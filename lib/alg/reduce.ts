import {Graph} from '../graph';

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
    order: string,
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

        acc = doReduce(g, v, order === "post", visited, navigation, fn, acc);
    });
    return acc;
}

function doReduce<T>(
    g: Graph,
    v: string,
    postorder: boolean,
    visited: Record<string, boolean>,
    navigation: (v: string) => string[],
    fn: (acc: T, v: string) => T,
    acc: T
): T {
    if (!(v in visited)) {
        visited[v] = true;

        if (!postorder) {
            acc = fn(acc, v);
        }
        navigation(v).forEach(function (w) {
            acc = doReduce(g, w, postorder, visited, navigation, fn, acc);
        });
        if (postorder) {
            acc = fn(acc, v);
        }
    }
    return acc;
}
