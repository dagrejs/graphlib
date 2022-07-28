import { Graph } from "../graph";

export function components(g: Graph) {
  var visited = {};
  var cmpts: string[] = [];
  var cmpt;

  function dfs(v) {
    if (visited.hasOwnProperty(v)) return;
    visited[v] = true;
    cmpt.push(v);
    g.successors(v)!.forEach(dfs);
    g.predecessors(v)!.forEach(dfs);
  }

  g.nodes().forEach(function(v) {
    cmpt = [];
    dfs(v);
    if (cmpt.length) {
      cmpts.push(cmpt);
    }
  });

  return cmpts;
}
