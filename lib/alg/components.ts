import _each from 'lodash.foreach';
import _has from 'lodash.has';
import type { Graph } from '..';

/**
 * Finds all connected components in a graph and returns an array of these components.
 * Each component is itself an array that contains the ids of nodes in the component.
 * Complexity: O(|V|).
 *
 * @argument graph - graph to find components in.
 * @returns array of nodes list representing components
 */
export function components(g: Graph): string[][] {
  const visited = {};
  const cmpts: any[][] = [];
  let cmpt;

  function dfs(v) {
    if (_has(visited, v)) return;
    visited[v] = true;
    cmpt.push(v);
    _each(g.successors(v), dfs);
    _each(g.predecessors(v), dfs);
  }

  _each(g.nodes(), function (v) {
    cmpt = [];
    dfs(v);
    if (cmpt.length) {
      cmpts.push(cmpt);
    }
  });

  return cmpts;
}
