var _ = require("lodash"),
    Digraph = require("../digraph"),
    List = require("../data/List");

/*
 * A greedy heuristic for finding a feedback arc set for a graph. A feedback
 * arc set is a set of edges that can be removed to make a graph acyclic.
 * The algorithm comes from: P. Eades, X. Lin, and W. F. Smyth, "A fast and
 * effective heuristic for the feedback arc set problem." This implementation
 * adjusts that from the paper to allow for weighted edges.
 */
module.exports = greedyFAS;

var DEFAULT_WEIGHT_FN = _.constant(1);

function greedyFAS(g, weightFn) {
  if (g.nodeCount() <= 1) {
    return [];
  }
  return doGreedyFAS(buildGraph(g, weightFn || DEFAULT_WEIGHT_FN));
}

function doGreedyFAS(g) {
  var results = [],
      graphObj = g.getGraph(),
      buckets = graphObj.buckets,
      sources = buckets[buckets.length - 1],
      sinks = buckets[0];

  var node;
  while (g.nodeCount()) {
    while ((node = sinks.dequeue()))   { removeNode(g, node); }
    while ((node = sources.dequeue())) { removeNode(g, node); }
    if (g.nodeCount()) {
      for (var i = buckets.length - 2; i > 0; --i) {
        node = buckets[i].dequeue();
        if (node) {
          results = results.concat(removeNode(g, node, true));
          break;
        }
      }
    }
  }

  return results;
}

function removeNode(g, node, collectPredecessors) {
  var results = collectPredecessors ? [] : undefined,
      v = node.v;

  _.each(g.inEdges(v), function(edge) {
    var weight = edge.label,
        uCtx = g.getNode(edge.v);

    if (collectPredecessors) {
      results.push({ v: edge.v, w: edge.w });
    }

    uCtx.out -= weight;
    assignBucket(g.getGraph(), uCtx);
  });

  _.each(g.outEdges(v), function(edge) {
    var weight = edge.label,
        wCtx = g.getNode(edge.w);
    wCtx.in -= weight;
    assignBucket(g.getGraph(), wCtx);
  });

  g.removeNode(v);

  return results;
}

function buildGraph(g, weightFn) {
  var fasGraph = new Digraph(),
      graphObj = {},
      maxIn = 0,
      maxOut = 0;

  fasGraph.setGraph(graphObj);

  _.each(g.nodeIds(), function(v) {
    fasGraph.setNode(v, { v: v, in: 0, out: 0 });
  });

  _.each(g.edges(), function(edge) {
    var weight = weightFn(edge);
    fasGraph.setEdge(edge.v, edge.w, weight);
    fasGraph.updateNode(edge.v, function(label) {
      label.out += weight;
      maxOut = Math.max(maxOut, label.out);
      return label;
    });
    fasGraph.updateNode(edge.w, function(label) {
      label.in += weight;
      maxIn = Math.max(maxIn, label.in);
      return label;
    });
  });

  graphObj.buckets = _.range(maxOut + maxIn + 3).map(function() { return new List(); });
  graphObj.zeroIdx = maxIn + 1;

  _.each(fasGraph.nodes(), function(node) { assignBucket(graphObj, node.label); });

  return fasGraph;
}

function assignBucket(graphState, node) {
  var buckets = graphState.buckets;
  if (!node.out) {
    buckets[0].enqueue(node);
  } else if (!node.in) {
    buckets[buckets.length - 1].enqueue(node);
  } else {
    buckets[node.out - node.in + graphState.zeroIdx].enqueue(node);
  }
}
