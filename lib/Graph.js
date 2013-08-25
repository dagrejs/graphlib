/**
# graphlib api documentation
**/
/*
 * This file is organized with in the following order:
 *
 * Exports
 * Graph constructors
 * Graph queries (e.g. nodes(), edges()
 * Graph mutators
 * Helper functions
 */

module.exports = Graph;

/**
  ## new Graph()
  A directed multi-graph.
**/
function Graph() {
  /* Map of nodeId -> {id, value} */
  this._nodes = {};

  /* Map of sourceId -> {targetId -> {count, edgeId -> true}} */
  this._inEdges = {};

  /* Map of targetId -> {sourceId -> {count, edgeId -> true}} */
  this._outEdges = {};

  /* Map of edgeId -> {id, source, target, value} */
  this._edges = {};

  /* Used to generate anonymous edge ids */
  this._nextEdgeId = 0;
}

/**
  ### Subgraph(us)

  Constructs and returns a new graph that includes only the nodes in `us`. Any
  edges that have both their source and target in the set `us` are also
  included in the subgraph.
 
  Changes to the graph itself are not reflected in the original graph.
  However, the values for nodes and edges are not copied. If the values are
  objects then their changes will be reflected in the original graph and the
  subgraph.
 
  If any of the nodes in `us` are not in this graph this function raises an
  Error.
**/
Graph.prototype.subgraph = function(us) {
  var g = new Graph();
  var self = this;

  us.forEach(function(u) { g.addNode(u, self.node(u)); });
  values(this._edges).forEach(function(e) {
    if (g.hasNode(e.source) && g.hasNode(e.target)) {
      g.addEdge(e.id, e.source, e.target, self.edge(e.id));
    }
  });

  return g;
};

/**
  ### Graph#order()
  Returns the number of nodes in this graph.
**/
Graph.prototype.order = function() {
  return Object.keys(this._nodes).length;
};

/**
  ### Graph#size
  Returns the number of edges in this graph.
**/
Graph.prototype.size = function() {
  return Object.keys(this._edges).length;
};

/**
  ### Graph#hasNode(u)
  Returns `true` if this graph contains a node with the id `u`. Otherwise
  returns false.
**/
Graph.prototype.hasNode = function(u) {
  return u in this._nodes;
};

/**
  ### Graph#node(u)
  Returns the value for a node in the graph with the id `u`. If no such node
  is in the graph this function will throw an Error.
**/
Graph.prototype.node = function(u) {
  return this._strictGetNode(u).value;
};

/**
  ### Graph#nodes()
  Returns the ids of all nodes in this graph. Use `graph.node(u)` to get the
  value for a specific node.
**/

Graph.prototype.nodes = function() {
  var nodes = [];
  this.eachNode(function(id, _) { nodes.push(id); });
  return nodes;
};

/**
  ### Graph#eachNode(func)
  Applies a function that takes the parameters (`id`, `value`) to each node in
  the graph in arbitrary order.
**/

Graph.prototype.eachNode = function(func) {
  for (var k in this._nodes) {
    var node = this._nodes[k];
    func(node.id, node.value);
  }
};

/**
  ### Graph#successors(u)

  Returns all successors of the node with the id `u`. That is, all nodes
  that have the node `u` as their source are returned.
 
  If no node `u` exists in the graph this function throws an Error.
**/

Graph.prototype.successors = function(u) {
  this._strictGetNode(u);
  return Object.keys(this._outEdges[u])
               .map(function(v) { return this._nodes[v].id; }, this);
};

/**
  ### Graph#predecessors(u)

  Returns all predecessors of the node with the id `u`. That is, all nodes
  that have the node `u` as their target are returned.
 
  If no node `u` exists in the graph this function throws an Error.
**/
Graph.prototype.predecessors = function(u) {
  this._strictGetNode(u);
  return Object.keys(this._inEdges[u])
               .map(function(v) { return this._nodes[v].id; }, this);
};

