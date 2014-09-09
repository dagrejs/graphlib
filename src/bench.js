#!/usr/bin/env node

var Benchmark = require("benchmark"),
    sprintf = require("sprintf").sprintf;

var Graph = require("..").Graph,
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
  options.setup = function() {
    this.count = Math.random() * 1000;
    this.nextInt = function(range) {
      return Math.floor(this.count++ % range );
    };
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
  var g = new Graph(),
      numEdges = numNodes * numNodes * edgeDensity,
      ks = keys(numNodes);

  ks.forEach(function(k) { g.node(k); });

  for (var i = 0; i < numEdges; ++i) {
    var v, w;
    do {
      v = ks[Math.floor(Math.random() * ks.length)];
      w = ks[Math.floor(Math.random() * ks.length)];
    } while (g.hasEdge(v, w));
    g.edge(v, w);
  }
  return g;
}

runBenchmark("constructor", function () { new Graph(); });

NODE_SIZES.forEach(function(size) {
  var g = buildGraph(size, EDGE_DENSITY),
      nodeIds = g.nodes(),
      nameSuffix = "(" + size + "," + EDGE_DENSITY + ")";

  runBenchmark("nodes" + nameSuffix, function() {
    g.nodes();
  });

  runBenchmark("node" + nameSuffix, function() {
    g.node("key");
  });

  runBenchmark("neighbors" + nameSuffix, function() {
    g.neighbors(nodeIds[this.nextInt(nodeIds.length)]);
  });

  runBenchmark("successors" + nameSuffix, function() {
    g.successors(nodeIds[this.nextInt(nodeIds.length)]);
  });

  runBenchmark("predecessors" + nameSuffix, function() {
    g.predecessors(nodeIds[this.nextInt(nodeIds.length)]);
  });

  runBenchmark("node + remove" + nameSuffix, function() {
    g.node("key");
    g.removeNode("key");
  });

  runBenchmark("edges" + nameSuffix, function() {
    g.edges();
  });

  runBenchmark("edge" + nameSuffix, function() {
    g.edge("from", "to");
  });

  runBenchmark("nodeEdges" + nameSuffix, function() {
    g.nodeEdges(nodeIds[this.nextInt(nodeIds.length)]);
  });

  runBenchmark("outEdges" + nameSuffix, function() {
    g.outEdges(nodeIds[this.nextInt(nodeIds.length)]);
  });

  runBenchmark("inEdges" + nameSuffix, function() {
    g.inEdges(nodeIds[this.nextInt(nodeIds.length)]);
  });

  runBenchmark("edge + remove" + nameSuffix, function() {
    g.edge("from", "to");
    g.removeEdge("from", "to");
  });

  runBenchmark("components" + nameSuffix, function() {
    alg.components(g);
  });

  runBenchmark("dijkstraAll" + nameSuffix, function() {
    alg.dijkstraAll(g);
  });

  runBenchmark("greedyFAS" + nameSuffix, function() {
    alg.greedyFAS(g);
  });

  runBenchmark("copy" + nameSuffix, function() {
    g.copy();
  });
});
