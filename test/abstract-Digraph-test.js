var assert = require('./assert');

module.exports = function(Digraph) {
  var g;

  beforeEach(function() {
    g = new Digraph();
  });

  require('./abstract-BaseGraph-test')(Digraph);

  describe('asUndirected', function() {
    var g;

    beforeEach(function() {
      g = new Digraph();
      g.addNode(1);
      g.addNode(2);
      g.addNode(3);
      g.addNode(4);
      g.addEdge('A', 1, 2, 'A');
      g.addEdge('B', 2, 3, 'B');
      g.addEdge('C', 3, 4, 'C');
      g.addEdge('D', 4, 1, 'D');
      g.addEdge('E', 4, 2, 'E');
    });

    it('returns an undirected graph', function() {
      assert.isFalse(g.asUndirected().isDirected());
    });

    it('has the same nodes', function() {
      assert.deepEqual(g.asUndirected().nodes().sort(), [1, 2, 3, 4]);
    });

    it('has the same size', function() {
      assert.equal(g.asUndirected().size(), 5);
    });

    it('preserves edge ids', function() {
      var ug = g.asUndirected();
      assert.deepEqual(ug.incidentNodes('A').sort(), [1, 2]);
      assert.deepEqual(ug.incidentNodes('B').sort(), [2, 3]);
      assert.deepEqual(ug.incidentNodes('C').sort(), [3, 4]);
      assert.deepEqual(ug.incidentNodes('D').sort(), [1, 4]);
      assert.deepEqual(ug.incidentNodes('E').sort(), [2, 4]);
    });

    it('preserves edge labels', function() {
      var ug = g.asUndirected();
      assert.equal(ug.edge(ug.incidentEdges(1, 2)[0]), 'A');
      assert.equal(ug.edge(ug.incidentEdges(2, 3)[0]), 'B');
      assert.equal(ug.edge(ug.incidentEdges(3, 4)[0]), 'C');
      assert.equal(ug.edge(ug.incidentEdges(4, 1)[0]), 'D');
      assert.equal(ug.edge(ug.incidentEdges(4, 2)[0]), 'E');
    });
  });

  describe('isDirected', function() {
    it('always returns true', function() {
      assert.isTrue(new Digraph().isDirected());
    });
  });

  describe('sources', function() {
    it('returns all nodes for a graph with no edges', function() {
      var g = new Digraph();
      g.addNode('a');
      g.addNode('b');
      g.addNode('c');
      assert.deepEqual(g.sources().sort(), ['a', 'b', 'c']);
    });

    it('returns only nodes that have no in-edges', function() {
      var g = new Digraph();
      g.addNode('a');
      g.addNode('b');
      g.addNode('c');
      g.addEdge(null, 'a', 'b');
      assert.deepEqual(g.sources().sort(), ['a', 'c']);
    });
  });

  describe('sinks', function() {
    it('returns all nodes for a graph with no edges', function() {
      var g = new Digraph();
      g.addNode('a');
      g.addNode('b');
      g.addNode('c');
      assert.deepEqual(g.sinks().sort(), ['a', 'b', 'c']);
    });

    it('returns only nodes that have no out-edges', function() {
      var g = new Digraph();
      g.addNode('a');
      g.addNode('b');
      g.addNode('c');
      g.addEdge(null, 'a', 'b');
      assert.deepEqual(g.sinks().sort(), ['b', 'c']);
    });
  });

  describe('outEdges', function() {
    it('returns all out edges from a source', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('A', 1, 2);
      g.addEdge('B', 1, 2);
      g.addEdge('C', 1, 1);
      g.addEdge('D', 2, 1);
      g.addEdge('E', 2, 2);

      assert.deepEqual(g.outEdges(1).sort(), ['A', 'B', 'C']);
      assert.deepEqual(g.outEdges(2).sort(), ['D', 'E']);
    });

    it('optionally returns all out edges from a source filtered by target', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('A', 1, 2);
      g.addEdge('B', 1, 2);
      g.addEdge('C', 1, 1);
      g.addEdge('D', 2, 1);
      g.addEdge('E', 2, 2);

      assert.deepEqual(g.outEdges(1, 1).sort(), ['C']);
      assert.deepEqual(g.outEdges(1, 2).sort(), ['A', 'B']);
      assert.deepEqual(g.outEdges(2, 1).sort(), ['D']);
      assert.deepEqual(g.outEdges(2, 2).sort(), ['E']);
    });
  });

  describe('inEdges', function() {
    it('returns all in edges to a target', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('A', 1, 2);
      g.addEdge('B', 1, 2);
      g.addEdge('C', 1, 1);
      g.addEdge('D', 2, 1);
      g.addEdge('E', 2, 2);

      assert.deepEqual(g.inEdges(1).sort(), ['C', 'D']);
      assert.deepEqual(g.inEdges(2).sort(), ['A', 'B', 'E']);
    });

    it('optionally returns all in edges to a target filtered by source', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('A', 1, 2);
      g.addEdge('B', 1, 2);
      g.addEdge('C', 1, 1);
      g.addEdge('D', 2, 1);
      g.addEdge('E', 2, 2);

      assert.deepEqual(g.inEdges(1, 1).sort(), ['C']);
      assert.deepEqual(g.inEdges(1, 2).sort(), ['D']);
      assert.deepEqual(g.inEdges(2, 1).sort(), ['A', 'B']);
      assert.deepEqual(g.inEdges(2, 2).sort(), ['E']);
    });
  });

  describe('addNode', function() {
    it('adds a new node to the graph', function() {
      g.addNode(1);

      assert.deepEqual(g.nodes(), [1]);

      assert.lengthOf(g.successors(1), 0);
      assert.lengthOf(g.predecessors(1), 0);
      assert.lengthOf(g.neighbors(1), 0);
    });
  });

  describe('delNode', function() {
    it('removes out edges', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('1 -> 2', 1, 2);
      g.delNode(1);
      assert.lengthOf(g.predecessors(2), 0);
    });

    it('removes in edges', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('2 -> 1', 2, 1);
      g.delNode(1);
      assert.lengthOf(g.successors(2), 0);
    });
  });

  describe('addEdge', function() {
    it('adds a new edge to the graph', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('a', 1, 2);

      assert.deepEqual(g.edges(), ['a']);

      assert.deepEqual(g.successors(1), [2]);
      assert.deepEqual(g.predecessors(2), [1]);
      assert.deepEqual(g.neighbors(1), [2]);
      assert.deepEqual(g.neighbors(2), [1]);
    });
  });

  describe('delEdge', function() {
    it('removes the specified edge from the graph', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('a', 1, 2);
      g.delEdge('a');

      assert.lengthOf(g.edges(), 0);

      assert.lengthOf(g.successors(1), 0);
      assert.lengthOf(g.predecessors(1), 0);
      assert.lengthOf(g.neighbors(1), 0);
    });
  });
};
