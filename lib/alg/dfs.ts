import _has from 'lodash.has';
import type { Graph } from '..';

/**
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and returns the nodes in the order they were visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * Order must be one of "pre" or "post".
 */
export function dfs(g: Graph, vs: string[], order: 'pre' | 'post'): string[] {
  const navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);

  const acc = [];
  const visited = {};
  for (const v of vs) {
    if (!g.hasNode(v)) {
      throw new Error('Graph does not have node: ' + v);
    }

    doDfs(g, v, order === 'post', visited, navigation, acc);
  }
  return acc;
}

function doDfs(g, v, postorder, visited, navigation, acc) {
  if (!_has(visited, v)) {
    visited[v] = true;

    if (!postorder) {
      acc.push(v);
    }
    for (const w of navigation(v)) {
      doDfs(g, w, postorder, visited, navigation, acc);
    }
    if (postorder) {
      acc.push(v);
    }
  }
}
