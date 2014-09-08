var _ = require("lodash");

module.exports = Graph;

var EDGE_KEY_DELIM = "\x00",
    DEFAULT_EDGE_NAME = "\x01";

function Graph(opts) {
  this.isMultigraph = opts && opts.multigraph;

  // Attributes for the graph itself
  this.attrs = {};

  // Defaults to be applied when creating a new node
  this.nodeAttrDefs = {};

  // Defaults to be applied when creating a new edge
  this.edgeAttrDefs = {};

  // v -> attrs
  this._nodes = {};

  // v -> u -> e
  this._in= {};

  // v -> w -> e
  this._out= {};

  // e -> attrs
  this._edges = {};
}

/* Number of nodes in the graph. Should only be changed by the implementation. */
Graph.prototype._nodeCount = 0;

/* Number of edges in the graph. Should only be changed by the implementation. */
Graph.prototype._edgeCount = 0;


/* === Graph functions ========== */

Graph.prototype.copy = function() {
  var copy = new Graph();
  copy._nodeCount = this._nodeCount;
  copy._edgeCount = this._edgeCount;
  copy._nodes = _.clone(this._nodes);
  copy._inEdges = _.mapValues(this._inEdges, _.clone);
  copy._outEdges = _.mapValues(this._outEdges, _.clone);
  return copy;
};


/* === Node functions ========== */

Graph.prototype.nodeCount = function() {
  return this._nodeCount;
};

Graph.prototype.nodes = function() {
  return _.keys(this._nodes);
};

Graph.prototype.node = function(v) {
  var nodes = this._nodes,
      node = nodes[v];
  if (!node) {
    node = nodes[v] = _.merge({}, this.nodeAttrDefs);
    this._in[v] = {};
    this._out[v] = {};
    ++this._nodeCount;
  }
  return node;
};

Graph.prototype.hasNode = function(v) {
  return _.has(this._nodes, v);
};

Graph.prototype.setNodes = function(vs, label) {
  var args = arguments;
  _.each(vs, function(v) {
    if (args.length > 1) {
      this.setNode(v, label);
    } else {
      this.setNode(v);
    }
  }, this);
  return this;
};

Graph.prototype.removeNode =  function(v) {
  if (_.has(this._nodes, v)) {
    --this._nodeCount;
    delete this._nodes[v];

    this._onRemoveNode(v);

    delete this._inEdges[v];
    delete this._outEdges[v];
  }
  return this;
};

Graph.prototype.successors = function(v) {
  var outEdges = this._outEdges[v];
  return outEdges && _.keys(outEdges);
};

Graph.prototype.predecessors = function(v) {
  var inEdges = this._inEdges[v];
  return inEdges && _.keys(inEdges);
};

Graph.prototype.inEdges = function(v) {
  var inEdges = this._inEdges[v];
  if (inEdges) {
    return _.values(inEdges);
  }
};

Graph.prototype.outEdges = function(v) {
  var outEdges = this._outEdges[v];
  if (outEdges) {
    return _.values(outEdges);
  }
};

Graph.prototype._onRemoveNode = _.noop;


/* === Edge functions ========== */

Graph.prototype.edgeCount = function() {
  return this._edgeCount;
};

Graph.prototype.edges = function() {
  return _.keys(this._edges);
};

Graph.prototype.edge = function(v, w, name) {
  var e = arguments.length === 1 ? v : createEdgeKey(v, w, name),
      edge;

  edge = this._edges[e];
  if (edge) {
    return edge;
  }

  if (_.isUndefined(name) || this.isMultigraph) {
    // We need to create the edge
    if (arguments.length === 1) {
      var splitKey = splitEdgeKey(e);
      v = splitKey[0];
      w = splitKey[1];
      name = splitKey[2];
    }

    // Ensure the nodes are created
    this.node(v);
    this.node(w);

    edge = _.merge({}, this.edgeAttrDefs);
    this._edges[e] = edge;
    this._out[v][e] = true;
    this._in[w][e] = true;
    this._edgeCount++;
    return edge;
  }
};

Graph.prototype.hasEdge = function(v, w, name) {
  var e = arguments.length === 1 ? v : createEdgeKey(v, w, name);
  return _.has(this._edges, e);
};

Graph.prototype.edgeKey = createEdgeKey;

function createEdgeKey(v, w, name) {
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM +
             (_.isUndefined(name) ? DEFAULT_EDGE_NAME : name);
}

function splitEdgeKey(e) {
  return e.split(EDGE_KEY_DELIM);
}

Graph.prototype.setPath = function(vs, label) {
  var self = this,
      args = arguments;
  _.reduce(vs, function(v, w) {
    if (args.length > 1) {
      self.setEdge(v, w, label);
    } else {
      self.setEdge(v, w);
    }
    return w;
  });
  return this;
};
