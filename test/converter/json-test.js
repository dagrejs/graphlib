var assert = require('../assert'),
    decode = require('../..').converter.json.decode,
    encode = require('../..').converter.json.encode,
    Digraph = require('../..').Digraph,
    Graph = require('../..').Graph,
    CDigraph = require('../..').CDigraph,
    CGraph = require('../..').CGraph;

describe('converter.json', function() {
  describe('decode', function() {
    it('defaults to Digraph type', function() {
      assert.instanceOf(decode([], []), Digraph);
    });

    it('can create Graph type', function() {
      assert.instanceOf(decode([], [], Graph), Graph);
    });

    it('can populate a graph with nodes', function() {
      var nodes = [{id: 1}, {id: 2}];
      var graph = decode(nodes, []);
      assert.sameMembers(graph.nodes(), [1, 2]);
      assert.isUndefined(graph.node(1));
      assert.isUndefined(graph.node(2));
    });

    it('can populate a graph with node values', function() {
      var nodes = [{id: 1, value: 'A'}, {id: 2, value: 'B' }];
      var graph = decode(nodes, []);
      assert.sameMembers(graph.nodes(), [1, 2]);
      assert.equal(graph.node(1), 'A');
      assert.equal(graph.node(2), 'B');
    });

    it('can create a graph with auto-assigned node ids', function() {
      var nodes = [{value: 'A'}, {value: 'B'}];
      var graph = decode(nodes, []);
      assert.equal(graph.order(), 2);
      assert.sameMembers(graph.nodes().map(function(x) { return graph.node(x); }), ['A', 'B']);
    });

    it('can add edges to the graph', function() {
      var nodes = [{id: 1}, {id: 2}];
      var edges = [{id: 'A', u: 1, v: 2}, {id: 'B', u: 2, v: 1}];
      var graph = decode(nodes, edges);
      assert.sameMembers(graph.edges(), ['A', 'B']);
      assert.equal(graph.source('A'), 1);
      assert.equal(graph.target('A'), 2);
      assert.equal(graph.source('B'), 2);
      assert.equal(graph.target('B'), 1);
      assert.isUndefined(graph.edge('A'));
      assert.isUndefined(graph.edge('B'));
    });

    it('can add edge values to the graph', function() {
      var nodes = [{id: 1}, {id: 2}];
      var edges = [{id: 'A', u: 1, v: 2, value: 'foo'}];
      var graph = decode(nodes, edges);
      assert.sameMembers(graph.edges(), ['A']);
      assert.equal(graph.edge('A'), 'foo');
    });

    it('can create a graph with auto-assigned edge ids', function() {
      var nodes = [{id: 1}, {id: 2}];
      var edges = [{u: 1, v: 2, value: 'foo'}];
      var graph = decode(nodes, edges);
      assert.equal(graph.size(), 1);

      var e = graph.edges()[0];
      assert.equal(graph.source(e), 1);
      assert.equal(graph.target(e), 2);
      assert.equal(graph.edge(e), 'foo');
    });

    it('can create a directed graph with compound nodes', function() {
      var nodes = [{id: 'sg1', children: [1, 2]},
                   {id: 1},
                   {id: 2}];
      var graph = decode(nodes, [], CDigraph);
      assert.sameMembers(graph.nodes(), ['sg1', 1, 2]);
      assert.sameMembers(graph.children(null), ['sg1']);
      assert.sameMembers(graph.children('sg1'), [1, 2]);
    });

    it('can create an undirected graph with compound nodes', function() {
      var nodes = [{id: 'sg1', children: [1, 2]},
                   {id: 1},
                   {id: 2}];
      var graph = decode(nodes, [], CGraph);
      assert.sameMembers(graph.nodes(), ['sg1', 1, 2]);
      assert.sameMembers(graph.children(null), ['sg1']);
      assert.sameMembers(graph.children('sg1'), [1, 2]);
    });

    it('ignores compound information for non-comound graphs', function() {
      var nodes = [{id: 'sg1', children: [1, 2]},
                   {id: 1},
                   {id: 2}];
      var graph = decode(nodes, []);
      assert.sameMembers(graph.nodes(), ['sg1', 1, 2]);
    });

    it('throws an Error if the nodes argument is not an array', function() {
      assert.throws(function() { decode('foo', []); });
    });

    it('throws an Error if the edges argument is not an array', function() {
      assert.throws(function() { decode([], 'foo'); });
    });
  });

  describe('encode', function() {
    it('can encode an empty Graph', function() {
      var graph = new Graph();
      assert.deepEqual(encode(graph), {nodes: [], edges: [], type: 'graph'});
    });

    it('can encode an empty Digraph', function() {
      var graph = new Digraph();
      assert.deepEqual(encode(graph), {nodes: [], edges: [], type: 'digraph'});
    });

    it('can encode an empty CGraph', function() {
      var graph = new CGraph();
      assert.deepEqual(encode(graph), {nodes: [], edges: [], type: 'cgraph'});
    });

    it('can encode an empty CDigraph', function() {
      var graph = new CDigraph();
      assert.deepEqual(encode(graph), {nodes: [], edges: [], type: 'cdigraph'});
    });

    it('can encode a graph with nodes', function() {
      var graph = new Digraph();
      graph.addNode(1);
      graph.addNode(2);

      var encoded = encode(graph);
      assert.sameMembers(encoded.nodes.map(function(x) { return x.id; }), [1, 2]);
      assert.deepEqual(encoded.edges, []);
      assert.equal(encoded.type, 'digraph');
    });

    it('can encode a graph with node values', function() {
      var graph = new Digraph();
      graph.addNode(1, 'test');
      graph.addNode(2, {complex: true});

      var encoded = encode(graph);
      assert.deepEqual(encoded.nodes.sort(idCmp),
                       [{id: 1, value: 'test'}, {id: 2, value: {complex: true}}]);
      assert.deepEqual(encoded.edges, []);
      assert.equal(encoded.type, 'digraph');
    });

    it('can encode a graph with edges', function() {
      var graph = new Digraph();
      graph.addNode(1);
      graph.addNode(2);
      graph.addEdge('A', 1, 2);
      graph.addEdge('B', 2, 1);

      var encoded = encode(graph);
      assert.deepEqual(encoded.nodes.sort(idCmp),
                       [{id: 1, value: undefined}, {id: 2, value: undefined}]);
      assert.deepEqual(encoded.edges.sort(idCmp),
                       [{id: 'A', u: 1, v: 2, value: undefined},
                        {id: 'B', u: 2, v: 1, value: undefined}]);
      assert.equal(encoded.type, 'digraph');

    });

    it('can encode a graph with edge values', function() {
      var graph = new Digraph();
      graph.addNode(1);
      graph.addNode(2);
      graph.addEdge('A', 1, 2, 'test');
      graph.addEdge('B', 2, 1, {complex: true});

      var encoded = encode(graph);
      assert.deepEqual(encoded.nodes.sort(idCmp), [{id: 1, value: undefined}, {id: 2, value: undefined}]);
      assert.deepEqual(encoded.edges.sort(idCmp), [{id: 'A', u: 1, v: 2, value: 'test'},
                                                   {id: 'B', u: 2, v: 1, value: {complex: true}}]);
      assert.equal(encoded.type, 'digraph');

    });

    it('can encode a compound directed graph', function() {
      var graph = new CDigraph();
      graph.addNode('sg1');
      graph.addNode(1);
      graph.parent(1, 'sg1');
      graph.addNode(2);
      graph.parent(2, 'sg1');

      var encoded = encode(graph);
      assert.deepEqual(encoded.nodes.sort(idCmp),
                       [{id: 1, value: undefined},
                        {id: 2, value: undefined},
                        {id: 'sg1', value: undefined, children: [1, 2]}]);
      assert.deepEqual(encoded.edges, []);
      assert.equal(encoded.type, 'cdigraph');
    });

    it('can encode a compound undirected graph', function() {
      var graph = new CGraph();
      graph.addNode('sg1');
      graph.addNode(1);
      graph.parent(1, 'sg1');
      graph.addNode(2);
      graph.parent(2, 'sg1');

      var encoded = encode(graph);
      assert.deepEqual(encoded.nodes.sort(idCmp),
                       [{id: 1, value: undefined},
                        {id: 2, value: undefined},
                        {id: 'sg1', value: undefined, children: [1, 2]}]);
      assert.deepEqual(encoded.edges, []);
      assert.equal(encoded.type, 'cgraph');
    });
  });

  describe('encode-decode', function() {
    it('Digraph', function() {
      var graph = new Digraph();
      graph.addNode(1);
      graph.addNode(2, {value: 'node 2'});
      graph.addEdge('A', 1, 2, 'forward edge');
      graph.addEdge('B', 2, 1, 'reverse edge');

      var encoded = encode(graph);
      var decoded = decode(encoded.nodes, encoded.edges, encoded.type);
      assert.instanceOf(decoded, Digraph);
      assert.deepEqual(graph, decoded);
    });

    it('Graph', function() {
      var graph = new Graph();
      graph.addNode(1);
      graph.addNode(2, {value: 'node 2'});
      graph.addEdge('A', 1, 2, 'forward edge');
      graph.addEdge('B', 2, 1, 'reverse edge');

      var encoded = encode(graph);
      var decoded = decode(encoded.nodes, encoded.edges, encoded.type);
      assert.instanceOf(decoded, Graph);
      assert.deepEqual(graph, decoded);
    });

    it('CDigraph', function() {
      var graph = new CDigraph();
      graph.addNode(1);
      graph.addNode(2, {value: 'node 2'});
      graph.addNode('sg1', 'foo');
      graph.parent(1, 'sg1');
      graph.parent(2, 'sg1');
      graph.addEdge('A', 1, 2, 'forward edge');
      graph.addEdge('B', 2, 1, 'reverse edge');

      var encoded = encode(graph);
      var decoded = decode(encoded.nodes, encoded.edges, encoded.type);
      assert.instanceOf(decoded, CDigraph);
      assert.deepEqual(graph, decoded);
    });

    it('CGraph', function() {
      var graph = new CGraph();
      graph.addNode(1);
      graph.addNode(2, {value: 'node 2'});
      graph.addNode('sg1', 'foo');
      graph.parent(1, 'sg1');
      graph.parent(2, 'sg1');
      graph.addEdge('A', 1, 2, 'forward edge');
      graph.addEdge('B', 2, 1, 'reverse edge');

      var encoded = encode(graph);
      var decoded = decode(encoded.nodes, encoded.edges, encoded.type);
      assert.instanceOf(decoded, CGraph);
      assert.deepEqual(graph, decoded);
    });
  });
});

function idCmp(x, y) {
  x = x.id.toString();
  y = y.id.toString();
  if (x > y) { return 1; }
  if (x < y) { return -1; }
  return 0;
}
