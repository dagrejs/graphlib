var DEFAULT_EDGE_NAME = "\x00";
var GRAPH_NODE = "\x00";
var EDGE_KEY_DELIM = "\x01";

export interface GraphOptions {
  directed?: boolean;
  multigraph?: boolean;
  compound?: boolean;
}

interface Edge {
  v: string;
  w: string;

  /** The name that uniquely identifies a multi-edge. */
  name?: string;
}

// Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.

export class Graph {
  private _isDirected: boolean;
  private _isMultigraph: boolean;
  private _isCompound: boolean;

  // Label for the graph itself
  private _label?: string|number|Object;

  // Defaults to be set when creating a new node
  private _defaultNodeLabelFn: (v: string) => any = () => undefined;

  // Defaults to be set when creating a new edge
  private _defaultEdgeLabelFn: (v: string|Edge, w?: string, name?: string) => any = () => undefined;

  // v -> label
  private _nodes: Record<string, string> = {};

  private _parent?: Object;

  private _children?: Object;

  // v -> edgeObj
  private _in = {};

  // u -> v -> Number
  private _preds = {};

  // v -> edgeObj
  private _out = {};

  // v -> w -> Number
  private _sucs = {};

  // e -> edgeObj
  private _edgeObjs: Record<string, Edge> = {};

  // e -> label
  private _edgeLabels = {};

  /* Number of nodes in the graph. Should only be changed by the implementation. */
  private _nodeCount = 0;

  /* Number of edges in the graph. Should only be changed by the implementation. */
  private _edgeCount = 0;

  constructor(opts: GraphOptions = {}) {
    this._isDirected = opts.hasOwnProperty("directed") ? opts.directed! : true;
    this._isMultigraph = opts.hasOwnProperty("multigraph") ? opts.multigraph! : false;
    this._isCompound = opts.hasOwnProperty("compound") ? opts.compound! : false;

    if (this._isCompound) {
      // v -> parent
      this._parent = {};

      // v -> children
      this._children = {};
      this._children[GRAPH_NODE] = {};
    }
  }


/* === Graph functions ========= */

  /**
   * Whether graph was created with 'directed' flag set to true or not.
   */
  isDirected(): boolean {
    return this._isDirected;
  }

  /**
   * Whether graph was created with 'multigraph' flag set to true or not.
   */
  isMultigraph(): boolean {
    return this._isMultigraph;
  }

  /**
   * Whether graph was created with 'compound' flag set to true or not.
   */
  isCompound(): boolean {
    return this._isCompound;
  }

  /**
   * Sets the label of the graph.
   */
  setGraph(label?: string|number|Object): Graph {
    this._label = label;
    return this;
  }

  /**
   * Gets the graph label.
   */
  graph(): string|number|Object|undefined {
    if (typeof this._label === 'object') {
      return Object.assign({}, this._label);
    }

    return this._label;
  }


/* === Node functions ========== */

  /**
   * Sets the default node label. If newDefault is a function, it will be
   * invoked ach time when setting a label for a node. Otherwise, this label
   * will be assigned as default label in case if no label was specified while
   * setting a node.
   * Complexity: O(1).
   */
  setDefaultNodeLabel(newDefault: (v: string) => any | any): Graph {
    this._defaultNodeLabelFn = newDefault;
    if (typeof newDefault !== 'function') {
      this._defaultNodeLabelFn = () => newDefault;
    }

    return this;
  }

  /**
   * Gets the number of nodes in the graph.
   * Complexity: O(1).
   */
  nodeCount(): number {
    return this._nodeCount;
  }

  /**
   * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
   * not included in list.
   * Complexity: O(1).
   */
  nodes(): string[] {
    return Object.keys(this._nodes);
  }

  /**
   * Gets list of nodes without in-edges.
   * Complexity: O(|V|).
   */
  sources(): string[] {
    var self = this;
    return this.nodes().filter(function(v) {
      return Object.keys(self._in[v]).length === 0;
    });
  }

  /**
   * Gets list of nodes without out-edges.
   * Complexity: O(|V|).
   */
  sinks(): string[] {
    var self = this;
    return this.nodes().filter(function(v) {
      return Object.keys(self._out[v]).length === 0;
    });
  }

