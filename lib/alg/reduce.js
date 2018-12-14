var _ = require("../lodash");

module.exports = reduce;

/*
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and processes the nodes in the order they are visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * Order must be one of "pre" or "post".
 */
function reduce(g, vs, order, fn, acc) {
  if (!_.isArray(vs)) {
    vs = [vs];
  }

  var navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);

  var visited = {};
  _.each(vs, function(v) {
    if (!g.hasNode(v)) {
      throw new Error("Graph does not have node: " + v);
    }

    acc = doReduce(g, v, order === "post", visited, navigation, fn, acc);
  });
  return acc;
}

function doReduce(g, v, postorder, visited, navigation, fn, acc) {
  if (!_.has(visited, v)) {
    visited[v] = true;

    if (!postorder) { acc = fn(acc, v); }
    _.each(navigation(v), function(w) {
      acc = doReduce(g, w, postorder, visited, navigation, fn, acc);
    });
    if (postorder) { acc = fn(acc, v); }
  }
  return acc;
}
