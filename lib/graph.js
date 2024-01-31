"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
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
var _isDirected = /*#__PURE__*/new WeakMap();
var _isMultigraph = /*#__PURE__*/new WeakMap();
var _isCompound = /*#__PURE__*/new WeakMap();
var _label = /*#__PURE__*/new WeakMap();
var _defaultNodeLabelFn = /*#__PURE__*/new WeakMap();
var _defaultEdgeLabelFn = /*#__PURE__*/new WeakMap();
var _nodes = /*#__PURE__*/new WeakMap();
var _in = /*#__PURE__*/new WeakMap();
var _preds = /*#__PURE__*/new WeakMap();
var _out = /*#__PURE__*/new WeakMap();
var _sucs = /*#__PURE__*/new WeakMap();
var _edgeObjs = /*#__PURE__*/new WeakMap();
var _edgeLabels = /*#__PURE__*/new WeakMap();
var _nodeCount = /*#__PURE__*/new WeakMap();
var _edgeCount = /*#__PURE__*/new WeakMap();
var _parent = /*#__PURE__*/new WeakMap();
var _children = /*#__PURE__*/new WeakMap();
var _removeFromParentsChildList = /*#__PURE__*/new WeakSet();
var Graph = exports["default"] = /*#__PURE__*/function () {
  function Graph(opts) {
    _classCallCheck(this, Graph);
    _classPrivateMethodInitSpec(this, _removeFromParentsChildList);
    _classPrivateFieldInitSpec(this, _isDirected, {
      writable: true,
      value: true
    });
    _classPrivateFieldInitSpec(this, _isMultigraph, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(this, _isCompound, {
      writable: true,
      value: false
    });
    // Label for the graph itself
    _classPrivateFieldInitSpec(this, _label, {
      writable: true,
      value: void 0
    });
    // Defaults to be set when creating a new node
    _classPrivateFieldInitSpec(this, _defaultNodeLabelFn, {
      writable: true,
      value: function value() {
        return undefined;
      }
    });
    // Defaults to be set when creating a new edge
    _classPrivateFieldInitSpec(this, _defaultEdgeLabelFn, {
      writable: true,
      value: function value() {
        return undefined;
      }
    });
    // v -> label
    _classPrivateFieldInitSpec(this, _nodes, {
      writable: true,
      value: {}
    });
    // v -> edgeObj
    _classPrivateFieldInitSpec(this, _in, {
      writable: true,
      value: {}
    });
    // u -> v -> Number
    _classPrivateFieldInitSpec(this, _preds, {
      writable: true,
      value: {}
    });
    // v -> edgeObj
    _classPrivateFieldInitSpec(this, _out, {
      writable: true,
      value: {}
    });
    // v -> w -> Number
    _classPrivateFieldInitSpec(this, _sucs, {
      writable: true,
      value: {}
    });
    // e -> edgeObj
    _classPrivateFieldInitSpec(this, _edgeObjs, {
      writable: true,
      value: {}
    });
    // e -> label
    _classPrivateFieldInitSpec(this, _edgeLabels, {
      writable: true,
      value: {}
    });
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    _classPrivateFieldInitSpec(this, _nodeCount, {
      writable: true,
      value: 0
    });
    /* Number of edges in the graph. Should only be changed by the implementation. */
    _classPrivateFieldInitSpec(this, _edgeCount, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(this, _parent, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _children, {
      writable: true,
      value: void 0
    });
    if (opts) {
      _classPrivateFieldSet(this, _isDirected, opts.hasOwnProperty("directed") ? opts.directed : true);
      _classPrivateFieldSet(this, _isMultigraph, opts.hasOwnProperty("multigraph") ? opts.multigraph : false);
      _classPrivateFieldSet(this, _isCompound, opts.hasOwnProperty("compound") ? opts.compound : false);
    }
    if (_classPrivateFieldGet(this, _isCompound)) {
      // v -> parent
      _classPrivateFieldSet(this, _parent, {});

      // v -> children
      _classPrivateFieldSet(this, _children, {});
      _classPrivateFieldGet(this, _children)[GRAPH_NODE] = {};
    }
  }

  /* === Graph functions ========= */

  /**
   * Whether graph was created with 'directed' flag set to true or not.
   */
  _createClass(Graph, [{
    key: "isDirected",
    value: function isDirected() {
      return _classPrivateFieldGet(this, _isDirected);
    }

    /**
     * Whether graph was created with 'multigraph' flag set to true or not.
     */
  }, {
    key: "isMultigraph",
    value: function isMultigraph() {
      return _classPrivateFieldGet(this, _isMultigraph);
    }

    /**
     * Whether graph was created with 'compound' flag set to true or not.
     */
  }, {
    key: "isCompound",
    value: function isCompound() {
      return _classPrivateFieldGet(this, _isCompound);
    }

    /**
     * Sets the label of the graph.
     */
  }, {
    key: "setGraph",
    value: function setGraph(label) {
      _classPrivateFieldSet(this, _label, label);
      return this;
    }

    /**
     * Gets the graph label.
     */
  }, {
    key: "graph",
    value: function graph() {
      return _classPrivateFieldGet(this, _label);
    }

    /* === Node functions ========== */

    /**
     * Sets the default node label. If newDefault is a function, it will be
     * invoked ach time when setting a label for a node. Otherwise, this label
     * will be assigned as default label in case if no label was specified while
     * setting a node.
     * Complexity: O(1).
     */
  }, {
    key: "setDefaultNodeLabel",
    value: function setDefaultNodeLabel(newDefault) {
      _classPrivateFieldSet(this, _defaultNodeLabelFn, newDefault);
      if (typeof newDefault !== 'function') {
        _classPrivateFieldSet(this, _defaultNodeLabelFn, function () {
          return newDefault;
        });
      }
      return this;
    }

    /**
     * Gets the number of nodes in the graph.
     * Complexity: O(1).
     */
  }, {
    key: "nodeCount",
    value: function nodeCount() {
      return _classPrivateFieldGet(this, _nodeCount);
    }

    /**
     * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
     * not included in list.
     * Complexity: O(1).
     */
  }, {
    key: "nodes",
    value: function nodes() {
      return Object.keys(_classPrivateFieldGet(this, _nodes));
    }

    /**
     * Gets list of nodes without in-edges.
     * Complexity: O(|V|).
     */
  }, {
    key: "sources",
    value: function sources() {
      var self = this;
      return this.nodes().filter(function (v) {
        return Object.keys(_classPrivateFieldGet(self, _in)[v]).length === 0;
      });
    }

    /**
     * Gets list of nodes without out-edges.
     * Complexity: O(|V|).
     */
  }, {
    key: "sinks",
    value: function sinks() {
      var self = this;
      return this.nodes().filter(function (v) {
        return Object.keys(_classPrivateFieldGet(self, _out)[v]).length === 0;
      });
    }

    /**
     * Invokes setNode method for each node in names list.
     * Complexity: O(|names|).
     */
  }, {
    key: "setNodes",
    value: function setNodes(vs, value) {
      var args = arguments;
      var self = this;
      vs.forEach(function (v) {
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
  }, {
    key: "setNode",
    value: function setNode(v, value) {
      var _this$nodeCount;
      if (_classPrivateFieldGet(this, _nodes).hasOwnProperty(v)) {
        if (arguments.length > 1) {
          _classPrivateFieldGet(this, _nodes)[v] = value;
        }
        return this;
      }
      _classPrivateFieldGet(this, _nodes)[v] = arguments.length > 1 ? value : _classPrivateFieldGet(this, _defaultNodeLabelFn).call(this, v);
      if (_classPrivateFieldGet(this, _isCompound)) {
        _classPrivateFieldGet(this, _parent)[v] = GRAPH_NODE;
        _classPrivateFieldGet(this, _children)[v] = {};
        _classPrivateFieldGet(this, _children)[GRAPH_NODE][v] = true;
      }
      _classPrivateFieldGet(this, _in)[v] = {};
      _classPrivateFieldGet(this, _preds)[v] = {};
      _classPrivateFieldGet(this, _out)[v] = {};
      _classPrivateFieldGet(this, _sucs)[v] = {};
      _classPrivateFieldSet(this, _nodeCount, (_this$nodeCount = _classPrivateFieldGet(this, _nodeCount), ++_this$nodeCount));
      return this;
    }

    /**
     * Gets the label of node with specified name.
     * Complexity: O(|V|).
     */
  }, {
    key: "node",
    value: function node(v) {
      return _classPrivateFieldGet(this, _nodes)[v];
    }

    /**
     * Detects whether graph has a node with specified name or not.
     */
  }, {
    key: "hasNode",
    value: function hasNode(v) {
      return _classPrivateFieldGet(this, _nodes).hasOwnProperty(v);
    }

    /**
     * Remove the node with the name from the graph or do nothing if the node is not in
     * the graph. If the node was removed this function also removes any incident
     * edges.
     * Complexity: O(1).
     */
  }, {
    key: "removeNode",
    value: function removeNode(v) {
      var self = this;
      if (_classPrivateFieldGet(this, _nodes).hasOwnProperty(v)) {
        var _this$nodeCount2;
        var removeEdge = function removeEdge(e) {
          return self.removeEdge(_classPrivateFieldGet(self, _edgeObjs)[e]);
        };
        delete _classPrivateFieldGet(this, _nodes)[v];
        if (_classPrivateFieldGet(this, _isCompound)) {
          _classPrivateMethodGet(this, _removeFromParentsChildList, _removeFromParentsChildList2).call(this, v);
          delete _classPrivateFieldGet(this, _parent)[v];
          this.children(v).forEach(function (child) {
            self.setParent(child);
          });
          delete _classPrivateFieldGet(this, _children)[v];
        }
        Object.keys(_classPrivateFieldGet(this, _in)[v]).forEach(removeEdge);
        delete _classPrivateFieldGet(this, _in)[v];
        delete _classPrivateFieldGet(this, _preds)[v];
        Object.keys(_classPrivateFieldGet(this, _out)[v]).forEach(removeEdge);
        delete _classPrivateFieldGet(this, _out)[v];
        delete _classPrivateFieldGet(this, _sucs)[v];
        _classPrivateFieldSet(this, _nodeCount, (_this$nodeCount2 = _classPrivateFieldGet(this, _nodeCount), --_this$nodeCount2));
      }
      return this;
    }

    /**
     * Sets node p as a parent for node v if it is defined, or removes the
     * parent for v if p is undefined. Method throws an exception in case of
     * invoking it in context of noncompound graph.
     * Average-case complexity: O(1).
     */
  }, {
    key: "setParent",
    value: function setParent(v, parent) {
      if (!_classPrivateFieldGet(this, _isCompound)) {
        throw new Error("Cannot set parent in a non-compound graph");
      }
      if (parent === undefined) {
        parent = GRAPH_NODE;
      } else {
        // Coerce parent to string
        parent += "";
        for (var ancestor = parent; ancestor !== undefined; ancestor = this.parent(ancestor)) {
          if (ancestor === v) {
            throw new Error("Setting " + parent + " as parent of " + v + " would create a cycle");
          }
        }
        this.setNode(parent);
      }
      this.setNode(v);
      _classPrivateMethodGet(this, _removeFromParentsChildList, _removeFromParentsChildList2).call(this, v);
      _classPrivateFieldGet(this, _parent)[v] = parent;
      _classPrivateFieldGet(this, _children)[parent][v] = true;
      return this;
    }
  }, {
    key: "parent",
    value:
    /**
     * Gets parent node for node v.
     * Complexity: O(1).
     */
    function parent(v) {
      if (_classPrivateFieldGet(this, _isCompound)) {
        var parent = _classPrivateFieldGet(this, _parent)[v];
        if (parent !== GRAPH_NODE) {
          return parent;
        }
      }
    }

    /**
     * Gets list of direct children of node v.
     * Complexity: O(1).
     */
  }, {
    key: "children",
    value: function children() {
      var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : GRAPH_NODE;
      if (_classPrivateFieldGet(this, _isCompound)) {
        var children = _classPrivateFieldGet(this, _children)[v];
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
  }, {
    key: "predecessors",
    value: function predecessors(v) {
      var predsV = _classPrivateFieldGet(this, _preds)[v];
      if (predsV) {
        return Object.keys(predsV);
      }
    }

    /**
     * Return all nodes that are successors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     */
  }, {
    key: "successors",
    value: function successors(v) {
      var sucsV = _classPrivateFieldGet(this, _sucs)[v];
      if (sucsV) {
        return Object.keys(sucsV);
      }
    }

    /**
     * Return all nodes that are predecessors or successors of the specified node or undefined if
     * node v is not in the graph.
     * Complexity: O(|V|).
     */
  }, {
    key: "neighbors",
    value: function neighbors(v) {
      var preds = this.predecessors(v);
      if (preds) {
        var union = new Set(preds);
        var _iterator = _createForOfIteratorHelper(this.successors(v)),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var succ = _step.value;
            union.add(succ);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return Array.from(union.values());
      }
    }
  }, {
    key: "isLeaf",
    value: function isLeaf(v) {
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
  }, {
    key: "filterNodes",
    value: function filterNodes(filter) {
      var copy = new this.constructor({
        directed: _classPrivateFieldGet(this, _isDirected),
        multigraph: _classPrivateFieldGet(this, _isMultigraph),
        compound: _classPrivateFieldGet(this, _isCompound)
      });
      copy.setGraph(this.graph());
      var self = this;
      Object.entries(_classPrivateFieldGet(this, _nodes)).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          v = _ref2[0],
          value = _ref2[1];
        if (filter(v)) {
          copy.setNode(v, value);
        }
      });
      Object.values(_classPrivateFieldGet(this, _edgeObjs)).forEach(function (e) {
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
      if (_classPrivateFieldGet(this, _isCompound)) {
        copy.nodes().forEach(function (v) {
          return copy.setParent(v, findParent(v));
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
  }, {
    key: "setDefaultEdgeLabel",
    value: function setDefaultEdgeLabel(newDefault) {
      _classPrivateFieldSet(this, _defaultEdgeLabelFn, newDefault);
      if (typeof newDefault !== 'function') {
        _classPrivateFieldSet(this, _defaultEdgeLabelFn, function () {
          return newDefault;
        });
      }
      return this;
    }

    /**
     * Gets the number of edges in the graph.
     * Complexity: O(1).
     */
  }, {
    key: "edgeCount",
    value: function edgeCount() {
      return _classPrivateFieldGet(this, _edgeCount);
    }

    /**
     * Gets edges of the graph. In case of compound graph subgraphs are not considered.
     * Complexity: O(|E|).
     */
  }, {
    key: "edges",
    value: function edges() {
      return Object.values(_classPrivateFieldGet(this, _edgeObjs));
    }

    /**
     * Establish an edges path over the nodes in nodes list. If some edge is already
     * exists, it will update its label, otherwise it will create an edge between pair
     * of nodes with label provided or default label if no label provided.
     * Complexity: O(|nodes|).
     */
  }, {
    key: "setPath",
    value: function setPath(vs, value) {
      var self = this;
      var args = arguments;
      vs.reduce(function (v, w) {
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
  }, {
    key: "setEdge",
    value: function setEdge() {
      var _this$edgeCount, _this$edgeCount2;
      var v, w, name, value;
      var valueSpecified = false;
      var arg0 = arguments[0];
      if (_typeof(arg0) === "object" && arg0 !== null && "v" in arg0) {
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
      var e = edgeArgsToId(_classPrivateFieldGet(this, _isDirected), v, w, name);
      if (_classPrivateFieldGet(this, _edgeLabels).hasOwnProperty(e)) {
        if (valueSpecified) {
          _classPrivateFieldGet(this, _edgeLabels)[e] = value;
        }
        return this;
      }
      if (name !== undefined && !_classPrivateFieldGet(this, _isMultigraph)) {
        throw new Error("Cannot set a named edge when isMultigraph = false");
      }

      // It didn't exist, so we need to create it.
      // First ensure the nodes exist.
      this.setNode(v);
      this.setNode(w);
      _classPrivateFieldGet(this, _edgeLabels)[e] = valueSpecified ? value : _classPrivateFieldGet(this, _defaultEdgeLabelFn).call(this, v, w, name);
      var edgeObj = edgeArgsToObj(_classPrivateFieldGet(this, _isDirected), v, w, name);
      // Ensure we add undirected edges in a consistent way.
      v = edgeObj.v;
      w = edgeObj.w;
      Object.freeze(edgeObj);
      _classPrivateFieldGet(this, _edgeObjs)[e] = edgeObj;
      incrementOrInitEntry(_classPrivateFieldGet(this, _preds)[w], v);
      incrementOrInitEntry(_classPrivateFieldGet(this, _sucs)[v], w);
      _classPrivateFieldGet(this, _in)[w][e] = edgeObj;
      _classPrivateFieldGet(this, _out)[v][e] = edgeObj;
      _classPrivateFieldSet(this, _edgeCount, (_this$edgeCount = _classPrivateFieldGet(this, _edgeCount), _this$edgeCount2 = _this$edgeCount++, _this$edgeCount)), _this$edgeCount2;
      return this;
    }

    /**
     * Gets the label for the specified edge.
     * Complexity: O(1).
     */
  }, {
    key: "edge",
    value: function edge(v, w, name) {
      var e = arguments.length === 1 ? edgeObjToId(_classPrivateFieldGet(this, _isDirected), arguments[0]) : edgeArgsToId(_classPrivateFieldGet(this, _isDirected), v, w, name);
      return _classPrivateFieldGet(this, _edgeLabels)[e];
    }

    /**
     * Gets the label for the specified edge and converts it to an object.
     * Complexity: O(1)
     */
  }, {
    key: "edgeAsObj",
    value: function edgeAsObj() {
      var edge = this.edge.apply(this, arguments);
      if (_typeof(edge) !== "object") {
        return {
          label: edge
        };
      }
      return edge;
    }

    /**
     * Detects whether the graph contains specified edge or not. No subgraphs are considered.
     * Complexity: O(1).
     */
  }, {
    key: "hasEdge",
    value: function hasEdge(v, w, name) {
      var e = arguments.length === 1 ? edgeObjToId(_classPrivateFieldGet(this, _isDirected), arguments[0]) : edgeArgsToId(_classPrivateFieldGet(this, _isDirected), v, w, name);
      return _classPrivateFieldGet(this, _edgeLabels).hasOwnProperty(e);
    }

    /**
     * Removes the specified edge from the graph. No subgraphs are considered.
     * Complexity: O(1).
     */
  }, {
    key: "removeEdge",
    value: function removeEdge(v, w, name) {
      var e = arguments.length === 1 ? edgeObjToId(_classPrivateFieldGet(this, _isDirected), arguments[0]) : edgeArgsToId(_classPrivateFieldGet(this, _isDirected), v, w, name);
      var edge = _classPrivateFieldGet(this, _edgeObjs)[e];
      if (edge) {
        var _this$edgeCount3, _this$edgeCount4;
        v = edge.v;
        w = edge.w;
        delete _classPrivateFieldGet(this, _edgeLabels)[e];
        delete _classPrivateFieldGet(this, _edgeObjs)[e];
        decrementOrRemoveEntry(_classPrivateFieldGet(this, _preds)[w], v);
        decrementOrRemoveEntry(_classPrivateFieldGet(this, _sucs)[v], w);
        delete _classPrivateFieldGet(this, _in)[w][e];
        delete _classPrivateFieldGet(this, _out)[v][e];
        _classPrivateFieldSet(this, _edgeCount, (_this$edgeCount3 = _classPrivateFieldGet(this, _edgeCount), _this$edgeCount4 = _this$edgeCount3--, _this$edgeCount3)), _this$edgeCount4;
      }
      return this;
    }

    /**
     * Return all edges that point to the node v. Optionally filters those edges down to just those
     * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     */
  }, {
    key: "inEdges",
    value: function inEdges(v, u) {
      var inV = _classPrivateFieldGet(this, _in)[v];
      if (inV) {
        var edges = Object.values(inV);
        if (!u) {
          return edges;
        }
        return edges.filter(function (edge) {
          return edge.v === u;
        });
      }
    }

    /**
     * Return all edges that are pointed at by node v. Optionally filters those edges down to just
     * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     */
  }, {
    key: "outEdges",
    value: function outEdges(v, w) {
      var outV = _classPrivateFieldGet(this, _out)[v];
      if (outV) {
        var edges = Object.values(outV);
        if (!w) {
          return edges;
        }
        return edges.filter(function (edge) {
          return edge.w === w;
        });
      }
    }

    /**
     * Returns all edges to or from node v regardless of direction. Optionally filters those edges
     * down to just those between nodes v and w regardless of direction.
     * Complexity: O(|E|).
     */
  }, {
    key: "nodeEdges",
    value: function nodeEdges(v, w) {
      var inEdges = this.inEdges(v, w);
      if (inEdges) {
        return inEdges.concat(this.outEdges(v, w));
      }
    }
  }]);
  return Graph;
}();
function _removeFromParentsChildList2(v) {
  delete _classPrivateFieldGet(this, _children)[_classPrivateFieldGet(this, _parent)[v]][v];
}
function incrementOrInitEntry(map, k) {
  if (map[k]) {
    map[k]++;
  } else {
    map[k] = 1;
  }
}
function decrementOrRemoveEntry(map, k) {
  if (! --map[k]) {
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
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM + (name === undefined ? DEFAULT_EDGE_NAME : name);
}
function edgeArgsToObj(isDirected, v_, w_, name) {
  var v = "" + v_;
  var w = "" + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  var edgeObj = {
    v: v,
    w: w
  };
  if (name) {
    edgeObj.name = name;
  }
  return edgeObj;
}
function edgeObjToId(isDirected, edgeObj) {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}
