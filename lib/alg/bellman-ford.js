var _ = require("../lodash");

module.exports = bellmanFord;

var DEFAULT_WEIGHT_FUNC = _.constant(1);

function bellmanFord(g, source, weightFn, edgeFn) {
  return runBellmanFord(
    g,
    String(source),
    weightFn || DEFAULT_WEIGHT_FUNC,
    edgeFn || function(v) { return g.outEdges(v); }
  );
}


function runBellmanFord(g, source, weightFn, edgeFn) {
  var results = {},
    didADistanceUpgrade = true,
    iterations = 0,
    nodes = g.nodes();

  var relaxEdge = function(edge) {
    var edgeWeight = weightFn(edge);
    if( results[edge.v].distance + edgeWeight < results[edge.w].distance ){
      results[edge.w] = {
        distance: results[edge.v].distance + edgeWeight,
        predecessor: edge.v
      };
      didADistanceUpgrade = true;
    }
  };

  var relaxAllEdges = function() {
    nodes.forEach(function(vertex) {
      edgeFn(vertex).forEach(function(edge) {
        // If the vertex on which the edgeFun in called is
        // the edge.w, then we treat the edge as if it was reversed
        var inVertex = edge.v === vertex ? edge.v : edge.w;
        var outVertex = inVertex === edge.v ? edge.w : edge.v;
        relaxEdge({ v: inVertex, w: outVertex });
      });
    });
  };

  // Initialization
  nodes.forEach(function(v) {
    var distance = v === source ? 0 : Number.POSITIVE_INFINITY;
    results[v] = { distance: distance };
  });

  var numberOfNodes = nodes.length;

  // Relax all edges in |V|-1 iterations
  for(var i = 1; i < numberOfNodes; i++){
    didADistanceUpgrade = false;
    iterations++;
    relaxAllEdges();
    if (!didADistanceUpgrade) {
      // Ιf no update was made in an iteration, Bellman-Ford has finished
      break;
    }
  }

  // Detect if the graph contains a negative weight cycle
  if (iterations === numberOfNodes - 1) {
    didADistanceUpgrade = false;
    relaxAllEdges();
    if (didADistanceUpgrade) {
      throw new Error("The graph contains a negative weight cycle");
    }
  }

  return results;
}
