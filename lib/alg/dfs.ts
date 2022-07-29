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
export function dfs(g: Graph, vOrVs: string|string[], order: Order): string[] {
  let vs: string[];
  if (Array.isArray(vOrVs)) {
    vs = vOrVs
  } else {
    vs = [vOrVs as string];
  }

  var navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);

  var acc = [];
  var visited = {};
  vs.forEach(function(v) {
    if (!g.hasNode(v)) {
      throw new Error("Graph does not have node: " + v);
    }

    doDfs(g, v, order === "post", visited, navigation, acc);
  });
  return acc;
}

function doDfs(g, v, postorder, visited, navigation, acc) {
  if (!visited.hasOwnProperty(v)) {
    visited[v] = true;

    if (!postorder) { acc.push(v); }
    navigation(v).forEach(function(w) {
      doDfs(g, w, postorder, visited, navigation, acc);
    });
    if (postorder) { acc.push(v); }
  }
}
