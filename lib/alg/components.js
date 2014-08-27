var _ = require("lodash"),
    preorder = require("./preorder");

module.exports = components;

function components(g) {
  var visited = {};

  var cmpts = _.map(g.nodeIds(), function(v) {
    return preorder(g, v, function(w) {
      var hasVisited = _.has(visited, w);
      visited[w] = true;
      return !hasVisited || null;
    }, g.neighbors.bind(g));
  });

  return _.filter(cmpts, function(cmpt) { return !_.isEmpty(cmpt); });
}
