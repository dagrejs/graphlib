"use strict";

var DEFAULT_EDGE_NAME = "\x00";
var GRAPH_NODE = "\x00";
var EDGE_KEY_DELIM = "\x01";

// Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.

class Graph {
  #isDirected = true;
  #isMultigraph = false;
  #isCompound = false;

  // Label for the graph itself
  #label;

  // Defaults to be set when creating a new node
  #defaultNodeLabelFn = () => undefined;

  // Defaults to be set when creating a new edge
  #defaultEdgeLabelFn = () => undefined;

  // v -> label
  #nodes = {};

  // v -> edgeObj
  #in = {};

  // u -> v -> Number
  #preds = {};

  // v -> edgeObj
  #out = {};

  // v -> w -> Number
  #sucs = {};

  // e -> edgeObj
  #edgeObjs = {};

  // e -> label
  #edgeLabels = {};

  /* Number of nodes in the graph. Should only be changed by the implementation. */
  #nodeCount = 0;

  /* Number of edges in the graph. Should only be changed by the implementation. */
  #edgeCount = 0;

  #parent;

  #children;

  constructor(opts) {
    if (opts) {
      this.#isDirected = opts.hasOwnProperty("directed") ? opts.directed : true;
      this.#isMultigraph = opts.hasOwnProperty("multigraph") ? opts.multigraph : false;
      this.#isCompound = opts.hasOwnProperty("compound") ? opts.compound : false;
    }

    if (this.#isCompound) {
      // v -> parent
      this.#parent = {};

      // v -> children
      this.#children = {};
      this.#children[GRAPH_NODE] = {};
    }
  }

  /* === Graph functions ========= */

  /**
   * Whether graph was created with 'directed' flag set to true or not.
   */
  isDirected() {
    return this.#isDirected;
  }

  /**
   * Whether graph was created with 'multigraph' flag set to true or not.
   */
  isMultigraph() {
    return this.#isMultigraph;
  }

  /**
   * Whether graph was created with 'compound' flag set to true or not.
   */
  isCompound() {
    return this.#isCompound;
  }

  /**
   * Sets the label of the graph.
   */
  setGraph(label) {
    this.#label = label;
    return this;
  }

  /**
   * Gets the graph label.
   */
  graph() {
    return this.#label;
  }


  /* === Node functions ========== */

  /**
   * Sets the default node label. If newDefault is a function, it will be
   * invoked ach time when setting a label for a node. Otherwise, this label
   * will be assigned as default label in case if no label was specified while
   * setting a node.
   * Complexity: O(1).
   */
  setDefaultNodeLabel(newDefault) {
    this.#defaultNodeLabelFn = newDefault;
    if (typeof newDefault !== 'function') {
      this.#defaultNodeLabelFn = () => newDefault;
    }

    return this;
  }

  /**
   * Gets the number of nodes in the graph.
   * Complexity: O(1).
   */
  nodeCount() {
    return this.#nodeCount;
  }

