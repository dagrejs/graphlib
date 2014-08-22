var PriorityQueue = require("cp-data").PriorityQueue;

module.exports = dijkstra;

var CONSTANT_WEIGHT_FUNC = function() { return 1; };

dijkstra.CONSTANT_WEIGHT_FUNC = CONSTANT_WEIGHT_FUNC;
dijkstra.LABEL_WEIGHT_FUNC = function(edge) { return edge.label; };

function dijkstra(g, source, weightFunc, edgeFunc) {
  return runDijkstra(g, String(source),
                     weightFunc || CONSTANT_WEIGHT_FUNC,
                     edgeFunc || function(v) { return g.outEdges(v); });
}

function runDijkstra(g, source, weightFunc, edgeFunc) {
  var results = {},
      pq = new PriorityQueue(),
      v, vEntry;

  var updateNeighbors = function(edge) {
    var w = edge.v !== v ? edge.v : edge.w,
        wEntry = results[w],
        weight = weightFunc(edge),
        distance = vEntry.distance + weight;

    if (weight < 0) {
      throw new Error("dijkstra does not allow negative edge weights. " +
                      "Bad edge: " + edge + " Weight: " + weight);
    }

    if (distance < wEntry.distance) {
      wEntry.distance = distance;
      wEntry.predecessor = v;
      pq.decrease(w, distance);
    }
  };

  g.graphNodeIds().forEach(function(v) {
    var distance = v === source ? 0 : Number.POSITIVE_INFINITY;
    results[v] = { distance: distance };
    pq.add(v, distance);
  });

  while (pq.size() > 0) {
    v = pq.removeMin();
    vEntry = results[v];
    if (vEntry.distance === Number.POSITIVE_INFINITY) {
      break;
    }

    edgeFunc(v).forEach(updateNeighbors);
  }

  return results;
}
