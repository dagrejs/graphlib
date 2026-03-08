"use strict";
var graphlib = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // index.ts
  var index_exports = {};
  __export(index_exports, {
    Graph: () => Graph,
    alg: () => alg_exports,
    json: () => json_exports,
    version: () => version
  });

  // lib/graph.ts
  var DEFAULT_EDGE_NAME = "\0";
  var GRAPH_NODE = "\0";
  var EDGE_KEY_DELIM = "";
  var Graph = class {
    constructor(opts) {
      this._isDirected = true;
      this._isMultigraph = false;
      this._isCompound = false;
      // v -> label
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
      // e -> label
      this._edgeLabels = {};
      /* Number of nodes in the graph. Should only be changed by the implementation. */
      this._nodeCount = 0;
      /* Number of edges in the graph. Should only be changed by the implementation. */
      this._edgeCount = 0;
      // Defaults to be set when creating a new node
      this._defaultNodeLabelFn = () => void 0;
      // Defaults to be set when creating a new edge
      this._defaultEdgeLabelFn = () => void 0;
      if (opts) {
        this._isDirected = "directed" in opts ? opts.directed : true;
        this._isMultigraph = "multigraph" in opts ? opts.multigraph : false;
        this._isCompound = "compound" in opts ? opts.compound : false;
      }
      if (this._isCompound) {
        this._parent = {};
        this._children = {};
        this._children[GRAPH_NODE] = {};
      }
    }
    /**
     * Whether graph was created with 'directed' flag set to true or not.
     *
     * @returns whether the graph edges have an orientation.
     */
    isDirected() {
      return this._isDirected;
    }
    /**
     * Whether graph was created with 'multigraph' flag set to true or not.
     *
     * @returns whether the pair of nodes of the graph can have multiple edges.
     */
    isMultigraph() {
      return this._isMultigraph;
    }
    /* === Graph functions ========= */
    /**
     * Whether graph was created with 'compound' flag set to true or not.
     *
     * @returns whether a node of the graph can have subnodes.
     */
    isCompound() {
      return this._isCompound;
    }
    /**
     * Sets the label of the graph.
     *
     * @param label - label value.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setGraph(label) {
      this._label = label;
      return this;
    }
    /**
     * Gets the graph label.
     *
     * @returns currently assigned label for the graph or undefined if no label assigned.
     */
    graph() {
      return this._label;
    }
    /**
     * Sets the default node label. This label will be assigned as default label
     * in case if no label was specified while setting a node.
     * Complexity: O(1).
     *
     * @param labelOrFn - default node label or label factory function.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setDefaultNodeLabel(labelOrFn) {
      if (typeof labelOrFn !== "function") {
        this._defaultNodeLabelFn = () => labelOrFn;
      } else {
        this._defaultNodeLabelFn = labelOrFn;
      }
      return this;
    }
    /**
     * Gets the number of nodes in the graph.
     * Complexity: O(1).
     *
     * @returns nodes count.
     */
    nodeCount() {
      return this._nodeCount;
    }
    /* === Node functions ========== */
    /**
     * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
     * not included in list.
     * Complexity: O(1).
     *
     * @returns list of graph nodes.
     */
    nodes() {
      return Object.keys(this._nodes);
    }
    /**
     * Gets list of nodes without in-edges.
     * Complexity: O(|V|).
     *
     * @returns the graph source nodes.
     */
    sources() {
      return this.nodes().filter((v) => Object.keys(this._in[v]).length === 0);
    }
    /**
     * Gets list of nodes without out-edges.
     * Complexity: O(|V|).
     *
     * @returns the graph sink nodes.
     */
    sinks() {
      return this.nodes().filter((v) => Object.keys(this._out[v]).length === 0);
    }
    /**
     * Invokes setNode method for each node in names list.
     * Complexity: O(|names|).
     *
     * @param names - list of nodes names to be set.
     * @param label - value to set for each node in list.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setNodes(names, label) {
      names.forEach((v) => {
        if (label !== void 0) {
          this.setNode(v, label);
        } else {
          this.setNode(v);
        }
      });
      return this;
    }
    /**
     * Creates or updates the value for the node v in the graph. If label is supplied
     * it is set as the value for the node. If label is not supplied and the node was
     * created by this call then the default node label will be assigned.
     * Complexity: O(1).
     *
     * @param name - node name.
     * @param label - value to set for node.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setNode(name, label) {
      if (name in this._nodes) {
        if (arguments.length > 1) {
          this._nodes[name] = label;
        }
        return this;
      }
      this._nodes[name] = arguments.length > 1 ? label : this._defaultNodeLabelFn(name);
      if (this._isCompound) {
        this._parent[name] = GRAPH_NODE;
        this._children[name] = {};
        this._children[GRAPH_NODE][name] = true;
      }
      this._in[name] = {};
      this._preds[name] = {};
      this._out[name] = {};
      this._sucs[name] = {};
      ++this._nodeCount;
      return this;
    }
    /**
     * Gets the label of node with specified name.
     * Complexity: O(|V|).
     *
     * @param name - node name.
     * @returns label value of the node.
     */
    node(name) {
      return this._nodes[name];
    }
    /**
     * Detects whether graph has a node with specified name or not.
     *
     * @param name - name of the node.
     * @returns true if graph has node with specified name, false - otherwise.
     */
    hasNode(name) {
      return name in this._nodes;
    }
    /**
     * Remove the node with the name from the graph or do nothing if the node is not in
     * the graph. If the node was removed this function also removes any incident
     * edges.
     * Complexity: O(1).
     *
     * @param name - name of the node.
     * @returns the graph, allowing this to be chained with other functions.
     */
    removeNode(name) {
      if (name in this._nodes) {
        const removeEdge = (e) => this.removeEdge(this._edgeObjs[e]);
        delete this._nodes[name];
        if (this._isCompound) {
          this._removeFromParentsChildList(name);
          delete this._parent[name];
          this.children(name).forEach((child) => {
            this.setParent(child);
          });
          delete this._children[name];
        }
        Object.keys(this._in[name]).forEach(removeEdge);
        delete this._in[name];
        delete this._preds[name];
        Object.keys(this._out[name]).forEach(removeEdge);
        delete this._out[name];
        delete this._sucs[name];
        --this._nodeCount;
      }
      return this;
    }
    /**
     * Sets node parent for node v if it is defined, or removes the
     * parent for v if p is undefined. Method throws an exception in case of
     * invoking it in context of noncompound graph.
     * Average-case complexity: O(1).
     *
     * @param v - node to be child for p.
     * @param parent - node to be parent for v.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setParent(v, parent) {
      if (!this._isCompound) {
        throw new Error("Cannot set parent in a non-compound graph");
      }
      if (parent === void 0) {
        parent = GRAPH_NODE;
      } else {
        parent += "";
        for (let ancestor = parent; ancestor !== void 0; ancestor = this.parent(ancestor)) {
          if (ancestor === v) {
            throw new Error("Setting " + parent + " as parent of " + v + " would create a cycle");
          }
        }
        this.setNode(parent);
      }
      this.setNode(v);
      this._removeFromParentsChildList(v);
      this._parent[v] = parent;
      this._children[parent][v] = true;
      return this;
    }
    /**
     * Gets parent node for node v.
     * Complexity: O(1).
     *
     * @param v - node to get parent of.
     * @returns parent node name or void if v has no parent.
     */
    parent(v) {
      if (this._isCompound) {
        const parent = this._parent[v];
        if (parent !== GRAPH_NODE) {
          return parent;
        }
      }
    }
    /**
     * Gets list of direct children of node v.
     * Complexity: O(1).
     *
     * @param v - node to get children of.
     * @returns children nodes names list.
     */
    children(v = GRAPH_NODE) {
      if (this._isCompound) {
        const children = this._children[v];
        if (children) {
          return Object.keys(children);
        }
      } else if (v === GRAPH_NODE) {
        return this.nodes();
      } else if (this.hasNode(v)) {
        return [];
      }
      return [];
    }
    /**
     * Return all nodes that are predecessors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     *
     * @param v - node identifier.
     * @returns node identifiers list or undefined if v is not in the graph.
     */
    predecessors(v) {
      const predsV = this._preds[v];
      if (predsV) {
        return Object.keys(predsV);
      }
    }
    /**
     * Return all nodes that are successors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     *
     * @param v - node identifier.
     * @returns node identifiers list or undefined if v is not in the graph.
     */
    successors(v) {
      const sucsV = this._sucs[v];
      if (sucsV) {
        return Object.keys(sucsV);
      }
    }
    /**
     * Return all nodes that are predecessors or successors of the specified node or undefined if
     * node v is not in the graph.
     * Complexity: O(|V|).
     *
     * @param v - node identifier.
     * @returns node identifiers list or undefined if v is not in the graph.
     */
    neighbors(v) {
      const preds = this.predecessors(v);
      if (preds) {
        const union = new Set(preds);
        for (const succ of this.successors(v)) {
          union.add(succ);
        }
        return Array.from(union.values());
      }
    }
    isLeaf(v) {
      let neighbors;
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
     *
     * @param filter - filtration function detecting whether the node should stay or not.
     * @returns new graph made from current and nodes filtered.
     */
    filterNodes(filter) {
      const copy = new this.constructor({
        directed: this._isDirected,
        multigraph: this._isMultigraph,
        compound: this._isCompound
      });
      copy.setGraph(this.graph());
      Object.entries(this._nodes).forEach(([v, value]) => {
        if (filter(v)) {
          copy.setNode(v, value);
        }
      });
      Object.values(this._edgeObjs).forEach((e) => {
        if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
          copy.setEdge(e, this.edge(e));
        }
      });
      const parents = {};
      const findParent = (v) => {
        const parent = this.parent(v);
        if (!parent || copy.hasNode(parent)) {
          parents[v] = parent != null ? parent : void 0;
          return parent != null ? parent : void 0;
        } else if (parent in parents) {
          return parents[parent];
        } else {
          return findParent(parent);
        }
      };
      if (this._isCompound) {
        copy.nodes().forEach((v) => copy.setParent(v, findParent(v)));
      }
      return copy;
    }
    /**
     * Sets the default edge label. This label will be assigned as default label
     * in case if no label was specified while setting an edge.
     * Complexity: O(1).
     *
     * @param labelOrFn - default edge label or label factory function.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setDefaultEdgeLabel(labelOrFn) {
      if (typeof labelOrFn !== "function") {
        this._defaultEdgeLabelFn = () => labelOrFn;
      } else {
        this._defaultEdgeLabelFn = labelOrFn;
      }
      return this;
    }
    /**
     * Gets the number of edges in the graph.
     * Complexity: O(1).
     *
     * @returns edges count.
     */
    edgeCount() {
      return this._edgeCount;
    }
    /**
     * Gets edges of the graph. In case of compound graph subgraphs are not considered.
     * Complexity: O(|E|).
     *
     * @returns graph edges list.
     */
    edges() {
      return Object.values(this._edgeObjs);
    }
    /* === Edge functions ========== */
    /**
     * Establish an edges path over the nodes in nodes list. If some edge is already
     * exists, it will update its label, otherwise it will create an edge between pair
     * of nodes with label provided or default label if no label provided.
     * Complexity: O(|nodes|).
     *
     * @param nodes - list of nodes to be connected in series.
     * @param label - value to set for each edge between pairs of nodes.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setPath(nodes, label) {
      nodes.reduce((v, w) => {
        if (label !== void 0) {
          this.setEdge(v, w, label);
        } else {
          this.setEdge(v, w);
        }
        return w;
      });
      return this;
    }
    setEdge(v, w, value, name) {
      let vStr;
      let wStr;
      let nameStr;
      let edgeValue;
      let valueSpecified = false;
      if (typeof v === "object" && v !== null && "v" in v) {
        vStr = v.v;
        wStr = v.w;
        nameStr = v.name;
        if (arguments.length === 2) {
          edgeValue = w;
          valueSpecified = true;
        }
      } else {
        vStr = v;
        wStr = w;
        nameStr = name;
        if (arguments.length > 2) {
          edgeValue = value;
          valueSpecified = true;
        }
      }
      vStr = "" + vStr;
      wStr = "" + wStr;
      if (nameStr !== void 0) {
        nameStr = "" + nameStr;
      }
      const e = edgeArgsToId(this._isDirected, vStr, wStr, nameStr);
      if (e in this._edgeLabels) {
        if (valueSpecified) {
          this._edgeLabels[e] = edgeValue;
        }
        return this;
      }
      if (nameStr !== void 0 && !this._isMultigraph) {
        throw new Error("Cannot set a named edge when isMultigraph = false");
      }
      this.setNode(vStr);
      this.setNode(wStr);
      this._edgeLabels[e] = valueSpecified ? edgeValue : this._defaultEdgeLabelFn(vStr, wStr, nameStr);
      const edgeObj = edgeArgsToObj(this._isDirected, vStr, wStr, nameStr);
      vStr = edgeObj.v;
      wStr = edgeObj.w;
      Object.freeze(edgeObj);
      this._edgeObjs[e] = edgeObj;
      incrementOrInitEntry(this._preds[wStr], vStr);
      incrementOrInitEntry(this._sucs[vStr], wStr);
      this._in[wStr][e] = edgeObj;
      this._out[vStr][e] = edgeObj;
      this._edgeCount++;
      return this;
    }
    edge(v, w, name) {
      const e = arguments.length === 1 ? edgeObjToId(this._isDirected, v) : edgeArgsToId(this._isDirected, v, w, name);
      return this._edgeLabels[e];
    }
    edgeAsObj(v, w, name) {
      const edgeLabel = arguments.length === 1 ? this.edge(v) : this.edge(v, w, name);
      if (typeof edgeLabel !== "object") {
        return { label: edgeLabel };
      }
      return edgeLabel;
    }
    hasEdge(v, w, name) {
      const e = arguments.length === 1 ? edgeObjToId(this._isDirected, v) : edgeArgsToId(this._isDirected, v, w, name);
      return e in this._edgeLabels;
    }
    removeEdge(v, w, name) {
      const e = arguments.length === 1 ? edgeObjToId(this._isDirected, v) : edgeArgsToId(this._isDirected, v, w, name);
      const edge = this._edgeObjs[e];
      if (edge) {
        const vStr = edge.v;
        const wStr = edge.w;
        delete this._edgeLabels[e];
        delete this._edgeObjs[e];
        decrementOrRemoveEntry(this._preds[wStr], vStr);
        decrementOrRemoveEntry(this._sucs[vStr], wStr);
        delete this._in[wStr][e];
        delete this._out[vStr][e];
        this._edgeCount--;
      }
      return this;
    }
    /**
     * Return all edges that point to the node v. Optionally filters those edges down to just those
     * coming from node u. Behavior is void for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     *
     * @param v - edge sink node.
     * @param w - edge source node.
     * @returns edges descriptors list if v is in the graph, or void otherwise.
     */
    inEdges(v, w) {
      if (this.isDirected()) {
        return this.filterEdges(this._in[v], v, w);
      }
      return this.nodeEdges(v, w);
    }
    /**
     * Return all edges that are pointed at by node v. Optionally filters those edges down to just
     * those point to w. Behavior is void for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     *
     * @param v - edge source node.
     * @param w - edge sink node.
     * @returns edges descriptors list if v is in the graph, or void otherwise.
     */
    outEdges(v, w) {
      if (this.isDirected()) {
        return this.filterEdges(this._out[v], v, w);
      }
      return this.nodeEdges(v, w);
    }
    /**
     * Returns all edges to or from node v regardless of direction. Optionally filters those edges
     * down to just those between nodes v and w regardless of direction.
     * Complexity: O(|E|).
     *
     * @param v - edge adjacent node.
     * @param w - edge adjacent node.
     * @returns edges descriptors list if v is in the graph, or void otherwise.
     */
    nodeEdges(v, w) {
      if (v in this._nodes) {
        return this.filterEdges({ ...this._in[v], ...this._out[v] }, v, w);
      }
    }
    _removeFromParentsChildList(v) {
      delete this._children[this._parent[v]][v];
    }
    filterEdges(setV, localEdge, remoteEdge) {
      if (!setV) {
        return;
      }
      const edges = Object.values(setV);
      if (!remoteEdge) {
        return edges;
      }
      return edges.filter((edge) => {
        return edge.v === localEdge && edge.w === remoteEdge || edge.v === remoteEdge && edge.w === localEdge;
      });
    }
  };
  function incrementOrInitEntry(map, k) {
    if (map[k]) {
      map[k]++;
    } else {
      map[k] = 1;
    }
  }
  function decrementOrRemoveEntry(map, k) {
    if (map[k] !== void 0 && !--map[k]) {
      delete map[k];
    }
  }
  function edgeArgsToId(isDirected, v_, w_, name) {
    let v = "" + v_;
    let w = "" + w_;
    if (!isDirected && v > w) {
      const tmp = v;
      v = w;
      w = tmp;
    }
    return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM + (name === void 0 ? DEFAULT_EDGE_NAME : name);
  }
  function edgeArgsToObj(isDirected, v_, w_, name) {
    let v = "" + v_;
    let w = "" + w_;
    if (!isDirected && v > w) {
      const tmp = v;
      v = w;
      w = tmp;
    }
    const edgeObj = { v, w };
    if (name) {
      edgeObj.name = name;
    }
    return edgeObj;
  }
  function edgeObjToId(isDirected, edgeObj) {
    return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
  }

  // lib/version.ts
  var version = "4.0.0-pre";

  // lib/json.ts
  var json_exports = {};
  __export(json_exports, {
    read: () => read,
    write: () => write
  });
  function write(graph) {
    const json = {
      options: {
        directed: graph.isDirected(),
        multigraph: graph.isMultigraph(),
        compound: graph.isCompound()
      },
      nodes: writeNodes(graph),
      edges: writeEdges(graph)
    };
    const graphLabel = graph.graph();
    if (graphLabel !== void 0) {
      json.value = structuredClone(graphLabel);
    }
    return json;
  }
  function writeNodes(g) {
    return g.nodes().map((v) => {
      const nodeValue = g.node(v);
      const parent = g.parent(v);
      const node = { v };
      if (nodeValue !== void 0) {
        node.value = nodeValue;
      }
      if (parent !== void 0) {
        node.parent = parent;
      }
      return node;
    });
  }
  function writeEdges(g) {
    return g.edges().map((e) => {
      const edgeValue = g.edge(e);
      const edge = { v: e.v, w: e.w };
      if (e.name !== void 0) {
        edge.name = e.name;
      }
      if (edgeValue !== void 0) {
        edge.value = edgeValue;
      }
      return edge;
    });
  }
  function read(json) {
    const g = new Graph(json.options);
    if (json.value !== void 0) {
      g.setGraph(json.value);
    }
    json.nodes.forEach((entry) => {
      g.setNode(entry.v, entry.value);
      if (entry.parent) {
        g.setParent(entry.v, entry.parent);
      }
    });
    json.edges.forEach((entry) => {
      g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
    });
    return g;
  }

  // lib/alg/index.ts
  var alg_exports = {};
  __export(alg_exports, {
    CycleException: () => CycleException,
    bellmanFord: () => bellmanFord,
    components: () => components,
    dijkstra: () => dijkstra,
    dijkstraAll: () => dijkstraAll,
    findCycles: () => findCycles,
    floydWarshall: () => floydWarshall,
    isAcyclic: () => isAcyclic,
    postorder: () => postorder,
    preorder: () => preorder,
    prim: () => prim,
    shortestPaths: () => shortestPaths,
    tarjan: () => tarjan,
    topsort: () => topsort
  });

  // lib/alg/bellman-ford.ts
  var DEFAULT_WEIGHT_FUNC = () => 1;
  function bellmanFord(g, source, weightFn, edgeFn) {
    return runBellmanFord(
      g,
      String(source),
      weightFn || DEFAULT_WEIGHT_FUNC,
      edgeFn || function(v) {
        return g.outEdges(v);
      }
    );
  }
  function runBellmanFord(g, source, weightFn, edgeFn) {
    const results = {};
    let didADistanceUpgrade;
    let iterations = 0;
    const nodes = g.nodes();
    const relaxEdge = function(edge) {
      const edgeWeight = weightFn(edge);
      if (results[edge.v].distance + edgeWeight < results[edge.w].distance) {
        results[edge.w] = {
          distance: results[edge.v].distance + edgeWeight,
          predecessor: edge.v
        };
        didADistanceUpgrade = true;
      }
    };
    const relaxAllEdges = function() {
      nodes.forEach(function(vertex) {
        edgeFn(vertex).forEach(function(edge) {
          const inVertex = edge.v === vertex ? edge.v : edge.w;
          const outVertex = inVertex === edge.v ? edge.w : edge.v;
          relaxEdge({ v: inVertex, w: outVertex });
        });
      });
    };
    nodes.forEach(function(v) {
      const distance = v === source ? 0 : Number.POSITIVE_INFINITY;
      results[v] = { distance, predecessor: "" };
    });
    const numberOfNodes = nodes.length;
    for (let i = 1; i < numberOfNodes; i++) {
      didADistanceUpgrade = false;
      iterations++;
      relaxAllEdges();
      if (!didADistanceUpgrade) {
        break;
      }
    }
    if (iterations === numberOfNodes - 1) {
      didADistanceUpgrade = false;
      relaxAllEdges();
      if (didADistanceUpgrade) {
        throw new Error("The graph contains a negative weight cycle");
      }
    }
    return results;
  }

  // lib/alg/components.ts
  function components(graph) {
    const visited = {};
    const cmpts = [];
    let cmpt;
    function dfs2(v) {
      if (v in visited) return;
      visited[v] = true;
      cmpt.push(v);
      graph.successors(v).forEach(dfs2);
      graph.predecessors(v).forEach(dfs2);
    }
    graph.nodes().forEach(function(v) {
      cmpt = [];
      dfs2(v);
      if (cmpt.length) {
        cmpts.push(cmpt);
      }
    });
    return cmpts;
  }

  // lib/data/priority-queue.ts
  var PriorityQueue = class {
    constructor() {
      this._arr = [];
      this._keyIndices = {};
    }
    /**
     * Returns the number of elements in the queue. Takes `O(1)` time.
     */
    size() {
      return this._arr.length;
    }
    /**
     * Returns the keys that are in the queue. Takes `O(n)` time.
     */
    keys() {
      return this._arr.map((x) => x.key);
    }
    /**
     * Returns `true` if **key** is in the queue and `false` if not.
     */
    has(key) {
      return key in this._keyIndices;
    }
    /**
     * Returns the priority for **key**. If **key** is not present in the queue
     * then this function returns `undefined`. Takes `O(1)` time.
     */
    priority(key) {
      const index = this._keyIndices[key];
      if (index !== void 0) {
        return this._arr[index].priority;
      }
      return void 0;
    }
    /**
     * Returns the key for the minimum element in this queue. If the queue is
     * empty this function throws an Error. Takes `O(1)` time.
     */
    min() {
      if (this.size() === 0) {
        throw new Error("Queue underflow");
      }
      return this._arr[0].key;
    }
    /**
     * Inserts a new key into the priority queue. If the key already exists in
     * the queue this function returns `false`; otherwise it will return `true`.
     * Takes `O(n)` time.
     */
    add(key, priority) {
      const keyIndices = this._keyIndices;
      const keyStr = String(key);
      if (!(keyStr in keyIndices)) {
        const arr = this._arr;
        const index = arr.length;
        keyIndices[keyStr] = index;
        arr.push({ key: keyStr, priority });
        this._decrease(index);
        return true;
      }
      return false;
    }
    /**
     * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
     */
    removeMin() {
      this._swap(0, this._arr.length - 1);
      const min = this._arr.pop();
      delete this._keyIndices[min.key];
      this._heapify(0);
      return min.key;
    }
    /**
     * Decreases the priority for **key** to **priority**. If the new priority is
     * greater than the previous priority, this function will throw an Error.
     */
    decrease(key, priority) {
      const index = this._keyIndices[key];
      if (index === void 0) {
        throw new Error(`Key not found: ${key}`);
      }
      const currentPriority = this._arr[index].priority;
      if (priority > currentPriority) {
        throw new Error(
          `New priority is greater than current priority. Key: ${key} Old: ${currentPriority} New: ${priority}`
        );
      }
      this._arr[index].priority = priority;
      this._decrease(index);
    }
    _heapify(i) {
      const arr = this._arr;
      const l = 2 * i;
      const r = l + 1;
      let largest = i;
      if (l < arr.length) {
        largest = arr[l].priority < arr[largest].priority ? l : largest;
        if (r < arr.length) {
          largest = arr[r].priority < arr[largest].priority ? r : largest;
        }
        if (largest !== i) {
          this._swap(i, largest);
          this._heapify(largest);
        }
      }
    }
    _decrease(index) {
      const arr = this._arr;
      const priority = arr[index].priority;
      let parent;
      while (index !== 0) {
        parent = index >> 1;
        if (arr[parent].priority < priority) {
          break;
        }
        this._swap(index, parent);
        index = parent;
      }
    }
    _swap(i, j) {
      const arr = this._arr;
      const keyIndices = this._keyIndices;
      const origArrI = arr[i];
      const origArrJ = arr[j];
      arr[i] = origArrJ;
      arr[j] = origArrI;
      keyIndices[origArrJ.key] = i;
      keyIndices[origArrI.key] = j;
    }
  };

  // lib/alg/dijkstra.ts
  var DEFAULT_WEIGHT_FUNC2 = () => 1;
  function dijkstra(graph, source, weightFn, edgeFn) {
    const defaultEdgeFn = function(v) {
      return graph.outEdges(v);
    };
    return runDijkstra(
      graph,
      String(source),
      weightFn || DEFAULT_WEIGHT_FUNC2,
      edgeFn || defaultEdgeFn
    );
  }
  function runDijkstra(graph, source, weightFn, edgeFn) {
    const results = {};
    const pq = new PriorityQueue();
    let v, vEntry;
    const updateNeighbors = function(edge) {
      const w = edge.v !== v ? edge.v : edge.w;
      const wEntry = results[w];
      const weight = weightFn(edge);
      const distance = vEntry.distance + weight;
      if (weight < 0) {
        throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + edge + " Weight: " + weight);
      }
      if (distance < wEntry.distance) {
        wEntry.distance = distance;
        wEntry.predecessor = v;
        pq.decrease(w, distance);
      }
    };
    graph.nodes().forEach(function(v2) {
      const distance = v2 === source ? 0 : Number.POSITIVE_INFINITY;
      results[v2] = { distance, predecessor: "" };
      pq.add(v2, distance);
    });
    while (pq.size() > 0) {
      v = pq.removeMin();
      vEntry = results[v];
      if (vEntry.distance === Number.POSITIVE_INFINITY) {
        break;
      }
      edgeFn(v).forEach(updateNeighbors);
    }
    return results;
  }

  // lib/alg/dijkstra-all.ts
  function dijkstraAll(graph, weightFn, edgeFn) {
    return graph.nodes().reduce(function(acc, v) {
      acc[v] = dijkstra(graph, v, weightFn, edgeFn);
      return acc;
    }, {});
  }

  // lib/alg/tarjan.ts
  function tarjan(graph) {
    let index = 0;
    const stack = [];
    const visited = {};
    const results = [];
    function dfs2(v) {
      const entry = visited[v] = {
        onStack: true,
        lowlink: index,
        index: index++
      };
      stack.push(v);
      graph.successors(v).forEach(function(w) {
        if (!(w in visited)) {
          dfs2(w);
          entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink);
        } else if (visited[w].onStack) {
          entry.lowlink = Math.min(entry.lowlink, visited[w].index);
        }
      });
      if (entry.lowlink === entry.index) {
        const cmpt = [];
        let w;
        do {
          w = stack.pop();
          visited[w].onStack = false;
          cmpt.push(w);
        } while (v !== w);
        results.push(cmpt);
      }
    }
    graph.nodes().forEach(function(v) {
      if (!(v in visited)) {
        dfs2(v);
      }
    });
    return results;
  }

  // lib/alg/find-cycles.ts
  function findCycles(graph) {
    return tarjan(graph).filter(function(cmpt) {
      return cmpt.length > 1 || cmpt.length === 1 && graph.hasEdge(cmpt[0], cmpt[0]);
    });
  }

  // lib/alg/floyd-warshall.ts
  var DEFAULT_WEIGHT_FUNC3 = () => 1;
  function floydWarshall(graph, weightFn, edgeFn) {
    return runFloydWarshall(
      graph,
      weightFn || DEFAULT_WEIGHT_FUNC3,
      edgeFn || function(v) {
        return graph.outEdges(v);
      }
    );
  }
  function runFloydWarshall(graph, weightFn, edgeFn) {
    const results = {};
    const nodes = graph.nodes();
    nodes.forEach(function(v) {
      results[v] = {};
      results[v][v] = { distance: 0, predecessor: "" };
      nodes.forEach(function(w) {
        if (v !== w) {
          results[v][w] = { distance: Number.POSITIVE_INFINITY, predecessor: "" };
        }
      });
      edgeFn(v).forEach(function(edge) {
        const w = edge.v === v ? edge.w : edge.v;
        const d = weightFn(edge);
        results[v][w] = { distance: d, predecessor: v };
      });
    });
    nodes.forEach(function(k) {
      const rowK = results[k];
      nodes.forEach(function(i) {
        const rowI = results[i];
        nodes.forEach(function(j) {
          const ik = rowI[k];
          const kj = rowK[j];
          const ij = rowI[j];
          const altDistance = ik.distance + kj.distance;
          if (altDistance < ij.distance) {
            ij.distance = altDistance;
            ij.predecessor = kj.predecessor;
          }
        });
      });
    });
    return results;
  }

  // lib/alg/topsort.ts
  var CycleException = class extends Error {
    constructor(...args) {
      super(...args);
    }
  };
  function topsort(graph) {
    const visited = {};
    const stack = {};
    const results = [];
    function visit(node) {
      if (node in stack) {
        throw new CycleException();
      }
      if (!(node in visited)) {
        stack[node] = true;
        visited[node] = true;
        graph.predecessors(node).forEach(visit);
        delete stack[node];
        results.push(node);
      }
    }
    graph.sinks().forEach(visit);
    if (Object.keys(visited).length !== graph.nodeCount()) {
      throw new CycleException();
    }
    return results;
  }

  // lib/alg/is-acyclic.ts
  function isAcyclic(graph) {
    try {
      topsort(graph);
    } catch (e) {
      if (e instanceof CycleException) {
        return false;
      }
      throw e;
    }
    return true;
  }

  // lib/alg/reduce.ts
  function reduce(g, vs, order, fn, acc) {
    if (!Array.isArray(vs)) {
      vs = [vs];
    }
    const navigation = ((v) => {
      var _a;
      return (_a = g.isDirected() ? g.successors(v) : g.neighbors(v)) != null ? _a : [];
    });
    const visited = {};
    vs.forEach(function(v) {
      if (!g.hasNode(v)) {
        throw new Error("Graph does not have node: " + v);
      }
      acc = doReduce(g, v, order === "post", visited, navigation, fn, acc);
    });
    return acc;
  }
  function doReduce(g, v, postorder2, visited, navigation, fn, acc) {
    if (!(v in visited)) {
      visited[v] = true;
      if (!postorder2) {
        acc = fn(acc, v);
      }
      navigation(v).forEach(function(w) {
        acc = doReduce(g, w, postorder2, visited, navigation, fn, acc);
      });
      if (postorder2) {
        acc = fn(acc, v);
      }
    }
    return acc;
  }

  // lib/alg/dfs.ts
  function dfs(g, vs, order) {
    return reduce(g, vs, order, function(acc, v) {
      acc.push(v);
      return acc;
    }, []);
  }

  // lib/alg/postorder.ts
  function postorder(graph, vs) {
    return dfs(graph, vs, "post");
  }

  // lib/alg/preorder.ts
  function preorder(graph, vs) {
    return dfs(graph, vs, "pre");
  }

  // lib/alg/prim.ts
  function prim(graph, weightFn) {
    const result = new Graph();
    const parents = {};
    const pq = new PriorityQueue();
    let v;
    function updateNeighbors(edge) {
      const w = edge.v === v ? edge.w : edge.v;
      const pri = pq.priority(w);
      if (pri !== void 0) {
        const edgeWeight = weightFn(edge);
        if (edgeWeight < pri) {
          parents[w] = v;
          pq.decrease(w, edgeWeight);
        }
      }
    }
    if (graph.nodeCount() === 0) {
      return result;
    }
    graph.nodes().forEach(function(v2) {
      pq.add(v2, Number.POSITIVE_INFINITY);
      result.setNode(v2);
    });
    pq.decrease(graph.nodes()[0], 0);
    let init = false;
    while (pq.size() > 0) {
      v = pq.removeMin();
      if (v in parents) {
        result.setEdge(v, parents[v]);
      } else if (init) {
        throw new Error("Input graph is not connected: " + graph);
      } else {
        init = true;
      }
      graph.nodeEdges(v).forEach(updateNeighbors);
    }
    return result;
  }

  // lib/alg/shortest-paths.ts
  function shortestPaths(g, source, weightFn, edgeFn) {
    return runShortestPaths(
      g,
      source,
      weightFn,
      edgeFn != null ? edgeFn : ((v) => {
        const edges = g.outEdges(v);
        return edges != null ? edges : [];
      })
    );
  }
  function runShortestPaths(g, source, weightFn, edgeFn) {
    if (weightFn === void 0) {
      return dijkstra(g, source, weightFn, edgeFn);
    }
    let negativeEdgeExists = false;
    const nodes = g.nodes();
    for (let i = 0; i < nodes.length; i++) {
      const adjList = edgeFn(nodes[i]);
      for (let j = 0; j < adjList.length; j++) {
        const edge = adjList[j];
        const inVertex = edge.v === nodes[i] ? edge.v : edge.w;
        const outVertex = inVertex === edge.v ? edge.w : edge.v;
        if (weightFn({ v: inVertex, w: outVertex }) < 0) {
          negativeEdgeExists = true;
        }
      }
      if (negativeEdgeExists) {
        return bellmanFord(g, source, weightFn, edgeFn);
      }
    }
    return dijkstra(g, source, weightFn, edgeFn);
  }
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=graphlib.js.map