  /**
   * Invokes setNode method for each node in names list.
   * Complexity: O(|names|).
   */
  setNodes(vs: string[], value?: string): Graph {
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
  setNode(v: string, value?: any): Graph {
    if (this._nodes.hasOwnProperty(v)) {
      if (arguments.length > 1) {
        this._nodes[v] = value;
      }
      return this;
    }

    this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
    if (this._isCompound) {
      this._parent![v] = GRAPH_NODE;
      this._children![v] = {};
      this._children![GRAPH_NODE][v] = true;
    }
    this._in[v] = {};
    this._preds[v] = {};
    this._out[v] = {};
    this._sucs[v] = {};
    ++this._nodeCount;
    return this;
  }

  /**
   * Gets the label of node with specified name.
   * Complexity: O(|V|).
   */
  node(v: string): any {
    return this._nodes[v];
  }

  /**
   * Detects whether graph has a node with specified name or not.
   */
  hasNode(v: string): boolean {
    return this._nodes.hasOwnProperty(v);
  }

  /**
   * Remove the node with the name from the graph or do nothing if the node is not in
   * the graph. If the node was removed this function also removes any incident
   * edges.
   * Complexity: O(1).
   */
  removeNode(v: string): Graph {
    var self = this;
    if (this._nodes.hasOwnProperty(v)) {
      var removeEdge = function(e) { self.removeEdge(self._edgeObjs[e]); };
      delete this._nodes[v];
      if (this._isCompound) {
        this._removeFromParentsChildList(v);
        delete this._parent![v];
        this.children(v)!.forEach(function(child) {
          self.setParent(child);
        });
        delete this._children![v];
      }
      Object.keys(this._in[v]).forEach(removeEdge);
      delete this._in[v];
      delete this._preds[v];
      Object.keys(this._out[v]).forEach(removeEdge);
      delete this._out[v];
      delete this._sucs[v];
      --this._nodeCount;
    }
    return this;
  }

  /**
   * Sets node p as a parent for node v if it is defined, or removes the
   * parent for v if p is undefined. Method throws an exception in case of
   * invoking it in context of noncompound graph.
   * Average-case complexity: O(1).
   */
  setParent(v: string, parent?: string): Graph {
    if (!this._isCompound) {
      throw new Error("Cannot set parent in a non-compound graph");
    }

    if (parent === undefined) {
      parent = GRAPH_NODE;
    } else {
      // Coerce parent to string
      parent += "";
      for (var ancestor = parent;
        ancestor !== undefined;
        ancestor = (this.parent(ancestor as string) as string)) {
        if (ancestor === v) {
          throw new Error("Setting " + parent+ " as parent of " + v +
            " would create a cycle");
        }
      }

      this.setNode(parent!);
    }

    this.setNode(v);
    this._removeFromParentsChildList(v);
    this._parent![v] = parent;
    this._children![parent!][v] = true;
    return this;
  }

  private _removeFromParentsChildList(v) {
    delete this._children![this._parent![v]][v];
  }

  /**
   * Gets parent node for node v.
   * Complexity: O(1).
   */
  parent(v: string): string|void {
    if (this._isCompound) {
      var parent = this._parent![v];
      if (parent !== GRAPH_NODE) {
        return parent;
      }
    }
  }

  /**
   * Gets list of direct children of node v.
   * Complexity: O(1).
   */
  children(v = GRAPH_NODE): string[] | void {
    if (this._isCompound) {
      var children = this._children![v!];
      if (children) {
        return Object.keys(children);
      }
    } else if (v === GRAPH_NODE) {
      return this.nodes();
    } else if (this.hasNode(v!)) {
      return [];
    }

    return;
  }

  /**
   * Return all nodes that are predecessors of the specified node or undefined if node v is not in
   * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
   * Complexity: O(|V|).
   */
  predecessors(v: string): string[] | void {
    var predsV = this._preds[v];
    if (predsV) {
      return Object.keys(predsV);
    }
  }

  /**
   * Return all nodes that are successors of the specified node or undefined if node v is not in
   * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
   * Complexity: O(|V|).
   */
  successors(v: string): string[] | void {
    var sucsV = this._sucs[v];
    if (sucsV) {
      return Object.keys(sucsV);
    }
  }

  /**
   * Return all nodes that are predecessors or successors of the specified node or undefined if
   * node v is not in the graph.
   * Complexity: O(|V|).
   */
  neighbors(v: string): string[] | void {
    var preds = this.predecessors(v);
    if (preds) {
      const union = new Set(preds);
      for (const succ of this.successors(v)!) {
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
  filterNodes(filter: (v: string) => boolean): Graph {
    var copy = new Graph({
      directed: this._isDirected,
      multigraph: this._isMultigraph,
      compound: this._isCompound
    });

    copy.setGraph(this.graph());

    var self = this;
    Object.entries(this._nodes).forEach(function([v, value]) {
      if (filter(v)) {
        copy.setNode(v, value);
      }
    });

    Object.values(this._edgeObjs).forEach(function(e) {
      if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
        copy.setEdge(e, self.edge(e));
      }
    });

    var parents = {};
    function findParent(v) {
      var parent: string = self.parent(v) as string;
      if (parent === undefined || copy.hasNode(parent)) {
        parents[v] = parent;
        return parent;
      } else if (parent in parents) {
        return parents[parent];
      } else {
        return findParent(parent);
      }
    }

    if (this._isCompound) {
      copy.nodes().forEach(function(v) {
        copy.setParent(v, findParent(v));
      });
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
  setDefaultEdgeLabel(newDefault: (v: string|Edge, w?: string, name?: string) => any | any): Graph {
    this._defaultEdgeLabelFn = newDefault;
    if (typeof newDefault !== 'function') {
      this._defaultEdgeLabelFn = () => newDefault;
    }

    return this;
  }

  /**
   * Gets the number of edges in the graph.
   * Complexity: O(1).
   */
  edgeCount(): number {
    return this._edgeCount;
  }

  /**
   * Gets edges of the graph. In case of compound graph subgraphs are not considered.
   * Complexity: O(|E|).
   */
  edges(): Edge[] {
    return Object.values(this._edgeObjs);
  }

  /**
   * Establish an edges path over the nodes in nodes list. If some edge is already
   * exists, it will update its label, otherwise it will create an edge between pair
   * of nodes with label provided or default label if no label provided.
   * Complexity: O(|nodes|).
   */
  setPath(vs: string[], value?: any): Graph {
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
  setEdge(vOrEdge: string|number|Edge, wOrValue?: string|any, _label?: any, _name?: string): Graph {
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

    var e = edgeArgsToId(this._isDirected, v, w, name);
    if (this._edgeLabels.hasOwnProperty(e)) {
      if (valueSpecified) {
        this._edgeLabels[e] = value;
      }
      return this;
    }

    if (name !== undefined && !this._isMultigraph) {
      throw new Error("Cannot set a named edge when isMultigraph = false");
    }

    // It didn't exist, so we need to create it.
    // First ensure the nodes exist.
    this.setNode(v);
    this.setNode(w);

    this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name);

    var edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
    // Ensure we add undirected edges in a consistent way.
    v = edgeObj.v;
    w = edgeObj.w;

    Object.freeze(edgeObj);
    this._edgeObjs[e] = edgeObj;
    incrementOrInitEntry(this._preds[w], v);
    incrementOrInitEntry(this._sucs[v], w);
    this._in[w][e] = edgeObj;
    this._out[v][e] = edgeObj;
    this._edgeCount++;
    return this;
  }

  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(vOrEdge: string|number|Edge, w?: string|number, name?: string): any {
    var e = (arguments.length === 1
      ? edgeObjToId(this._isDirected, arguments[0])
      : edgeArgsToId(this._isDirected, vOrEdge, w, name));
    return this._edgeLabels[e];
  }

  /**
   * Detects whether the graph contains specified edge or not. No subgraphs are considered.
   * Complexity: O(1).
   */
  hasEdge(vOrEdge: string|number|Edge, w: string|number, name?: string): boolean {
    var e = (arguments.length === 1
      ? edgeObjToId(this._isDirected, arguments[0])
      : edgeArgsToId(this._isDirected, vOrEdge, w, name));
    return this._edgeLabels.hasOwnProperty(e);
  }

  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(vOrEdge: string|Edge, w?: string, name?: string): Graph {
    var e = (arguments.length === 1
      ? edgeObjToId(this._isDirected, arguments[0])
      : edgeArgsToId(this._isDirected, vOrEdge, w, name));
    var edge = this._edgeObjs[e];
    if (edge) {
      const v = edge.v;
      const w = edge.w;
      delete this._edgeLabels[e];
      delete this._edgeObjs[e];
      decrementOrRemoveEntry(this._preds[w], v);
      decrementOrRemoveEntry(this._sucs[v], w);
      delete this._in[w][e];
      delete this._out[v][e];
      this._edgeCount--;
    }
    return this;
  }

  /**
   * Return all edges that point to the node v. Optionally filters those edges down to just those
   * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
   * Complexity: O(|E|).
   */
  inEdges(v: string, u?: string): Edge[] | void {
    var inV = this._in[v];
    if (inV) {
      var edges = Object.values(inV) as Edge[];
      if (!u) {
        return edges;
      }
      return edges.filter(function(edge) { return edge.v === u; });
    }
  }

  /**
   * Return all edges that are pointed at by node v. Optionally filters those edges down to just
   * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
   * Complexity: O(|E|).
   */
  outEdges(v:string, w?: string): Edge[] | void {
    var outV = this._out[v];
    if (outV) {
      var edges = Object.values(outV) as Edge[];
      if (!w) {
        return edges;
      }
      return edges.filter(function(edge) { return edge.w === w; });
    }
  }

  /**
   * Returns all edges to or from node v regardless of direction. Optionally filters those edges
   * down to just those between nodes v and w regardless of direction.
   * Complexity: O(|E|).
   */
  nodeEdges(v: string, w?: string): Edge[] | void {
    var inEdges = this.inEdges(v, w);
    if (inEdges) {
      return inEdges.concat(this.outEdges(v, w) as Edge[]);
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
  var edgeObj: Edge =  { v: v, w: w };
  if (name) {
    edgeObj.name = name;
  }
  return edgeObj;
}

function edgeObjToId(isDirected, edgeObj) {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}
