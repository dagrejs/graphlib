"use strict";

var _ = require("lodash");

module.exports = Graph;

var EDGE_KEY_DELIM = "\x00",
    DEFAULT_EDGE_NAME = "\x01";

function Graph(opts) {
  this.isMultigraph = opts && opts.multigraph;

  this.isDirected = !opts || opts.directed;

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


/* === Node functions ========== */

Graph.prototype.nodeCount = function() {
  return this._nodeCount;
};

Graph.prototype.allNodes = function() {
  return _.keys(this._nodes);
};

Graph.prototype.nodes = function() {
  var self = this;
  return _.map(arguments, function(v) { return self.node(v); });
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

Graph.prototype.removeNode =  function(v) {
  var self = this;
  if (_.has(this._nodes, v)) {
    var removeEdge = function(e) { self.removeEdge(e); };
    delete this._nodes[v];
    _.each(_.keys(this._in[v]), removeEdge);
    delete this._in[v];
    _.each(_.keys(this._out[v]), removeEdge);
    delete this._out[v];
    --this._nodeCount;
  }
  return this;
};

Graph.prototype.predecessors = function(v) {
  var inEdges = this.inEdges(v);
  if (inEdges) {
    return _.map(inEdges, function(e) {
      return this.edgeKeyParts(e).v;
    }, this);
  }
};

Graph.prototype.successors = function(v) {
  var outEdges = this.outEdges(v);
  if (outEdges) {
    return _.map(outEdges, function(e) {
      return this.edgeKeyParts(e).w;
    }, this);
  }
};

Graph.prototype.neighbors = function(v) {
  var predecessors = this.predecessors(v);
  if (predecessors) {
    return _.union(predecessors, this.successors(v));
  }
};

/* === Edge functions ========== */

Graph.prototype.edgeCount = function() {
  return this._edgeCount;
};

Graph.prototype.allEdges = function() {
  return _.keys(this._edges);
};

Graph.prototype.path = function() {
  var self = this,
      segments = new Array(arguments.length - 1);
  _.reduce(arguments, function(v, w, i) {
    segments[i - 1] = self.edge(v, w);
    return w;
  });
  return segments;
};

Graph.prototype.edge = function(v, w, name) {
  var e = arguments.length === 1 ? v : this.edgeKey(v, w, name),
      edge;

  edge = this._edges[e];
  if (edge) {
    return edge;
  }

  if (_.isUndefined(name) || this.isMultigraph) {
    // We need to create the edge
    if (arguments.length === 1) {
      var splitKey = this.edgeKeyParts(e);
      v = splitKey.v;
      w = splitKey.w;
      name = splitKey.name;
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
  var e = arguments.length === 1 ? v : this.edgeKey(v, w, name);
  return _.has(this._edges, e);
};

Graph.prototype.removeEdge = function(v, w, name) {
  var e = arguments.length === 1 ? v : this.edgeKey(v, w, name);
  if (_.has(this._edges, e)) {
    if (arguments.length === 1) {
      var splitKey = this.edgeKeyParts(e);
      v = splitKey.v;
      w = splitKey.w;
      name = splitKey.name;
    }
    delete this._out[v][e];
    delete this._in[w][e];
    delete this._edges[e];
    this._edgeCount--;
  }
};

Graph.prototype.inEdges = function(v) {
  var inV = this._in[v];
  if (inV) {
    return _.keys(inV);
  }
};

Graph.prototype.outEdges = function(v) {
  var outV = this._out[v];
  if (outV) {
    return _.keys(outV);
  }
};

Graph.prototype.edges = function(v) {
  var inEdges = this.inEdges(v);
  if (inEdges) {
    return inEdges.concat(this.outEdges(v));
  }
};

Graph.prototype.edgeKey = function(v, w, name) {
  if (!this.isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM +
             (_.isUndefined(name) ? DEFAULT_EDGE_NAME : name);
};

Graph.prototype.edgeKeyParts = function splitEdgeKey(e) {
  var parts = e.split(EDGE_KEY_DELIM);
  return { v: parts[0], w: parts[1], name: parts[2] };
};