/**
  ### Graph#neighbors(u)

  Returns all nodes that are adjacent to the node with the id `u`. In other
  words, this function returns the set of all successors and predecessors of
  node `u`.
**/
Graph.prototype.neighbors = function(u) {
  this._strictGetNode(u);
  var vs = {};

  Object.keys(this._outEdges[u])
        .map(function(v) { vs[v] = true; });

  Object.keys(this._inEdges[u])
        .map(function(v) { vs[v] = true; });

  return Object.keys(vs)
               .map(function(v) { return this._nodes[v].id; }, this);
};

/**
  ### Graph#sources()

  Returns all nodes in the graph that have no in-edges.
**/
Graph.prototype.sources = function() {
  var self = this;
  return this._filterNodes(function(u) {
    // This could have better space characteristics if we had an inDegree function.
    return self.inEdges(u).length === 0;
  });
};

/**
  ### Graph#sinks()

  Returns all nodes in the graph that have no out-edges.
**/
Graph.prototype.sinks = function() {
  var self = this;
  return this._filterNodes(function(u) {
    // This could have better space characteristics if we have an outDegree function.
    return self.outEdges(u).length === 0;
  });
};

/**
  ### Graph#hasEdge(e)

  Returns `true` if this graph has an edge with the id `e`. Otherwise this
  function returns `false`.
**/
Graph.prototype.hasEdge = function(e) {
  return e in this._edges;
};

/**
  ### Graph#edge(e)
  Returns the value for an edge with the id `e`. If no such edge exists in
  the graph this function throws an Error.
**/
Graph.prototype.edge = function(e) {
  return this._strictGetEdge(e).value;
};

/**
  ### Graph#edges(u, v)
  Return all edges with no arguments,
  the ones that are incident on a node (one argument),
  or all edges from a source to a target (two arguments)
**/
Graph.prototype.edges = function(u, v) {
  var es, sourceEdges;
  if (!arguments.length) {
    es = [];
    this.eachEdge(function(id) { es.push(id); });
    return es;
  } else if (arguments.length === 1) {
    return mergeKeys([this.inEdges(u), this.outEdges(u)]);
  } else if (arguments.length === 2) {
    this._strictGetNode(u);
    this._strictGetNode(v);
    sourceEdges = this._outEdges[u];
    es = (v in sourceEdges) ? Object.keys(sourceEdges[v].edges) : [];
    return es.map(function(e) { return this._edges[e].id; }, this);
  }
};

/**
  ### Graph#eachEdge(func)
  Applies a function that takes the parameters (`id`, `source`, `target`,
  `value`) to each edge in this graph in arbitrary order.
**/
Graph.prototype.eachEdge = function(func) {
  for (var k in this._edges) {
    var edge = this._edges[k];
    func(edge.id, edge.source, edge.target, edge.value);
  }
};

/**
  ### Graph#source(e)
  Returns the source node incident on the edge identified by the id `e`. If no
  such edge exists in the graph this function throws an Error.
**/
Graph.prototype.source = function(e) {
  return this._strictGetEdge(e).source;
};

/**
  ### Graph#target(e)
  Returns the target node incident on the edge identified by the id `e`. If no
  such edge exists in the graph this function throws an Error.
**/
Graph.prototype.target = function(e) {
  return this._strictGetEdge(e).target;
};

/**
  ### Graph#inEdges(target)
  Returns the ids of all edges in the graph that have the node `target` as
  their target. If the node `target` is not in the graph this function raises
  an Error.
**/
Graph.prototype.inEdges = function(target) {
  this._strictGetNode(target);
  return concat(values(this._inEdges[target])
             .map(function(es) { return Object.keys(es.edges); }, this));
};

/**
  ### Graph#outEdges(source)
  Returns the ids of all nodes in the graph that have the node `source` as
  their source. If the node `source` is not in the graph this function raises
  an Error.
**/
Graph.prototype.outEdges = function(source) {
  this._strictGetNode(source);
  return concat(values(this._outEdges[source])
             .map(function(es) { return Object.keys(es.edges); }, this));
};

