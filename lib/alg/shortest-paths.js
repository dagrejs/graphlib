var dijkstra = require("./dijkstra"),
  bellmanFord = require("./bellman-ford");

module.exports = shortestPaths;

function shortestPaths(g, source, weightFn, edgeFn){
  return runShortestPaths(
    g,
    source,
    weightFn,
    edgeFn || function(v) { return g.outEdges(v); }
  );
}

function runShortestPaths(g, source, weightFn, edgeFn) {
  if (weightFn === undefined) {
    return dijkstra(g, source, weightFn, edgeFn);
  }

  var negativeEdgeExists = false;
  var nodes = g.nodes();

  for (var i = 0; i < nodes.length; i++) {
    var adjList = edgeFn(nodes[i]);

    for (var j = 0; j < adjList.length; j++) {
      var edge = adjList[j];
      var inVertex = edge.v === nodes[i] ? edge.v : edge.w;
      var outVertex = inVertex === edge.v ? edge.w : edge.v;

      if (weightFn({ v: inVertex, w: outVertex }) < 0) {
        negativeEdgeExists = true;
      }
    }

    if (negativeEdgeExists) {
      return bellmanFord(g, source, weightFn, edgeFn);
    }
  }

  return dijkstra(g, source, weightFn, edgeFn);
}
