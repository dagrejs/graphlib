/*!
 * This file is organized with in the following order:
 *
 * Exports
 * Graph constructors
 * Graph queries (e.g. nodes(), edges()
 * Graph mutators
 * Helper functions
 */

var util = require("./util");

module.exports = Digraph;

/*
 * Constructor to create a new directed multi-graph.
 */
function Digraph() {
  /*! The value assigned to the graph itself */
  this._graphValue = undefined;

  /*! Map of nodeId -> {id, value} */
  this._nodes = {};

  /*! Map of sourceId -> {targetId -> {count, edgeId -> true}} */
  this._inEdges = {};

  /*! Map of targetId -> {sourceId -> {count, edgeId -> true}} */
  this._outEdges = {};

  /*! Map of edgeId -> {id, source, target, value} */
  this._edges = {};

  /*! Used to generate anonymous edge ids */
  this._nextEdgeId = 0;
}

/*
 * Constructs and returns a new graph that includes only the nodes in `us`. Any
 * edges that have both their source and target in the set `us` are also
 * included in the subgraph.
 * 
 * Changes to the graph itself are not reflected in the original graph.
 * However, the values for nodes and edges are not copied. If the values are
 * objects then their changes will be reflected in the original graph and the
 * subgraph.
 *
 * If any of the nodes in `us` are not in this graph this function raises an
 * Error.
 *
 * @param {String[]} us the node ids to include in the subgraph
 */
Digraph.prototype.subgraph = function(us) {
  var g = new Digraph();
  var self = this;

  us.forEach(function(u) { g.addNode(u, self.node(u)); });
  util.values(this._edges).forEach(function(e) {
    if (g.hasNode(e.source) && g.hasNode(e.target)) {
      g.addEdge(e.id, e.source, e.target, self.edge(e.id));
    }
  });

  return g;
};

/*
 * Returns the number of nodes in this graph.
 */
Digraph.prototype.order = function() {
  return Object.keys(this._nodes).length;
};

/*
 * Returns the number of edges in this graph.
 */
Digraph.prototype.size = function() {
  return Object.keys(this._edges).length;
};

/*
 * Accessor for a graph-level value. If called with no arguments this function
 * returns the graph value object. If called with the **value** argument this
 * function sets the value for the graph, replacing the previous value.
 *
 * @param {Object} [value] optional value to set for this graph.
 */
Digraph.prototype.graph = function(value) {
  if (arguments.length === 0) {
    return this._graphValue;
  }
  this._graphValue = value;
};

/*
 * Returns `true` if this graph contains a node with the id `u`. Otherwise
 * returns false.
 *
 * @param {String} u a node id
 */
Digraph.prototype.hasNode = function(u) {
  return u in this._nodes;
};

/*
 * Accessor for node values. If called with a single argument this function
 * returns the value for the node **u**. If called with two arguments, this
 * function assigns **value** as the value for node **u**.
 *
 * If no such node is in the graph this function will throw an Error.
 *
 * @param {String} u a node id
 * @param {Object} [value] option value to set for this node
 */
Digraph.prototype.node = function(u, value) {
  var node = this._strictGetNode(u);
  if (arguments.length === 1) {
    return node.value;
  }
  node.value = value;
};

/*
 * Returns the ids of all nodes in this graph. Use `graph.node(u)` to get the
 * value for a specific node.
 */
Digraph.prototype.nodes = function() {
  var nodes = [];
  this.eachNode(function(id, _) { nodes.push(id); });
  return nodes;
};

/*
 * Applies a function that takes the parameters (`id`, `value`) to each node in
 * the graph in arbitrary order.
 *
 * @param {Function} func the function to apply to each node
 */
Digraph.prototype.eachNode = function(func) {
  for (var k in this._nodes) {
    var node = this._nodes[k];
    func(node.id, node.value);
  }
};

/*
 * Returns all successors of the node with the id `u`. That is, all nodes
 * that have the node `u` as their source are returned.
 * 
 * If no node `u` exists in the graph this function throws an Error.
 *
 * @param {String} u a node id
 */
Digraph.prototype.successors = function(u) {
  this._strictGetNode(u);
  return Object.keys(this._outEdges[u])
               .map(function(v) { return this._nodes[v].id; }, this);
};

/*
 * Returns all predecessors of the node with the id `u`. That is, all nodes
 * that have the node `u` as their target are returned.
 * 
 * If no node `u` exists in the graph this function throws an Error.
 *
 * @param {String} u a node id
 */
Digraph.prototype.predecessors = function(u) {
  this._strictGetNode(u);
  return Object.keys(this._inEdges[u])
               .map(function(v) { return this._nodes[v].id; }, this);
};

