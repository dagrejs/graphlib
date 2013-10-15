var CDigraph = require('..').CDigraph,
    Digraph = require('..').Digraph;

describe('CDigraph', function() {
  require('./abstract-Digraph-test')(CDigraph);
  require('./abstract-compoundify-test.js')('CDigraph', CDigraph, 'Digraph', Digraph);
});
