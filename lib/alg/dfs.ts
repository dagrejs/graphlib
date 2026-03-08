import {Graph} from '../graph';
import {reduce} from './reduce';

/*
 * Pre- or post-order traversal on the input graph.
 * Returns an array of the nodes in the order they were visited.
 *
 * If the order is not "post", it will be treated as "pre".
 */
export function dfs(g: Graph, vs: string | string[], order: string): string[] {
    return reduce(g, vs, order, function (acc, v) {
        acc.push(v);
        return acc;
    }, [] as string[]);
}
