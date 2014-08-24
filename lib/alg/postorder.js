var _ = require("lodash");

module.exports = postorder;

function postorder(g, root) {
  var visited = {},
      results = [];

  dfs(g, root, undefined, visited, results);

  return results;
}

function dfs(g, v, prev, visited, results) {
  if (_.has(visited, v)) {
    throw new Error("The input graph is not a tree: " + g);
  }
  visited[v] = true;
  g.successors(v).forEach(function(w) {
    if (g.isDirected() || w !== prev) {
      dfs(g, w, v, visited, results);
    }
  });
  results.push(v);
}
