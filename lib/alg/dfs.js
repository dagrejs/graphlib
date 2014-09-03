var _ = require("lodash");

module.exports = dfs;

/*
 * dfs(graph, roots, order, [traversalFunction], [successorFunction])
 *
 * A helper function for doing dfs traversals in pre- or post-order. The root
 * node must be in the graph.
 *
 * Order must be one of "pre" or "post".
 *
 * The traversal function can be used for two purposes: to act on elements as
 * they are visited and to signal either a) that traversal should be terminated
 * for the graph, via a return value of false, or b) that traversal of the
 * current branch should be terminated, via a return value of null.
 *
 * The successor function takes a node and returns a list of zero or more nodes
 * that should be traversed. By default it uses the graph's "successor"
 * function.
 */
function dfs(g, vs, order, fn, successors) {
  if (!successors) {
    successors = g.successors.bind(g);
  }

  if (!fn) {
    fn = _.constant(true);
  }

  if (!_.isArray(vs)) {
    vs = [vs];
  }

  var acc = [],
      visited = {};
  _.each(vs, function(v) {
    if (!g.hasNode(v)) {
      throw new Error("Graph does not have node: " + v);
    }

    doDfs(v, order, fn, successors, visited, acc);
  });
  return acc;
}

function doDfs(v, order, fn, successors, visited, acc) {
  if (!_.has(visited, v)) {
    visited[v] = true;

    var result = fn(v);
    if (result === false) { return false; }
    if (result === null) { return null; }

    if (order === "pre") { acc.push(v); }
    _.each(successors(v), function(w) {
      if (doDfs(w, order, fn, successors, visited, acc) === false) {
        return false;
      }
    });
    if (order === "post") { acc.push(v); }
  }
}
