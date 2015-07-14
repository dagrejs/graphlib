#!/usr/bin/env node

var Benchmark = require("benchmark"),
    seedrandom = require("seedrandom"),
    sprintf = require("sprintf").sprintf;

var seed = process.env.SEED;
seedrandom(seed, { global: true });
if (seed) {
  console.log("SEED: %s (%d)", seed, Math.random());
}

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

  ks.forEach(function(k) { g.setNode(k); });

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

NODE_SIZES.forEach(function(size) {
  var g = buildGraph(size, EDGE_DENSITY),
      nodes = g.nodes(),
      edges = g.edges(),
      nameSuffix = "(" + size + "," + EDGE_DENSITY + ")";

  runBenchmark("nodes" + nameSuffix, function() {
    g.nodes();
  });

  runBenchmark("sources" + nameSuffix, function() {
    g.sources();
  });

  runBenchmark("sinks" + nameSuffix, function() {
    g.sinks();
  });

  runBenchmark("filterNodes all" + nameSuffix, function() {
    g.filterNodes(function() { return true; });
  });

  runBenchmark("filterNodes none" + nameSuffix, function() {
    g.filterNodes(function() { return false; });
  });

  runBenchmark("setNode" + nameSuffix, function() {
    g.setNode("key", "label");
  });

  runBenchmark("node" + nameSuffix, function() {
    g.node(nodes[this.nextInt(nodes.length)]);
  });

  runBenchmark("set + removeNode" + nameSuffix, function() {
    g.setNode("key");
    g.removeNode("key");
  });

  runBenchmark("predecessors" + nameSuffix, function() {
    g.predecessors(nodes[this.nextInt(nodes.length)]);
  });

  runBenchmark("successors" + nameSuffix, function() {
    g.successors(nodes[this.nextInt(nodes.length)]);
  });

  runBenchmark("neighbors" + nameSuffix, function() {
    g.neighbors(nodes[this.nextInt(nodes.length)]);
  });

  runBenchmark("edges" + nameSuffix, function() {
    g.edges();
  });

  runBenchmark("setPath" + nameSuffix, function() {
    g.setPath(["a", "b", "c", "d", "e"]);
  });

  runBenchmark("setEdge" + nameSuffix, function() {
    g.setEdge("from", "to", "label");
  });

  runBenchmark("edge" + nameSuffix, function() {
    var edge = edges[this.nextInt(edges.length)];
    g.edge(edge);
  });

  runBenchmark("set + removeEdge" + nameSuffix, function() {
    g.setEdge("from", "to");
    g.removeEdge("from", "to");
  });

  runBenchmark("inEdges" + nameSuffix, function() {
    g.inEdges(nodes[this.nextInt(nodes.length)]);
  });

  runBenchmark("outEdges" + nameSuffix, function() {
    g.outEdges(nodes[this.nextInt(nodes.length)]);
  });

  runBenchmark("nodeEdges" + nameSuffix, function() {
    g.nodeEdges(nodes[this.nextInt(nodes.length)]);
  });

  runBenchmark("components" + nameSuffix, function() {
    alg.components(g);
  });

  runBenchmark("dijkstraAll" + nameSuffix, function() {
    alg.dijkstraAll(g);
  });
});
