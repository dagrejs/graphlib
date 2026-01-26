var graphlib = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // lib/graph.js
  var require_graph = __commonJS({
    "lib/graph.js"(exports, module) {
      "use strict";
      var DEFAULT_EDGE_NAME = "\0";
      var GRAPH_NODE = "\0";
      var EDGE_KEY_DELIM = "";
      var Graph = class {
        constructor(opts) {
          __publicField(this, "_isDirected", true);
          __publicField(this, "_isMultigraph", false);
          __publicField(this, "_isCompound", false);
          // Label for the graph itself
          __publicField(this, "_label");
          // Defaults to be set when creating a new node
          __publicField(this, "_defaultNodeLabelFn", () => void 0);
          // Defaults to be set when creating a new edge
          __publicField(this, "_defaultEdgeLabelFn", () => void 0);
          // v -> label
          __publicField(this, "_nodes", {});
          // v -> edgeObj
          __publicField(this, "_in", {});
          // u -> v -> Number
          __publicField(this, "_preds", {});
          // v -> edgeObj
          __publicField(this, "_out", {});
          // v -> w -> Number
          __publicField(this, "_sucs", {});
          // e -> edgeObj
          __publicField(this, "_edgeObjs", {});
          // e -> label
          __publicField(this, "_edgeLabels", {});
          /* Number of nodes in the graph. Should only be changed by the implementation. */
          __publicField(this, "_nodeCount", 0);
          /* Number of edges in the graph. Should only be changed by the implementation. */
          __publicField(this, "_edgeCount", 0);
          __publicField(this, "_parent");
          __publicField(this, "_children");
          if (opts) {
            this._isDirected = Object.hasOwn(opts, "directed") ? opts.directed : true;
            this._isMultigraph = Object.hasOwn(opts, "multigraph") ? opts.multigraph : false;
            this._isCompound = Object.hasOwn(opts, "compound") ? opts.compound : false;
          }
          if (this._isCompound) {
            this._parent = {};
            this._children = {};
            this._children[GRAPH_NODE] = {};
          }
        }
        /* === Graph functions ========= */
        /**
         * Whether graph was created with 'directed' flag set to true or not.
         */
        isDirected() {
          return this._isDirected;
        }
        /**
         * Whether graph was created with 'multigraph' flag set to true or not.
         */
        isMultigraph() {
          return this._isMultigraph;
        }
        /**
         * Whether graph was created with 'compound' flag set to true or not.
         */
        isCompound() {
          return this._isCompound;
        }
        /**
         * Sets the label of the graph.
         */
        setGraph(label) {
          this._label = label;
          return this;
        }
        /**
         * Gets the graph label.
         */
        graph() {
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
        setDefaultNodeLabel(newDefault) {
          this._defaultNodeLabelFn = newDefault;
          if (typeof newDefault !== "function") {
            this._defaultNodeLabelFn = () => newDefault;
          }
          return this;
        }
        /**
         * Gets the number of nodes in the graph.
         * Complexity: O(1).
         */
        nodeCount() {
          return this._nodeCount;
        }
        /**
         * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
         * not included in list.
         * Complexity: O(1).
         */
        nodes() {
          return Object.keys(this._nodes);
        }
        /**
         * Gets list of nodes without in-edges.
         * Complexity: O(|V|).
         */
        sources() {
          var self = this;
          return this.nodes().filter((v) => Object.keys(self._in[v]).length === 0);
        }
        /**
         * Gets list of nodes without out-edges.
         * Complexity: O(|V|).
         */
        sinks() {
          var self = this;
          return this.nodes().filter((v) => Object.keys(self._out[v]).length === 0);
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
          if (Object.hasOwn(this._nodes, v)) {
            if (arguments.length > 1) {
              this._nodes[v] = value;
            }
            return this;
          }
          this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
          if (this._isCompound) {
            this._parent[v] = GRAPH_NODE;
            this._children[v] = {};
            this._children[GRAPH_NODE][v] = true;
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
        node(v) {
          return this._nodes[v];
        }
        /**
         * Detects whether graph has a node with specified name or not.
         */
        hasNode(v) {
          return Object.hasOwn(this._nodes, v);
        }
        /**
         * Remove the node with the name from the graph or do nothing if the node is not in
         * the graph. If the node was removed this function also removes any incident
         * edges.
         * Complexity: O(1).
         */
        removeNode(v) {
          var self = this;
          if (Object.hasOwn(this._nodes, v)) {
            var removeEdge = (e) => self.removeEdge(self._edgeObjs[e]);
            delete this._nodes[v];
            if (this._isCompound) {
              this._removeFromParentsChildList(v);
              delete this._parent[v];
              this.children(v).forEach(function(child) {
                self.setParent(child);
              });
              delete this._children[v];
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
        setParent(v, parent) {
          if (!this._isCompound) {
            throw new Error("Cannot set parent in a non-compound graph");
          }
          if (parent === void 0) {
            parent = GRAPH_NODE;
          } else {
            parent += "";
            for (var ancestor = parent; ancestor !== void 0; ancestor = this.parent(ancestor)) {
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
        _removeFromParentsChildList(v) {
          delete this._children[this._parent[v]][v];
        }
        /**
         * Gets parent node for node v.
         * Complexity: O(1).
         */
        parent(v) {
          if (this._isCompound) {
            var parent = this._parent[v];
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
          if (this._isCompound) {
            var children = this._children[v];
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
        successors(v) {
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
            var parent = self.parent(v);
            if (parent === void 0 || copy.hasNode(parent)) {
              parents[v] = parent;
              return parent;
            } else if (parent in parents) {
              return parents[parent];
            } else {
              return findParent(parent);
            }
          }
          if (this._isCompound) {
            copy.nodes().forEach((v) => copy.setParent(v, findParent(v)));
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
          this._defaultEdgeLabelFn = newDefault;
          if (typeof newDefault !== "function") {
            this._defaultEdgeLabelFn = () => newDefault;
          }
          return this;
        }
        /**
         * Gets the number of edges in the graph.
         * Complexity: O(1).
         */
        edgeCount() {
          return this._edgeCount;
        }
        /**
         * Gets edges of the graph. In case of compound graph subgraphs are not considered.
         * Complexity: O(|E|).
         */
        edges() {
          return Object.values(this._edgeObjs);
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
          if (name !== void 0) {
            name = "" + name;
          }
          var e = edgeArgsToId(this._isDirected, v, w, name);
          if (Object.hasOwn(this._edgeLabels, e)) {
            if (valueSpecified) {
              this._edgeLabels[e] = value;
            }
            return this;
          }
          if (name !== void 0 && !this._isMultigraph) {
            throw new Error("Cannot set a named edge when isMultigraph = false");
          }
          this.setNode(v);
          this.setNode(w);
          this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name);
          var edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
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
        edge(v, w, name) {
          var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
          return this._edgeLabels[e];
        }
        /**
         * Gets the label for the specified edge and converts it to an object.
         * Complexity: O(1)
         */
        edgeAsObj() {
          const edge = this.edge(...arguments);
          if (typeof edge !== "object") {
            return { label: edge };
          }
          return edge;
        }
        /**
         * Detects whether the graph contains specified edge or not. No subgraphs are considered.
         * Complexity: O(1).
         */
        hasEdge(v, w, name) {
          var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
          return Object.hasOwn(this._edgeLabels, e);
        }
        /**
         * Removes the specified edge from the graph. No subgraphs are considered.
         * Complexity: O(1).
         */
        removeEdge(v, w, name) {
          var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
          var edge = this._edgeObjs[e];
          if (edge) {
            v = edge.v;
            w = edge.w;
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
        inEdges(v, u) {
          var inV = this._in[v];
          if (inV) {
            var edges = Object.values(inV);
            if (!u) {
              return edges;
            }
            return edges.filter((edge) => edge.v === u);
          }
        }
        /**
         * Return all edges that are pointed at by node v. Optionally filters those edges down to just
         * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
        outEdges(v, w) {
          var outV = this._out[v];
          if (outV) {
            var edges = Object.values(outV);
            if (!w) {
              return edges;
            }
            return edges.filter((edge) => edge.w === w);
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
      };
      function incrementOrInitEntry(map, k) {
        if (map[k]) {
          map[k]++;
        } else {
          map[k] = 1;
        }
      }
      function decrementOrRemoveEntry(map, k) {
        if (!--map[k]) {
          delete map[k];
        }
      }
      function edgeArgsToId(isDirected, v_, w_, name) {
        var v = "" + v_;
        var w = "" + w_;
        if (!isDirected && v > w) {
          var tmp = v;
          v = w;
          w = tmp;
        }
        return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM + (name === void 0 ? DEFAULT_EDGE_NAME : name);
      }
      function edgeArgsToObj(isDirected, v_, w_, name) {
        var v = "" + v_;
        var w = "" + w_;
        if (!isDirected && v > w) {
          var tmp = v;
          v = w;
          w = tmp;
        }
        var edgeObj = { v, w };
        if (name) {
          edgeObj.name = name;
        }
        return edgeObj;
      }
      function edgeObjToId(isDirected, edgeObj) {
        return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
      }
      module.exports = Graph;
    }
  });

  // lib/version.js
  var require_version = __commonJS({
    "lib/version.js"(exports, module) {
      module.exports = "2.2.5-pre";
    }
  });

  // lib/index.js
  var require_lib = __commonJS({
    "lib/index.js"(exports, module) {
      module.exports = {
        Graph: require_graph(),
        version: require_version()
      };
    }
  });

  // lib/json.js
  var require_json = __commonJS({
    "lib/json.js"(exports, module) {
      var Graph = require_graph();
      module.exports = {
        write,
        read
      };
      function write(g) {
        var json = {
          options: {
            directed: g.isDirected(),
            multigraph: g.isMultigraph(),
            compound: g.isCompound()
          },
          nodes: writeNodes(g),
          edges: writeEdges(g)
        };
        if (g.graph() !== void 0) {
          json.value = structuredClone(g.graph());
        }
        return json;
      }
      function writeNodes(g) {
        return g.nodes().map(function(v) {
          var nodeValue = g.node(v);
          var parent = g.parent(v);
          var node = { v };
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
        return g.edges().map(function(e) {
          var edgeValue = g.edge(e);
          var edge = { v: e.v, w: e.w };
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
        var g = new Graph(json.options).setGraph(json.value);
        json.nodes.forEach(function(entry) {
          g.setNode(entry.v, entry.value);
          if (entry.parent) {
            g.setParent(entry.v, entry.parent);
          }
        });
        json.edges.forEach(function(entry) {
          g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
        });
        return g;
      }
    }
  });

  // lib/alg/components.js
  var require_components = __commonJS({
    "lib/alg/components.js"(exports, module) {
      module.exports = components;
      function components(g) {
        var visited = {};
        var cmpts = [];
        var cmpt;
        function dfs(v) {
          if (Object.hasOwn(visited, v)) return;
          visited[v] = true;
          cmpt.push(v);
          g.successors(v).forEach(dfs);
          g.predecessors(v).forEach(dfs);
        }
        g.nodes().forEach(function(v) {
          cmpt = [];
          dfs(v);
          if (cmpt.length) {
            cmpts.push(cmpt);
          }
        });
        return cmpts;
      }
    }
  });

  // lib/data/priority-queue.js
  var require_priority_queue = __commonJS({
    "lib/data/priority-queue.js"(exports, module) {
      var PriorityQueue = class {
        constructor() {
          __publicField(this, "_arr", []);
          __publicField(this, "_keyIndices", {});
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
          return this._arr.map(function(x) {
            return x.key;
          });
        }
        /**
         * Returns `true` if **key** is in the queue and `false` if not.
         */
        has(key) {
          return Object.hasOwn(this._keyIndices, key);
        }
        /**
         * Returns the priority for **key**. If **key** is not present in the queue
         * then this function returns `undefined`. Takes `O(1)` time.
         *
         * @param {Object} key
         */
        priority(key) {
          var index = this._keyIndices[key];
          if (index !== void 0) {
            return this._arr[index].priority;
          }
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
         *
         * @param {Object} key the key to add
         * @param {Number} priority the initial priority for the key
         */
        add(key, priority) {
          var keyIndices = this._keyIndices;
          key = String(key);
          if (!Object.hasOwn(keyIndices, key)) {
            var arr = this._arr;
            var index = arr.length;
            keyIndices[key] = index;
            arr.push({ key, priority });
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
          var min = this._arr.pop();
          delete this._keyIndices[min.key];
          this._heapify(0);
          return min.key;
        }
        /**
         * Decreases the priority for **key** to **priority**. If the new priority is
         * greater than the previous priority, this function will throw an Error.
         *
         * @param {Object} key the key for which to raise priority
         * @param {Number} priority the new priority for the key
         */
        decrease(key, priority) {
          var index = this._keyIndices[key];
          if (priority > this._arr[index].priority) {
            throw new Error("New priority is greater than current priority. Key: " + key + " Old: " + this._arr[index].priority + " New: " + priority);
          }
          this._arr[index].priority = priority;
          this._decrease(index);
        }
        _heapify(i) {
          var arr = this._arr;
          var l = 2 * i;
          var r = l + 1;
          var largest = i;
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
          var arr = this._arr;
          var priority = arr[index].priority;
          var parent;
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
          var arr = this._arr;
          var keyIndices = this._keyIndices;
          var origArrI = arr[i];
          var origArrJ = arr[j];
          arr[i] = origArrJ;
          arr[j] = origArrI;
          keyIndices[origArrJ.key] = i;
          keyIndices[origArrI.key] = j;
        }
      };
      module.exports = PriorityQueue;
    }
  });

  // lib/alg/dijkstra.js
  var require_dijkstra = __commonJS({
    "lib/alg/dijkstra.js"(exports, module) {
      var PriorityQueue = require_priority_queue();
      module.exports = dijkstra;
      var DEFAULT_WEIGHT_FUNC = () => 1;
      function dijkstra(g, source, weightFn, edgeFn) {
        return runDijkstra(
          g,
          String(source),
          weightFn || DEFAULT_WEIGHT_FUNC,
          edgeFn || function(v) {
            return g.outEdges(v);
          }
        );
      }
      function runDijkstra(g, source, weightFn, edgeFn) {
        var results = {};
        var pq = new PriorityQueue();
        var v, vEntry;
        var updateNeighbors = function(edge) {
          var w = edge.v !== v ? edge.v : edge.w;
          var wEntry = results[w];
          var weight = weightFn(edge);
          var distance = vEntry.distance + weight;
          if (weight < 0) {
            throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + edge + " Weight: " + weight);
          }
          if (distance < wEntry.distance) {
            wEntry.distance = distance;
            wEntry.predecessor = v;
            pq.decrease(w, distance);
          }
        };
        g.nodes().forEach(function(v2) {
          var distance = v2 === source ? 0 : Number.POSITIVE_INFINITY;
          results[v2] = { distance };
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
    }
  });

  // lib/alg/dijkstra-all.js
  var require_dijkstra_all = __commonJS({
    "lib/alg/dijkstra-all.js"(exports, module) {
      var dijkstra = require_dijkstra();
      module.exports = dijkstraAll;
      function dijkstraAll(g, weightFunc, edgeFunc) {
        return g.nodes().reduce(function(acc, v) {
          acc[v] = dijkstra(g, v, weightFunc, edgeFunc);
          return acc;
        }, {});
      }
    }
  });

  // lib/alg/tarjan.js
  var require_tarjan = __commonJS({
    "lib/alg/tarjan.js"(exports, module) {
      module.exports = tarjan;
      function tarjan(g) {
        var index = 0;
        var stack = [];
        var visited = {};
        var results = [];
        function dfs(v) {
          var entry = visited[v] = {
            onStack: true,
            lowlink: index,
            index: index++
          };
          stack.push(v);
          g.successors(v).forEach(function(w2) {
            if (!Object.hasOwn(visited, w2)) {
              dfs(w2);
              entry.lowlink = Math.min(entry.lowlink, visited[w2].lowlink);
            } else if (visited[w2].onStack) {
              entry.lowlink = Math.min(entry.lowlink, visited[w2].index);
            }
          });
          if (entry.lowlink === entry.index) {
            var cmpt = [];
            var w;
            do {
              w = stack.pop();
              visited[w].onStack = false;
              cmpt.push(w);
            } while (v !== w);
            results.push(cmpt);
          }
        }
        g.nodes().forEach(function(v) {
          if (!Object.hasOwn(visited, v)) {
            dfs(v);
          }
        });
        return results;
      }
    }
  });

  // lib/alg/find-cycles.js
  var require_find_cycles = __commonJS({
    "lib/alg/find-cycles.js"(exports, module) {
      var tarjan = require_tarjan();
      module.exports = findCycles;
      function findCycles(g) {
        return tarjan(g).filter(function(cmpt) {
          return cmpt.length > 1 || cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]);
        });
      }
    }
  });

  // lib/alg/floyd-warshall.js
  var require_floyd_warshall = __commonJS({
    "lib/alg/floyd-warshall.js"(exports, module) {
      module.exports = floydWarshall;
      var DEFAULT_WEIGHT_FUNC = () => 1;
      function floydWarshall(g, weightFn, edgeFn) {
        return runFloydWarshall(
          g,
          weightFn || DEFAULT_WEIGHT_FUNC,
          edgeFn || function(v) {
            return g.outEdges(v);
          }
        );
      }
      function runFloydWarshall(g, weightFn, edgeFn) {
        var results = {};
        var nodes = g.nodes();
        nodes.forEach(function(v) {
          results[v] = {};
          results[v][v] = { distance: 0 };
          nodes.forEach(function(w) {
            if (v !== w) {
              results[v][w] = { distance: Number.POSITIVE_INFINITY };
            }
          });
          edgeFn(v).forEach(function(edge) {
            var w = edge.v === v ? edge.w : edge.v;
            var d = weightFn(edge);
            results[v][w] = { distance: d, predecessor: v };
          });
        });
        nodes.forEach(function(k) {
          var rowK = results[k];
          nodes.forEach(function(i) {
            var rowI = results[i];
            nodes.forEach(function(j) {
              var ik = rowI[k];
              var kj = rowK[j];
              var ij = rowI[j];
              var altDistance = ik.distance + kj.distance;
              if (altDistance < ij.distance) {
                ij.distance = altDistance;
                ij.predecessor = kj.predecessor;
              }
            });
          });
        });
        return results;
      }
    }
  });

  // lib/alg/topsort.js
  var require_topsort = __commonJS({
    "lib/alg/topsort.js"(exports, module) {
      function topsort(g) {
        var visited = {};
        var stack = {};
        var results = [];
        function visit(node) {
          if (Object.hasOwn(stack, node)) {
            throw new CycleException();
          }
          if (!Object.hasOwn(visited, node)) {
            stack[node] = true;
            visited[node] = true;
            g.predecessors(node).forEach(visit);
            delete stack[node];
            results.push(node);
          }
        }
        g.sinks().forEach(visit);
        if (Object.keys(visited).length !== g.nodeCount()) {
          throw new CycleException();
        }
        return results;
      }
      var CycleException = class extends Error {
        constructor() {
          super(...arguments);
        }
      };
      module.exports = topsort;
      topsort.CycleException = CycleException;
    }
  });

  // lib/alg/is-acyclic.js
  var require_is_acyclic = __commonJS({
    "lib/alg/is-acyclic.js"(exports, module) {
      var topsort = require_topsort();
      module.exports = isAcyclic;
      function isAcyclic(g) {
        try {
          topsort(g);
        } catch (e) {
          if (e instanceof topsort.CycleException) {
            return false;
          }
          throw e;
        }
        return true;
      }
    }
  });

  // lib/alg/dfs.js
  var require_dfs = __commonJS({
    "lib/alg/dfs.js"(exports, module) {
      module.exports = dfs;
      function dfs(g, vs, order) {
        if (!Array.isArray(vs)) {
          vs = [vs];
        }
        var navigation = g.isDirected() ? (v) => g.successors(v) : (v) => g.neighbors(v);
        var orderFunc = order === "post" ? postOrderDfs : preOrderDfs;
        var acc = [];
        var visited = {};
        vs.forEach((v) => {
          if (!g.hasNode(v)) {
            throw new Error("Graph does not have node: " + v);
          }
          orderFunc(v, navigation, visited, acc);
        });
        return acc;
      }
      function postOrderDfs(v, navigation, visited, acc) {
        var stack = [[v, false]];
        while (stack.length > 0) {
          var curr = stack.pop();
          if (curr[1]) {
            acc.push(curr[0]);
          } else {
            if (!Object.hasOwn(visited, curr[0])) {
              visited[curr[0]] = true;
              stack.push([curr[0], true]);
              forEachRight(navigation(curr[0]), (w) => stack.push([w, false]));
            }
          }
        }
      }
      function preOrderDfs(v, navigation, visited, acc) {
        var stack = [v];
        while (stack.length > 0) {
          var curr = stack.pop();
          if (!Object.hasOwn(visited, curr)) {
            visited[curr] = true;
            acc.push(curr);
            forEachRight(navigation(curr), (w) => stack.push(w));
          }
        }
      }
      function forEachRight(array, iteratee) {
        var length = array.length;
        while (length--) {
          iteratee(array[length], length, array);
        }
        return array;
      }
    }
  });

  // lib/alg/postorder.js
  var require_postorder = __commonJS({
    "lib/alg/postorder.js"(exports, module) {
      var dfs = require_dfs();
      module.exports = postorder;
      function postorder(g, vs) {
        return dfs(g, vs, "post");
      }
    }
  });

  // lib/alg/preorder.js
  var require_preorder = __commonJS({
    "lib/alg/preorder.js"(exports, module) {
      var dfs = require_dfs();
      module.exports = preorder;
      function preorder(g, vs) {
        return dfs(g, vs, "pre");
      }
    }
  });

  // lib/alg/prim.js
  var require_prim = __commonJS({
    "lib/alg/prim.js"(exports, module) {
      var Graph = require_graph();
      var PriorityQueue = require_priority_queue();
      module.exports = prim;
      function prim(g, weightFunc) {
        var result = new Graph();
        var parents = {};
        var pq = new PriorityQueue();
        var v;
        function updateNeighbors(edge) {
          var w = edge.v === v ? edge.w : edge.v;
          var pri = pq.priority(w);
          if (pri !== void 0) {
            var edgeWeight = weightFunc(edge);
            if (edgeWeight < pri) {
              parents[w] = v;
              pq.decrease(w, edgeWeight);
            }
          }
        }
        if (g.nodeCount() === 0) {
          return result;
        }
        g.nodes().forEach(function(v2) {
          pq.add(v2, Number.POSITIVE_INFINITY);
          result.setNode(v2);
        });
        pq.decrease(g.nodes()[0], 0);
        var init = false;
        while (pq.size() > 0) {
          v = pq.removeMin();
          if (Object.hasOwn(parents, v)) {
            result.setEdge(v, parents[v]);
          } else if (init) {
            throw new Error("Input graph is not connected: " + g);
          } else {
            init = true;
          }
          g.nodeEdges(v).forEach(updateNeighbors);
        }
        return result;
      }
    }
  });

  // lib/alg/index.js
  var require_alg = __commonJS({
    "lib/alg/index.js"(exports, module) {
      module.exports = {
        components: require_components(),
        dijkstra: require_dijkstra(),
        dijkstraAll: require_dijkstra_all(),
        findCycles: require_find_cycles(),
        floydWarshall: require_floyd_warshall(),
        isAcyclic: require_is_acyclic(),
        postorder: require_postorder(),
        preorder: require_preorder(),
        prim: require_prim(),
        tarjan: require_tarjan(),
        topsort: require_topsort()
      };
    }
  });

  // index.js
  var require_index = __commonJS({
    "index.js"(exports, module) {
      var lib = require_lib();
      module.exports = {
        Graph: lib.Graph,
        json: require_json(),
        alg: require_alg(),
        version: lib.version
      };
    }
  });
  return require_index();
})();
//# sourceMappingURL=graphlib.js.map