/**
  ### Graph#equals(other)
  returns true if the values oof all nodes and all edges are equal (===)
**/

Graph.prototype.equals = function(other) {
  var self = this;

  return self.order() === other.order() &&
         self.size() === other.size() &&
         all(self.nodes(), function(x) { return other.hasNode(x) && self.node(x) === other.node(x); }) &&
         all(self.edges(), function(x) { return other.hasEdge(x) && self.edge(x) === other.edge(x); });
};

/**
  ### Graph#toString()
  Returns a string representation of this graph.
**/
Graph.prototype.toString = function() {
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

/**
  ### Graph#addNode(u, value)
  Adds a new node with the id `u` to the graph and assigns it the value
  `value`. If a node with the id is already a part of the graph this function
  throws an Error.
**/
Graph.prototype.addNode = function(u, value) {
  if (this.hasNode(u)) {
    throw new Error("Graph already has node '" + u + "':\n" + this.toString());
  }
  this._nodes[u] = { id: u, value: value };
  this._inEdges[u] = {};
  this._outEdges[u] = {};
};

/**
  ### Graph#delNode(u)
  Removes a node from the graph that has the id `u`. Any edges incident on the
  node are also removed. If the graph does not contain a node with the id this
  function will throw an Error.
**/
Graph.prototype.delNode = function(u) {
  this._strictGetNode(u);

  var self = this;
  this.edges(u).forEach(function(e) { self.delEdge(e); });

  delete this._inEdges[u];
  delete this._outEdges[u];
  delete this._nodes[u];
};

/**
  ### Graph#addEdge(e, source, target, value)
  Adds a new edge to the graph with the id `e` from a node with the id `source`
  to a noce with an id `target` and assigns it the value `value`. This graph
  allows more than one edge from `source` to `target` as long as the id `e`
  is unique in the set of edges. If `e` is `null` the graph will assign a
  unique identifier to the edge.
 
  If `source` or `target` are not present in the graph this function will
  throw an Error.
**/
Graph.prototype.addEdge = function(e, source, target, value) {
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

/**
  ### Graph#delEdge(e)
  Removes an edge in the graph with the id `e`. If no edge in the graph has
  the id `e` this function will throw an Error.
**/
Graph.prototype.delEdge = function(e) {
  var edge = this._strictGetEdge(e);
  delEdgeFromMap(this._inEdges[edge.target], edge.source, e);
  delEdgeFromMap(this._outEdges[edge.source], edge.target, e);
  delete this._edges[e];
};

Graph.prototype._strictGetNode = function(u) {
  var node = this._nodes[u];
  if (node === undefined) {
    throw new Error("Node '" + u + "' is not in graph:\n" + this.toString());
  }
  return node;
};

Graph.prototype._strictGetEdge = function(e) {
  var edge = this._edges[e];
  if (edge === undefined) {
    throw new Error("Edge '" + e + "' is not in graph:\n" + this.toString());
  }
  return edge;
};

Graph.prototype._filterNodes = function(pred) {
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

// Returns `true` only if `f(x)` is `true` for all `x` in **xs**. Otherwise
// returns `false`. This function will return immediately if it finds a
// case where `f(x)` does not hold.
function all(xs, f) {
  for (var i = 0; i < xs.length; ++i) {
    if (!f(xs[i])) return false;
  }
  return true;
}

// Returns an array of all values for properties of **o**.
function values(o) {
  return Object.keys(o).map(function(k) { return o[k]; });
}

// Joins all of the arrays **xs** into a single array.
function concat(xs) {
  return Array.prototype.concat.apply([], xs);
}

// Similar to **concat**, but all duplicates are removed
function mergeKeys(xs) {
  var obj = {};
  xs.forEach(function(x) {
    x.forEach(function(o) {
      obj[o] = o;
    });
  });
  return values(obj);
}
