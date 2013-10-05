var Benchmark = require('benchmark');

var Graph = require('..').Graph;
var Digraph = require('..').Digraph;
var CGraph = require('..').CGraph;
var CDigraph = require('..').CDigraph;

var suite = new Benchmark.Suite();

var allConstructors = {
  Graph: Graph,
  Digraph: Digraph,
  CGraph: CGraph,
  CDigraph: CDigraph
};

Object.keys(allConstructors).forEach(function(C) {
  suite.add('new ' + C + '()', function() {
    new allConstructors[C]();
  });
});

suite.on('cycle', function(event) { console.log(String(event.target)); });

suite.run();
