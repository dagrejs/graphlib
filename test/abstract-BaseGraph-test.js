var assert = require('./assert'),
    filter = require('..').filter;

module.exports = function(Graph) {
  var g;

  beforeEach(function() {
    g = new Graph();
  });

  describe('new graph', function() {
    it('has no nodes', function() {
      assert.equal(g.order(), 0);
      assert.lengthOf(g.nodes(), 0);
    });

    it('has no edges', function() {
      assert.equal(g.size(), 0);
      assert.lengthOf(g.edges(), 0);
    });
  });

  describe('order', function() {
    it('returns the number of nodes in the graph', function() {
      var g = new Graph();
      g.addNode('a');
      g.addNode('b');
      assert.equal(g.order(), 2);
    });
  });

  describe('size', function() {
    it('returns the number of edges in the graph', function() {
      var g = new Graph();
      g.addNode('a');
      g.addNode('b');

      g.addEdge(null, 'a', 'b');
      assert.equal(g.size(), 1);

      g.addEdge(null, 'a', 'b');
      assert.equal(g.size(), 2);
    });
  });

  describe('graph', function() {
    it('returns undefined if a value has not been set', function() {
      assert.isUndefined(g.graph());
    });

    it('sets the value for the graph if called with a single argument', function() {
      g.graph('test');
      assert.equal(g.graph(), 'test');
    });
  });

  describe('node', function() {
    it('throws if the node isn\'t in the graph', function() {
      assert.throws(function() { g.node(1); });
    });

    it('has an undefined value if no value was assigned to the node', function() {
      g.addNode(1);
      assert.isUndefined(g.node(1));
    });

    it('returns the node\'s value if one was set', function() {
      var value = { abc: 123 };
      g.addNode(1, value);
      assert.strictEqual(g.node(1), value);
    });

    it('sets the value for the node if called with two arguments', function() {
      g.addNode(1);
      g.node(1, 'abc');
      assert.equal(g.node(1), 'abc');
    });
  });

  describe('edge', function() {
    it('throws if the edge isn\'t in the graph', function() {
      assert.throws(function() { g.edge(3); });
    });

    it('has the nodes that are incident on the edge', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge(3, 1, 2);
      assert.deepEqual(g.incidentNodes(3).sort(), [1, 2]);
    });

    it('has an undefined value if no value was assigned to the edge', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge(3, 1, 2);
      assert.isUndefined(g.edge(3));
    });

    it('returns the edge\'s value if one was set', function() {
      var value = { abc: 123 };
      g.addNode(1);
      g.addNode(2);
      g.addEdge(3, 1, 2, value);
      assert.strictEqual(g.edge(3), value);
    });

    it('sets the value for the edge if called with 2 arguments', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge(3, 1, 2);
      g.edge(3, 'abc');
      assert.equal(g.edge(3), 'abc');
    });
  });

  describe('edges', function() {
    it('returns all edges with no arguments', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('A', 1, 2);
      g.addEdge('B', 1, 2);
      g.addEdge('C', 2, 1);

      assert.deepEqual(g.edges().sort(), ['A', 'B', 'C']);
    });
  });

  describe('incidentEdges', function() {
    it('returns all edges incident on a node', function() {
      g.addNode(1);
      g.addNode(2);
      g.addNode(3);
      g.addEdge('A', 1, 2);
      g.addEdge('B', 1, 2);
      g.addEdge('C', 1, 1);
      g.addEdge('D', 2, 1);
      g.addEdge('E', 2, 3);

      assert.deepEqual(g.incidentEdges(1).sort(), ['A', 'B', 'C', 'D']);
      assert.deepEqual(g.incidentEdges(2).sort(), ['A', 'B', 'D', 'E']);
      assert.deepEqual(g.incidentEdges(3).sort(), ['E']);
    });

    it('optional returns all edges between two nodes', function() {
      g.addNode(1);
      g.addNode(2);
      g.addNode(3);
      g.addEdge('A', 1, 2);
      g.addEdge('B', 1, 2);
      g.addEdge('C', 1, 1);
      g.addEdge('D', 2, 1);
      g.addEdge('E', 2, 3);

      assert.deepEqual(g.incidentEdges(1, 1).sort(), ['C']);
      assert.deepEqual(g.incidentEdges(1, 2).sort(), ['A', 'B', 'D']);
      assert.deepEqual(g.incidentEdges(1, 3).sort(), []);
      assert.deepEqual(g.incidentEdges(2, 1).sort(), ['A', 'B', 'D']);
      assert.deepEqual(g.incidentEdges(2, 2).sort(), []);
      assert.deepEqual(g.incidentEdges(2, 3).sort(), ['E']);
      assert.deepEqual(g.incidentEdges(3, 1).sort(), []);
      assert.deepEqual(g.incidentEdges(3, 2).sort(), ['E']);
      assert.deepEqual(g.incidentEdges(3, 3).sort(), []);
    });
  });

  describe('toString', function() {
    it('returns a string representatoin of the graph', function() {
      // Just make sure we don't throw an Error
      g.addNode('a');
      g.addNode('b');
      g.addEdge(null, 'a', 'b');
      g.toString();
    });
  });

  describe('addNode', function() {
    it('adds a new node to the graph', function() {
      g.addNode(1);
      assert.deepEqual(g.nodes(), [1]);
      assert.lengthOf(g.neighbors(1), 0);
    });

    it('assigns an arbitrary id to the node if the given id is undefined', function() {
      var id = g.addNode();
      assert.isDefined(id);
      assert.deepEqual(g.nodes(), [id]);
      assert.lengthOf(g.neighbors(id), 0);
    });
  });

  describe('delNode', function() {
    it('removes the node from the graph', function() {
      g.addNode(1);
      g.addNode(2);
      g.delNode(1);
      assert.deepEqual(g.nodes(), [2]);
    });

    it('removes out edges', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('1 -> 2', 1, 2);
      g.delNode(1);
      assert.lengthOf(g.neighbors(2), 0);
    });

    it('removes in edges', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('2 -> 1', 2, 1);
      g.delNode(1);
      assert.lengthOf(g.neighbors(2), 0);
    });
  });

  describe('addEdge', function() {
    it('adds a new edge to the graph', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('a', 1, 2);

      assert.deepEqual(g.edges(), ['a']);

      assert.deepEqual(g.neighbors(1), [2]);
      assert.deepEqual(g.neighbors(2), [1]);
    });

    it('assigns an arbitrary edge id if the given id is null', function() {
      g.addNode(1);
      g.addNode(2);
      g.addNode(3);
      
      var e1 = g.addEdge(null, 1, 2);
      assert.isDefined(e1);
      assert.isTrue(g.hasEdge(e1));

      var e2 = g.addEdge(null, 2, 3);
      assert.isDefined(e2);
      assert.isTrue(g.hasEdge(e2));

      assert.sameMembers(g.neighbors(1), [2]);
      assert.sameMembers(g.neighbors(2), [1, 3]);
      assert.sameMembers(g.neighbors(3), [2]);
    });

    it('assigns an arbitrary edge id if the given id is undefined', function() {
      g.addNode(1);
      g.addNode(2);
      g.addNode(3);
      
      var e1 = g.addEdge(undefined, 1, 2);
      assert.isDefined(e1);
      assert.isTrue(g.hasEdge(e1));

      var e2 = g.addEdge(undefined, 2, 3);
      assert.isDefined(e2);
      assert.isTrue(g.hasEdge(e2));

      assert.sameMembers(g.neighbors(1), [2]);
      assert.sameMembers(g.neighbors(2), [1, 3]);
      assert.sameMembers(g.neighbors(3), [2]);
    });

    it('avoids id collisions when given id is null', function() {
      g.addNode(1);
      g.addNode(2);

      // We use this assert in case the internal id scheme changes...
      assert.equal(g.addEdge(null, 1, 2), '_1');

      // This would be the next id assigned by the graph
      g.addEdge('_2', 1, 2);

      assert.equal(g.addEdge(null, 1, 2), '_3');
    });
  });

  describe('delEdge', function() {
    it('removes the specified edge from the graph', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('a', 1, 2);
      g.delEdge('a');

      assert.lengthOf(g.edges(), 0);

      assert.lengthOf(g.neighbors(1), 0);
    });
  });

  describe('copy', function() {
    it('copies the graph value', function() {
      g.graph('foo');
      assert.equal(g.copy().graph(), 'foo');
    });

    it('copies the nodes in the graph', function() {
      g.addNode(1);
      g.addNode(2, {foo: 'bar'});
      var copy = g.copy();
      assert.sameMembers(copy.nodes(), g.nodes());
      assert.deepEqual(copy.node(2), g.node(2));
    });

    it('copies the edges in the graph', function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge('A', 1, 2, {foo: 'bar'});
      var copy = g.copy();
      assert.sameMembers(copy.edges(), g.edges());
      assert.deepEqual(copy.edge('A'), g.edge('A'));
    });

    it('deepEquals the original graph', function() {
      g.addNode(1);
      g.addNode(2);
      // The `null` here is important because we want to increment the nextId
      // counter.
      g.addEdge(null, 1, 2, {foo: 'bar'});
      var copy = g.copy();
      assert.deepEqual(copy, g);
    });
  });

  describe('filterNodes', function() {
    it('creates a graph containing only nodes where the filter is true', function() {
      var g = new Graph();
      [1,2,3].forEach(function(u) { g.addNode(u); });

      var g2 = g.filterNodes(filter.nodesFromList([1, 2]));
      assert.deepEqual(g2.nodes().sort(), [1, 2]);
    });

    it('creates a graph of the same type', function() {
      var g = new Graph();
      [1,2,3].forEach(function(u) { g.addNode(u); });
      assert.instanceOf(g.filterNodes(filter.all()), Graph);
    });

    it('includes the values of the filtered nodes', function() {
      var g = new Graph();
      [1,2,3].forEach(function(u) { g.addNode(u, 'V' + u); });

      var g2 = g.filterNodes(filter.nodesFromList([1, 2]));
      assert.equal(g2.node(1), 'V1');
      assert.equal(g2.node(2), 'V2');
    });

    it('includes edges that are are incident with nodes in the filtered set', function() {
      var g = new Graph();
      [1,2,3].forEach(function(u) { g.addNode(u); });
      g.addEdge('a', 1, 2, 'VA');
      g.addEdge('b', 2, 3);

      var g2 = g.filterNodes(filter.nodesFromList([1, 2]));
      assert.isTrue(g2.hasEdge('a'));
      assert.equal(g2.edge('a'), 'VA');
    });
  });
};
