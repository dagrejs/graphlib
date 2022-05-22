import * as _ from "lodash";
import { Graph } from "../graph";

type Order = "pre"|"post";

/*
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and returns the nodes in the order they were visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * Order must be one of "pre" or "post".
 */
export function dfs(g: Graph, vs, order: Order) {
  if (!_.isArray(vs)) {
    vs = [vs];
  }

  var navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);

  var acc = [];
  var visited = {};
  _.each(vs, function(v) {
    if (!g.hasNode(v)) {
      throw new Error("Graph does not have node: " + v);
    }

    doDfs(g, v, order === "post", visited, navigation, acc);
  });
  return acc;
}

function doDfs(g, v, postorder, visited, navigation, acc) {
  if (postorder) {
    var stack = [[v, false]];
    while (stack.length > 0) {
      var curr = stack.pop();
      if (curr[1]) {
        acc.push(curr[0]);
      } else {
        if (!_.has(visited, curr[0])) {
          visited[curr[0]] = true;
          stack.push([curr[0], true]);
          _.forEachRight(navigation(curr[0]), function(w) {
            stack.push([w, false]);
          });
        }
      }
    }
  } else {
    var stack = [v];
    while (stack.length > 0) {
      var curr = stack.pop();
      if (!_.has(visited, curr)) {
        visited[curr];
        acc.push(curr);
        _.forEachRight(navigation(curr), function(w) {
          stack.push(w);
        });
      }
    }
  }
}
