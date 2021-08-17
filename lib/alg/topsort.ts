import _has from 'lodash.has';

import type { Graph } from '..';

/**
 * Given a Graph graph this function applies topological sorting to it.
 * If the graph has a cycle it is impossible to generate such a list and CycleException is thrown.
 * Complexity: O(|V| + |E|).
 *
 * @argument graph - graph to apply topological sorting to.
 * @returns an array of nodes such that for each edge u -> v, u appears before v in the array.
 */
export function topsort(g: Graph): string[] {
  const visited = {};
  const stack = {};
  const results: any[] = [];

  function visit(node) {
    if (_has(stack, node)) {
      throw new CycleException();
    }

    if (!_has(visited, node)) {
      stack[node] = true;
      visited[node] = true;
      g.predecessors(node)?.forEach(visit);
      delete stack[node];
      results.push(node);
    }
  }

  g.sinks()?.forEach(visit);

  if (Object.keys(visited).length !== g.nodeCount()) {
    throw new CycleException();
  }

  return results;
}

export class CycleException extends Error {}
