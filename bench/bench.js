var Benchmark = require('benchmark');

var Graph = require('..').Graph,
    Digraph = require('..').Digraph,
    CGraph = require('..').CGraph,
    CDigraph = require('..').CDigraph,
    nodesFromList = require('..').filter.nodesFromList;

function runSuite(name, func) {
  var suite = new Benchmark.Suite(name);
  suite.on('start', function() {
    console.log();
    console.log(this.name);
    console.log(new Array(this.name.length + 1).join('='));
  });
  suite.on('cycle', function(event) {
    console.log('    ' + event.target);
  });
  suite.on('error', function(event) {
    console.error('    ' + event.target.error);
  });
  func(suite);
  suite.run();
}

var allConstructors = {
  Graph: Graph,
  Digraph: Digraph,
  CGraph: CGraph,
  CDigraph: CDigraph
};

runSuite('Constructors', function(suite) {
  Object.keys(allConstructors).forEach(function(c) {
    suite.add(c, function() {
      new allConstructors[c]();
    });
  });
});

runSuite('copy', function(suite) {
  Object.keys(allConstructors).forEach(function(c) {
    var g = buildGraph(allConstructors[c]);
    suite.add(c, function() {
      g.copy();
    });
  });
});

runSuite('filterNodes', function(suite) {
  Object.keys(allConstructors).forEach(function(c) {
    var g = buildGraph(allConstructors[c]);
    var us = g.nodes().filter(function(u) { return u % 2; });
    suite.add(c, function() {
      g.filterNodes(nodesFromList(us));
    });
  });
});

// TODO: separate out test setup code. For some reason benchmark wants to
// recompile the function losing the local context...
runSuite('addNode', function(suite) {
  Object.keys(allConstructors).forEach(function(c) {
    suite.add(c, function() {
      var g = new allConstructors[c]();
      g.addNode(0);
    });
  });
});

runSuite('addDelNode', function(suite) {
  Object.keys(allConstructors).forEach(function(c) {
    suite.add(c, function() {
      var g = new allConstructors[c]();
      g.addNode(0);
      g.delNode(0);
    });
  });
});

runSuite('addEdge', function(suite) {
  Object.keys(allConstructors).forEach(function(c) {
    suite.add(c, function() {
      var g = new allConstructors[c]();
      g.addNode(0);
      g.addNode(1);
      g.addEdge('A', 0, 1);
    });
  });
});

runSuite('addDelEdge', function(suite) {
  Object.keys(allConstructors).forEach(function(c) {
    suite.add(c, function() {
      var g = new allConstructors[c]();
      g.addNode(0);
      g.addNode(1);
      g.addEdge('A', 0, 1);
      g.delEdge('A');
    });
  });
});

function buildGraph(C) {
  var g = new C(),
      i, j;

  for (i = 0; i < 200; ++i) {
    g.addNode(i);
    for (j = Math.floor(i / 2); j > 0; j = Math.floor(j / 2)) {
      g.addEdge(null, j, i);
    }
  }

  return g;
}
