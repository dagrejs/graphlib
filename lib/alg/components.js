var _ = require("lodash");

module.exports = components;

function components(g) {
  var results = [];
  var visited = {};

  function dfs(component, v) {
    if (!_.has(visited, v)) {
      visited[v] = true;
      component.push(v);
      _.each(g.neighbors(v), _.partial(dfs, component));
    }
  }

  _.each(g.nodeIds(), function(v) {
    var component = [];
    dfs(component, v);
    if (component.length > 0) {
      results.push(component);
    }
  });

  return results;
}
