import {Graph} from '../graph.js';
import {reduce} from './reduce.js';

/*
 * Pre- or post-order traversal on the input graph.
 * Returns an array of the nodes in the order they were visited.
 *
 * If the order is not "post", it will be treated as "pre".
 */
export function dfs(g: Graph, vs: string | string[], order: "pre" | "post"): string[] {
    return reduce(g, vs, order, function (acc, v) {
        acc.push(v);
        return acc;
    }, [] as string[]);
}
