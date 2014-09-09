"use strict";

var _ = require("lodash");

module.exports = Graph;

var DEFAULT_EDGE_NAME = "\x00",
    EDGE_KEY_DELIM = "\x01";

// Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.

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

  // v -> edgeObj
  this._in = {};

  // u -> v -> Number
  this._preds = {};

  // v -> edgeObj
  this._out = {};

  // v -> w -> Number
  this._sucs = {};

  // e -> edgeObj
  this._edgeObjs = {};

  // e -> attrs
  this._edgeAttrs = {};
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

Graph.prototype.nodes = function() {
  return _.keys(this._nodes);
};

Graph.prototype.sources = function() {
  return _.filter(this.nodes(), function(v) {
    return !this.inEdges(v).length;
  }, this);
};

Graph.prototype.sinks = function() {
  return _.filter(this.nodes(), function(v) {
    return !this.outEdges(v).length;
  }, this);
};

Graph.prototype.node = function(v) {
  var nodes = this._nodes,
      node = nodes[v];
  if (!node) {
    node = nodes[v] = _.merge({}, this.nodeAttrDefs);
    this._in[v] = {};
    this._preds[v] = {};
    this._out[v] = {};
    this._sucs[v] = {};
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
    var removeEdge = function(e) { self.removeEdge(edgeIdToObj(e)); };
    delete this._nodes[v];
    _.each(_.keys(this._in[v]), removeEdge);
    delete this._in[v];
    delete this._preds[v];
    _.each(_.keys(this._out[v]), removeEdge);
    delete this._out[v];
    delete this._sucs[v];
    --this._nodeCount;
  }
  return this;
};

Graph.prototype.predecessors = function(v) {
  var predsV = this._preds[v];
  if (predsV) {
    return _.keys(predsV);
  }
};

Graph.prototype.successors = function(v) {
  var sucsV = this._sucs[v];
  if (sucsV) {
    return _.keys(sucsV);
  }
};

Graph.prototype.neighbors = function(v) {
  var preds = this.predecessors(v);
  if (preds) {
    return _.union(preds, this.successors(v));
  }
};

/* === Edge functions ========== */

Graph.prototype.edgeCount = function() {
  return this._edgeCount;
};

Graph.prototype.edges = function() {
  return _.values(this._edgeObjs);
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
  // Handle the different types of input possible: (v, w, name) and ({ v, w,
  // name }).
  var e = (arguments.length === 1
              ? edgeObjToId(this.isDirected, arguments[0])
              : edgeArgsToId(this.isDirected, v, w, name));
  var edge = this._edgeAttrs[e];
  if (edge) {
    return edge;
  }

  // We may have to create the edge, so we need to ensure we've got v, w, name
  // set to their correct values based on the arguments we received.
  if (arguments.length === 1) {
    v = arguments[0].v;
    w = arguments[0].w;
    name = arguments[0].name;
  }

  if (_.isUndefined(name) || this.isMultigraph) {
    // It didn't exist, so we need to create it.
    // First ensure the nodes exist.
    this.node(v);
    this.node(w);

    edge = this._edgeAttrs[e] = _.merge({}, this.edgeAttrDefs);

    var edgeObj = edgeIdToObj(e);
    Object.freeze(edgeObj);
    this._edgeObjs[e] = edgeObj;
    this._in[w][e] = edgeObj;
    var predsW = this._preds[w];
    if (_.has(predsW, v)) {
      predsW[v]++;
    } else {
      predsW[v] = 1;
    }
    this._out[v][e] = edgeObj;
    var sucsV = this._sucs[v];
    if (_.has(sucsV, w)) {
      sucsV[w]++;
    } else {
      sucsV[w] = 1;
    }
    if (v > w) {
      var tmp = v;
      v = w;
      w = tmp;
    }
    this._edgeCount++;
    return edge;
  }
};

Graph.prototype.hasEdge = function(v, w, name) {
  var e = (arguments.length === 1
            ? edgeObjToId(this.isDirected, arguments[0])
            : edgeArgsToId(this.isDirected, v, w, name));
  return _.has(this._edgeAttrs, e);
};

Graph.prototype.removeEdge = function(v, w, name) {
  var e = (arguments.length === 1
            ? edgeObjToId(this.isDirected, arguments[0])
            : edgeArgsToId(this.isDirected, v, w, name));
  if (_.has(this._edgeAttrs, e)) {
    if (arguments.length === 1) {
      v = arguments[0].v;
      w = arguments[0].w;
      name = arguments[0].name;
    }
    delete this._edgeAttrs[e];
    delete this._edgeObjs[e];
    delete this._in[w][e];
    if (!--this._preds[w][v]) {
      delete this._preds[w][v];
    }
    delete this._out[v][e];
    if (!--this._sucs[v][w]) {
      delete this._sucs[v][w];
    }
    this._edgeCount--;
  }
};

Graph.prototype.inEdges = function(v) {
  var inV = this._in[v];
  if (inV) {
    return _.values(inV);
  }
};

Graph.prototype.outEdges = function(v) {
  var outV = this._out[v];
  if (outV) {
    return _.values(outV);
  }
};

Graph.prototype.nodeEdges = function(v) {
  var inEdges = this.inEdges(v);
  if (inEdges) {
    return inEdges.concat(this.outEdges(v));
  }
};

function edgeArgsToId(isDirected, v, w, name) {
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM +
             (_.isUndefined(name) ? DEFAULT_EDGE_NAME : name);
}

function edgeObjToId(isDirected, edgeObj) {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}

function edgeIdToObj(e) {
  var parts = e.split(EDGE_KEY_DELIM),
      edgeObj = { v: parts[0], w: parts[1] };
  if (parts[2] !== DEFAULT_EDGE_NAME) {
    edgeObj.name = parts[2];
  }
  return edgeObj;
}
