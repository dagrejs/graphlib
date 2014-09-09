var _ = require("lodash");

module.exports = components;

function components(g) {
  var visited = {},
      cmpts = [];

  function dfs(v, cmpt) {
    visited[v] = true;
    cmpt.push(v);
    _.each(g.neighbors(v), function(w) {
      if (!_.has(visited, w)) {
        dfs(w, cmpt);
      }
    });
  }

  _.each(g.allNodes(), function(v) {
    if (_.has(visited, v)) return;
    var cmpt = [];
    dfs(v, cmpt);
    cmpts.push(cmpt);
  });

  return cmpts;
}
