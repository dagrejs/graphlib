import type { Graph } from '..';
import * as _ from '../lodash';

export function tarjan(g: Graph) {
  let index = 0;
  const stack: any[] = [];
  const visited = {}; // node id -> { onStack, lowlink, index }
  const results: any[] = [];

  function dfs(v) {
    const entry = (visited[v] = {
      onStack: true,
      lowlink: index,
      index: index++,
    });
    stack.push(v);

    g.successors(v).forEach(function (w) {
      if (!_.has(visited, w)) {
        dfs(w);
        entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink);
      } else if (visited[w].onStack) {
        entry.lowlink = Math.min(entry.lowlink, visited[w].index);
      }
    });

    if (entry.lowlink === entry.index) {
      const cmpt: any[] = [];
      let w;
      do {
        w = stack.pop();
        visited[w].onStack = false;
        cmpt.push(w);
      } while (v !== w);
      results.push(cmpt);
    }
  }

  g.nodes().forEach(function (v) {
    if (!_.has(visited, v)) {
      dfs(v);
    }
  });

  return results;
}