/*
 * Returns all nodes that are adjacent to the node with the id `u`. In other
 * words, this function returns the set of all successors and predecessors of
 * node `u`.
 *
 * @param {String} u a node id
 */
Digraph.prototype.neighbors = function(u) {
  this._strictGetNode(u);
  var vs = {};

  Object.keys(this._outEdges[u])
        .map(function(v) { vs[v] = true; });

  Object.keys(this._inEdges[u])
        .map(function(v) { vs[v] = true; });

  return Object.keys(vs)
               .map(function(v) { return this._nodes[v].id; }, this);
};

/*
 * Returns all nodes in the graph that have no in-edges.
 */
Digraph.prototype.sources = function() {
  var self = this;
  return this._filterNodes(function(u) {
    // This could have better space characteristics if we had an inDegree function.
    return self.inEdges(u).length === 0;
  });
};

/*
 * Returns all nodes in the graph that have no out-edges.
 */
Digraph.prototype.sinks = function() {
  var self = this;
  return this._filterNodes(function(u) {
    // This could have better space characteristics if we have an outDegree function.
    return self.outEdges(u).length === 0;
  });
};

/*
 * Returns `true` if this graph has an edge with the id `e`. Otherwise this
 * function returns `false`.
 *
 * @param {String} e an edge id
 */
Digraph.prototype.hasEdge = function(e) {
  return e in this._edges;
};

/*
 * Accessor for edge values. If called with a single argument this function
 * returns the value for the edge **e**. If called with two arguments, this
 * function assigns **value** as the value for edge **e**.
 *
 * If no such edge is in the graph this function will throw an Error.
 *
 * @param {String} e an edge id
 * @param {Object} [value] option value to set for this node
 */
Digraph.prototype.edge = function(e, value) {
  var edge = this._strictGetEdge(e);
  if (arguments.length === 1) {
    return edge.value;
  }
  edge.value = value;
};

/*
 * Return all edges with no arguments,
 * the ones that are incident on a node (one argument),
 * or all edges from a source to a target (two arguments)
 *
 * @param {String} [u] an optional node id
 * @param {String} [v] an optional node id
 */
Digraph.prototype.edges = function(u, v) {
  var es, sourceEdges;
  if (!arguments.length) {
    es = [];
    this.eachEdge(function(id) { es.push(id); });
    return es;
  } else if (arguments.length === 1) {
    return util.mergeKeys([this.inEdges(u), this.outEdges(u)]);
  } else if (arguments.length === 2) {
    this._strictGetNode(u);
    this._strictGetNode(v);
    sourceEdges = this._outEdges[u];
    es = (v in sourceEdges) ? Object.keys(sourceEdges[v].edges) : [];
    return es.map(function(e) { return this._edges[e].id; }, this);
  }
};

/*
 * Applies a function that takes the parameters (`id`, `source`, `target`,
 * `value`) to each edge in this graph in arbitrary order.
 *
 * @param {Function} func a function to apply to each edge
 */
Digraph.prototype.eachEdge = function(func) {
  for (var k in this._edges) {
    var edge = this._edges[k];
    func(edge.id, edge.source, edge.target, edge.value);
  }
};

/*
 * Returns the source node incident on the edge identified by the id `e`. If no
 * such edge exists in the graph this function throws an Error.
 *
 * @param {String} e an edge id
 */
Digraph.prototype.source = function(e) {
  return this._strictGetEdge(e).source;
};

/*
 * Returns the target node incident on the edge identified by the id `e`. If no
 * such edge exists in the graph this function throws an Error.
 *
 * @param {String} e an edge id
 */
Digraph.prototype.target = function(e) {
  return this._strictGetEdge(e).target;
};

/*
 * Returns the ids of all edges in the graph that have the node `target` as
 * their target. If the node `target` is not in the graph this function raises
 * an Error.
 *
 * @param {String} target the target node id
 */
Digraph.prototype.inEdges = function(target) {
  this._strictGetNode(target);
  return util.concat(util.values(this._inEdges[target])
             .map(function(es) { return Object.keys(es.edges); }, this));
};

/*
 * Returns the ids of all nodes in the graph that have the node `source` as
 * their source. If the node `source` is not in the graph this function raises
 * an Error.
 *
 * @param {String} source the source node id
 */
Digraph.prototype.outEdges = function(source) {
  this._strictGetNode(source);
  return util.concat(util.values(this._outEdges[source])
             .map(function(es) { return Object.keys(es.edges); }, this));
};

/*
 * Returns `true` if the values of all nodes and all edges are equal (===)
 *
 * @param {Digraph} other the graph to test for equality with this graph
 */
