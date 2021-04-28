import { Graph } from '..';
import { dfs } from './dfs';

/**
 * Performs pre-order depth first traversal on the input graph. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * @argument graph - depth first traversal target.
 * @argument vs - nodes list to traverse.
 * @returns the nodes in the order they were visited as a list of their names.
 */
export function preorder(g: Graph, vs: string[]): string[] {
  return dfs(g, vs, 'pre');
}