  /**
   * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
   * not included in list.
   * Complexity: O(1).
   */
  nodes() {
    return Object.keys(this.#nodes);
  }

  /**
   * Gets list of nodes without in-edges.
   * Complexity: O(|V|).
   */
  sources() {
    var self = this;
    return this.nodes().filter(v => Object.keys(self.#in[v]).length === 0);
  }

  /**
   * Gets list of nodes without out-edges.
   * Complexity: O(|V|).
   */
  sinks() {
    var self = this;
    return this.nodes().filter(v => Object.keys(self.#out[v]).length === 0);
  }

  /**
   * Invokes setNode method for each node in names list.
   * Complexity: O(|names|).
   */
  setNodes(vs, value) {
    var args = arguments;
    var self = this;
    vs.forEach(function(v) {
      if (args.length > 1) {
        self.setNode(v, value);
      } else {
        self.setNode(v);
      }
    });
    return this;
  }

  /**
   * Creates or updates the value for the node v in the graph. If label is supplied
   * it is set as the value for the node. If label is not supplied and the node was
   * created by this call then the default node label will be assigned.
   * Complexity: O(1).
   */
  setNode(v, value) {
    if (this.#nodes.hasOwnProperty(v)) {
      if (arguments.length > 1) {
        this.#nodes[v] = value;
      }
      return this;
    }

    this.#nodes[v] = arguments.length > 1 ? value : this.#defaultNodeLabelFn(v);
    if (this.#isCompound) {
      this.#parent[v] = GRAPH_NODE;
      this.#children[v] = {};
      this.#children[GRAPH_NODE][v] = true;
    }
    this.#in[v] = {};
    this.#preds[v] = {};
    this.#out[v] = {};
    this.#sucs[v] = {};
    ++this.#nodeCount;
    return this;
  }

  /**
   * Gets the label of node with specified name.
   * Complexity: O(|V|).
   */
  node(v) {
    return this.#nodes[v];
  }

  /**
   * Detects whether graph has a node with specified name or not.
   */
  hasNode(v) {
    return this.#nodes.hasOwnProperty(v);
  }

  /**
   * Remove the node with the name from the graph or do nothing if the node is not in
   * the graph. If the node was removed this function also removes any incident
   * edges.
   * Complexity: O(1).
   */
  removeNode(v) {
    var self = this;
    if (this.#nodes.hasOwnProperty(v)) {
      var removeEdge = e => self.removeEdge(self.#edgeObjs[e]);
      delete this.#nodes[v];
      if (this.#isCompound) {
        this.#removeFromParentsChildList(v);
        delete this.#parent[v];
        this.children(v).forEach(function(child) {
          self.setParent(child);
        });
        delete this.#children[v];
      }
      Object.keys(this.#in[v]).forEach(removeEdge);
      delete this.#in[v];
      delete this.#preds[v];
      Object.keys(this.#out[v]).forEach(removeEdge);
      delete this.#out[v];
      delete this.#sucs[v];
      --this.#nodeCount;
    }
    return this;
  }

  /**
   * Sets node p as a parent for node v if it is defined, or removes the
   * parent for v if p is undefined. Method throws an exception in case of
   * invoking it in context of noncompound graph.
   * Average-case complexity: O(1).
   */
  setParent(v, parent) {
    if (!this.#isCompound) {
      throw new Error("Cannot set parent in a non-compound graph");
    }

    if (parent === undefined) {
      parent = GRAPH_NODE;
    } else {
      // Coerce parent to string
      parent += "";
      for (var ancestor = parent; ancestor !== undefined; ancestor = this.parent(ancestor)) {
        if (ancestor === v) {
          throw new Error("Setting " + parent+ " as parent of " + v +
              " would create a cycle");
        }
      }

      this.setNode(parent);
    }

    this.setNode(v);
    this.#removeFromParentsChildList(v);
    this.#parent[v] = parent;
    this.#children[parent][v] = true;
    return this;
  }

  #removeFromParentsChildList(v) {
    delete this.#children[this.#parent[v]][v];
  }

  /**
   * Gets parent node for node v.
   * Complexity: O(1).
   */
  parent(v) {
    if (this.#isCompound) {
      var parent = this.#parent[v];
      if (parent !== GRAPH_NODE) {
        return parent;
      }
    }
  }

  /**
   * Gets list of direct children of node v.
   * Complexity: O(1).
   */
  children(v = GRAPH_NODE) {
    if (this.#isCompound) {
      var children = this.#children[v];
      if (children) {
        return Object.keys(children);
      }
    } else if (v === GRAPH_NODE) {
      return this.nodes();
    } else if (this.hasNode(v)) {
      return [];
    }
  }

  /**
   * Return all nodes that are predecessors of the specified node or undefined if node v is not in
   * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
   * Complexity: O(|V|).
   */
  predecessors(v) {
    var predsV = this.#preds[v];
    if (predsV) {
      return Object.keys(predsV);
    }
  }

  /**
   * Return all nodes that are successors of the specified node or undefined if node v is not in
   * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
   * Complexity: O(|V|).
   */
  successors(v) {
    var sucsV = this.#sucs[v];
    if (sucsV) {
      return Object.keys(sucsV);
    }
  }

  /**
   * Return all nodes that are predecessors or successors of the specified node or undefined if
   * node v is not in the graph.
   * Complexity: O(|V|).
   */
  neighbors(v) {
    var preds = this.predecessors(v);
    if (preds) {
      const union = new Set(preds);
      for (var succ of this.successors(v)) {
        union.add(succ);
      }

      return Array.from(union.values());
    }
  }

  isLeaf(v) {
    var neighbors;
    if (this.isDirected()) {
      neighbors = this.successors(v);
    } else {
      neighbors = this.neighbors(v);
    }
    return neighbors.length === 0;
  }

  /**
   * Creates new graph with nodes filtered via filter. Edges incident to rejected node
   * are also removed. In case of compound graph, if parent is rejected by filter,
   * than all its children are rejected too.
   * Average-case complexity: O(|E|+|V|).
   */
  filterNodes(filter) {
    var copy = new this.constructor({
      directed: this.#isDirected,
      multigraph: this.#isMultigraph,
      compound: this.#isCompound
    });

    copy.setGraph(this.graph());

    var self = this;
    Object.entries(this.#nodes).forEach(function([v, value]) {
      if (filter(v)) {
        copy.setNode(v, value);
      }
    });

    Object.values(this.#edgeObjs).forEach(function(e) {
      if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
        copy.setEdge(e, self.edge(e));
      }
    });

    var parents = {};
    function findParent(v) {
      var parent = self.parent(v);
      if (parent === undefined || copy.hasNode(parent)) {
        parents[v] = parent;
        return parent;
      } else if (parent in parents) {
        return parents[parent];
      } else {
        return findParent(parent);
      }
    }

    if (this.#isCompound) {
      copy.nodes().forEach(v => copy.setParent(v, findParent(v)));
    }

    return copy;
  }

  /* === Edge functions ========== */

  /**
   * Sets the default edge label or factory function. This label will be
   * assigned as default label in case if no label was specified while setting
   * an edge or this function will be invoked each time when setting an edge
   * with no label specified and returned value * will be used as a label for edge.
   * Complexity: O(1).
   */
  setDefaultEdgeLabel(newDefault) {
    this.#defaultEdgeLabelFn = newDefault;
    if (typeof newDefault !== 'function') {
      this.#defaultEdgeLabelFn = () => newDefault;
    }

    return this;
  }

  /**
   * Gets the number of edges in the graph.
   * Complexity: O(1).
   */
  edgeCount() {
    return this.#edgeCount;
  }

  /**
   * Gets edges of the graph. In case of compound graph subgraphs are not considered.
   * Complexity: O(|E|).
   */
  edges() {
    return Object.values(this.#edgeObjs);
  }

  /**
   * Establish an edges path over the nodes in nodes list. If some edge is already
   * exists, it will update its label, otherwise it will create an edge between pair
   * of nodes with label provided or default label if no label provided.
   * Complexity: O(|nodes|).
   */
  setPath(vs, value) {
    var self = this;
    var args = arguments;
    vs.reduce(function(v, w) {
      if (args.length > 1) {
        self.setEdge(v, w, value);
      } else {
        self.setEdge(v, w);
      }
      return w;
    });
    return this;
  }

  /**
   * Creates or updates the label for the edge (v, w) with the optionally supplied
   * name. If label is supplied it is set as the value for the edge. If label is not
   * supplied and the edge was created by this call then the default edge label will
   * be assigned. The name parameter is only useful with multigraphs.
   */
  setEdge() {
    var v, w, name, value;
    var valueSpecified = false;
    var arg0 = arguments[0];

    if (typeof arg0 === "object" && arg0 !== null && "v" in arg0) {
      v = arg0.v;
      w = arg0.w;
      name = arg0.name;
      if (arguments.length === 2) {
        value = arguments[1];
        valueSpecified = true;
      }
    } else {
      v = arg0;
      w = arguments[1];
      name = arguments[3];
      if (arguments.length > 2) {
        value = arguments[2];
        valueSpecified = true;
      }
    }

    v = "" + v;
    w = "" + w;
    if (name !== undefined) {
      name = "" + name;
    }

    var e = edgeArgsToId(this.#isDirected, v, w, name);
    if (this.#edgeLabels.hasOwnProperty(e)) {
      if (valueSpecified) {
        this.#edgeLabels[e] = value;
      }
      return this;
    }

    if (name !== undefined && !this.#isMultigraph) {
      throw new Error("Cannot set a named edge when isMultigraph = false");
    }

    // It didn't exist, so we need to create it.
    // First ensure the nodes exist.
    this.setNode(v);
    this.setNode(w);

    this.#edgeLabels[e] = valueSpecified ? value : this.#defaultEdgeLabelFn(v, w, name);

    var edgeObj = edgeArgsToObj(this.#isDirected, v, w, name);
    // Ensure we add undirected edges in a consistent way.
    v = edgeObj.v;
    w = edgeObj.w;

    Object.freeze(edgeObj);
    this.#edgeObjs[e] = edgeObj;
    incrementOrInitEntry(this.#preds[w], v);
    incrementOrInitEntry(this.#sucs[v], w);
    this.#in[w][e] = edgeObj;
    this.#out[v][e] = edgeObj;
    this.#edgeCount++;
    return this;
  }

  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(v, w, name) {
    var e = (arguments.length === 1
      ? edgeObjToId(this.#isDirected, arguments[0])
      : edgeArgsToId(this.#isDirected, v, w, name));
    return this.#edgeLabels[e];
  }

  /**
   * Gets the label for the specified edge and converts it to an object.
   * Complexity: O(1)
   */
  edgeAsObj() {
    const edge = this.edge(...arguments);
    if (typeof edge !== "object") {
      return {label: edge};
    }

    return edge;
  }

  /**
   * Detects whether the graph contains specified edge or not. No subgraphs are considered.
   * Complexity: O(1).
   */
  hasEdge(v, w, name) {
    var e = (arguments.length === 1
      ? edgeObjToId(this.#isDirected, arguments[0])
      : edgeArgsToId(this.#isDirected, v, w, name));
    return this.#edgeLabels.hasOwnProperty(e);
  }

  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(v, w, name) {
    var e = (arguments.length === 1
      ? edgeObjToId(this.#isDirected, arguments[0])
      : edgeArgsToId(this.#isDirected, v, w, name));
    var edge = this.#edgeObjs[e];
    if (edge) {
      v = edge.v;
      w = edge.w;
      delete this.#edgeLabels[e];
      delete this.#edgeObjs[e];
      decrementOrRemoveEntry(this.#preds[w], v);
      decrementOrRemoveEntry(this.#sucs[v], w);
      delete this.#in[w][e];
      delete this.#out[v][e];
      this.#edgeCount--;
    }
    return this;
  }

  /**
   * Return all edges that point to the node v. Optionally filters those edges down to just those
   * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
   * Complexity: O(|E|).
   */
  inEdges(v, u) {
    var inV = this.#in[v];
    if (inV) {
      var edges = Object.values(inV);
      if (!u) {
        return edges;
      }
      return edges.filter(edge => edge.v === u);
    }
  }

  /**
   * Return all edges that are pointed at by node v. Optionally filters those edges down to just
   * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
   * Complexity: O(|E|).
   */
  outEdges(v, w) {
    var outV = this.#out[v];
    if (outV) {
      var edges = Object.values(outV);
      if (!w) {
        return edges;
      }
      return edges.filter(edge => edge.w === w);
    }
  }

  /**
   * Returns all edges to or from node v regardless of direction. Optionally filters those edges
   * down to just those between nodes v and w regardless of direction.
   * Complexity: O(|E|).
   */
  nodeEdges(v, w) {
    var inEdges = this.inEdges(v, w);
    if (inEdges) {
      return inEdges.concat(this.outEdges(v, w));
    }
  }
}

function incrementOrInitEntry(map, k) {
  if (map[k]) {
    map[k]++;
  } else {
    map[k] = 1;
  }
}

function decrementOrRemoveEntry(map, k) {
  if (!--map[k]) { delete map[k]; }
}

function edgeArgsToId(isDirected, v_, w_, name) {
  var v = "" + v_;
  var w = "" + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM +
             (name === undefined ? DEFAULT_EDGE_NAME : name);
}

function edgeArgsToObj(isDirected, v_, w_, name) {
  var v = "" + v_;
  var w = "" + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  var edgeObj =  { v: v, w: w };
  if (name) {
    edgeObj.name = name;
  }
  return edgeObj;
}

function edgeObjToId(isDirected, edgeObj) {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}

module.exports = Graph;
