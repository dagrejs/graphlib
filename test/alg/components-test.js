var assert = require('../assert'),
    Graph = require('../..').Graph,
    Digraph = require('../..').Digraph,
    components = require('../..').alg.components;

describe('alg.components', function() {
  it('returns `[]` for an empty graph', function() {
    assert.deepEqual(components(new Graph()), []);
  });

  it('returns `[[a], [b]]` when `a` and `b` are not connected by a path', function() {
    var graph = new Graph();
    graph.addNode('a');
    graph.addNode('b');
    assert.deepEqual(components(graph), [['a'], ['b']]);
  });

  it('returns `[[a, b]]` when `a` and `b` are connected', function() {
    var graph = new Graph();
    graph.addNode('a');
    graph.addNode('b');
    graph.addEdge(null, 'a', 'b');
    assert.deepEqual(components(graph), [['a', 'b']]);
  });

  it('returns `[[a, b, c]]` for a graph `a -> b -> c`', function() {
    var graph = new Graph();
    graph.addNode('a');
    graph.addNode('b');
    graph.addNode('c');
    graph.addEdge(null, 'a', 'b');
    graph.addEdge(null, 'b', 'c');
    assert.deepEqual(components(graph), [['a', 'b', 'c']]);
  });

  it('works for directed graphs', function() {
    var graph = new Digraph();
    graph.addNode('a');
    graph.addNode('b');
    graph.addNode('c');
    graph.addEdge(null, 'a', 'b');
    // TODO: this needs to be made order insensitive...
    assert.deepEqual(components(graph), [['a', 'b'], ['c']]);
  });
});
