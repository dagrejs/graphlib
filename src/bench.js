#!/usr/bin/env node

var Benchmark = require("benchmark"),
    sprintf = require("sprintf").sprintf;

var Digraph = require("..").Digraph,
    alg = require("..").alg;

var NODE_SIZES = [100],
    EDGE_DENSITY = 0.2,
    KEY_SIZE = 10;

function runBenchmark(name, fn) {
  var options = {};
  options.onComplete = function(bench) {
    var target = bench.target,
        hz = target.hz,
        stats = target.stats,
        rme = stats.rme,
        samples = stats.sample.length,
        msg = sprintf("    %25s: %13s ops/sec \xb1 %s%% (%3d run(s) sampled)",
                      target.name,
                      Benchmark.formatNumber(hz.toFixed(2)),
                      rme.toFixed(2),
                      samples);
    console.log(msg);
  };
  options.onError = function(bench) {
    console.error("    " + bench.target.error);
  };
  new Benchmark(name, fn, options).run();
}

function keys(count) {
  var ks = [],
      k;
  for (var i = 0; i < count; ++i) {
    k = "";
    for (var j = 0; j < KEY_SIZE; ++j) {
      k += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }
    ks.push(k);
  }
  return ks;
}

function buildGraph(numNodes, edgeDensity) {
  var g = new Digraph(),
      numEdges = numNodes * numNodes * edgeDensity,
      ks = keys(numNodes);

  ks.forEach(function(k) { g.set(k); });

  for (var i = 0; i < numEdges; ++i) {
    var v, w;
    do {
      v = ks[Math.floor(Math.random() * ks.length)];
      w = ks[Math.floor(Math.random() * ks.length)];
    } while (g.hasEdge(v, w));
    g.setEdge(v, w);
  }
  return g;
}

runBenchmark("constructor", function () { new Digraph(); });

NODE_SIZES.forEach(function(size) {
  var g = buildGraph(size, EDGE_DENSITY),
      nodeIds = g.graphNodeIds(),
      node = nodeIds[Math.floor(Math.random() * nodeIds.length)],
      edges = g.graphEdges(),
      edge = edges[Math.floor(Math.random() * edges.length)],
      nameSuffix = "(" + size + "," + EDGE_DENSITY + ")";

  runBenchmark("graphNodeIds" + nameSuffix, function() {
    g.graphNodeIds();
  });

  runBenchmark("graphSources" + nameSuffix, function() {
    g.graphSources();
  });

  runBenchmark("graphSinks" + nameSuffix, function() {
    g.graphSinks();
  });

  runBenchmark("set" + nameSuffix, function() {
    g.set("key", "label");
  });

  runBenchmark("get" + nameSuffix, function() {
    g.get(node);
  });

  runBenchmark("successors" + nameSuffix, function() {
    g.successors(node);
  });

  runBenchmark("predecessors" + nameSuffix, function() {
    g.predecessors(node);
  });

  runBenchmark("neighbors" + nameSuffix, function() {
    g.neighbors(node);
  });

  runBenchmark("setRemove" + nameSuffix, function() {
    g.set("key");
    g.remove("key");
  });

  runBenchmark("graphEdges" + nameSuffix, function() {
    g.graphEdges();
  });

  runBenchmark("setEdge" + nameSuffix, function() {
    g.setEdge("from", "to", "label");
  });

  runBenchmark("getEdge" + nameSuffix, function() {
    g.getEdge(edge.v, edge.w);
  });

  runBenchmark("outEdges" + nameSuffix, function() {
    g.outEdges(node);
  });

  runBenchmark("inEdges" + nameSuffix, function() {
    g.inEdges(node);
  });

  runBenchmark("edges" + nameSuffix, function() {
    g.edges(node);
  });

  runBenchmark("setRemoveEdge" + nameSuffix, function() {
    g.setEdge("from", "to", "label");
    g.removeEdge("from", "to");
  });

  runBenchmark("components" + nameSuffix, function() {
    alg.components(g);
  });

  runBenchmark("dijkstraAll" + nameSuffix, function() {
    alg.dijkstraAll(g);
  });

  runBenchmark("copy" + nameSuffix, function() {
    g.copy();
  });
});