Digraph.prototype.equals = function(other) {
  var self = this;

  return self.order() === other.order() &&
         self.size() === other.size() &&
         util.all(self.nodes(), function(x) { return other.hasNode(x) && self.node(x) === other.node(x); }) &&
         util.all(self.edges(), function(x) { return other.hasEdge(x) && self.edge(x) === other.edge(x); });
};

/*
 * Returns a string representation of this graph.
 */
Digraph.prototype.toString = function() {
  var self = this;
  var str = "GRAPH:\n";

  str += "    Nodes:\n";
  Object.keys(this._nodes)
        .forEach(function(u) {
          str += "        " + u + ": " + JSON.stringify(self._nodes[u].value) + "\n";
        });

  str += "    Edges:\n";
  Object.keys(this._edges)
        .forEach(function(e) {
          var edge = self._edges[e];
          str += "        " + e + " (" + edge.source + " -> " + edge.target + "): " +
                 JSON.stringify(self._edges[e].value) + "\n";
        });

  return str;
};

/*
 * Adds a new node with the id `u` to the graph and assigns it the value
 * `value`. If a node with the id is already a part of the graph this function
 * throws an Error.
 *
 * @param {String} u a node id
 * @param {Object} [value] an optional value to attach to the node
 */
Digraph.prototype.addNode = function(u, value) {
  if (this.hasNode(u)) {
    throw new Error("Graph already has node '" + u + "':\n" + this.toString());
  }
  this._nodes[u] = { id: u, value: value };
  this._inEdges[u] = {};
  this._outEdges[u] = {};
};

/*
 * Removes a node from the graph that has the id `u`. Any edges incident on the
 * node are also removed. If the graph does not contain a node with the id this
 * function will throw an Error.
 *
 * @param {String} u a node id
 */
Digraph.prototype.delNode = function(u) {
  this._strictGetNode(u);

  var self = this;
  this.edges(u).forEach(function(e) { self.delEdge(e); });

  delete this._inEdges[u];
  delete this._outEdges[u];
  delete this._nodes[u];
};

/*
 * Adds a new edge to the graph with the id `e` from a node with the id `source`
 * to a noce with an id `target` and assigns it the value `value`. This graph
 * allows more than one edge from `source` to `target` as long as the id `e`
 * is unique in the set of edges. If `e` is `null` the graph will assign a
 * unique identifier to the edge.
 *
 * If `source` or `target` are not present in the graph this function will
 * throw an Error.
 *
 * @param {String} [e] an edge id
 * @param {String} source the source node id
 * @param {String} target the target node id
 * @param {Object} [value] an optional value to attach to the edge
 */
Digraph.prototype.addEdge = function(e, source, target, value) {
  this._strictGetNode(source);
  this._strictGetNode(target);

  if (e === null) {
    e = "_ANON-" + (++this._nextEdgeId);
  }
  else if (this.hasEdge(e)) {
    throw new Error("Graph already has edge '" + e + "':\n" + this.toString());
  }

  this._edges[e] = { id: e, source: source, target: target, value: value };
  addEdgeToMap(this._inEdges[target], source, e);
  addEdgeToMap(this._outEdges[source], target, e);
};

/*
 * Removes an edge in the graph with the id `e`. If no edge in the graph has
 * the id `e` this function will throw an Error.
 *
 * @param {String} e an edge id
 */
Digraph.prototype.delEdge = function(e) {
  var edge = this._strictGetEdge(e);
  delEdgeFromMap(this._inEdges[edge.target], edge.source, e);
  delEdgeFromMap(this._outEdges[edge.source], edge.target, e);
  delete this._edges[e];
};

Digraph.prototype._strictGetNode = function(u) {
  var node = this._nodes[u];
  if (node === undefined) {
    throw new Error("Node '" + u + "' is not in graph:\n" + this.toString());
  }
  return node;
};

Digraph.prototype._strictGetEdge = function(e) {
  var edge = this._edges[e];
  if (edge === undefined) {
    throw new Error("Edge '" + e + "' is not in graph:\n" + this.toString());
  }
  return edge;
};

Digraph.prototype._filterNodes = function(pred) {
  var filtered = [];
  this.eachNode(function(u, value) {
    if (pred(u)) {
      filtered.push(u);
    }
  });
  return filtered;
};

function addEdgeToMap(map, v, e) {
  var vEntry = map[v];
  if (!vEntry) {
    vEntry = map[v] = { count: 0, edges: {} };
  }
  vEntry.count++;
  vEntry.edges[e] = true;
}

function delEdgeFromMap(map, v, e) {
  var vEntry = map[v];
  if (--vEntry.count === 0) {
    delete map[v];
  } else {
    delete vEntry.edges[e];
  }
}

