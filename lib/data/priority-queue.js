"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
var _arr = /*#__PURE__*/new WeakMap();
var _keyIndices = /*#__PURE__*/new WeakMap();
var _heapify = /*#__PURE__*/new WeakSet();
var _decrease = /*#__PURE__*/new WeakSet();
var _swap = /*#__PURE__*/new WeakSet();
/**
 * A min-priority queue data structure. This algorithm is derived from Cormen,
 * et al., "Introduction to Algorithms". The basic idea of a min-priority
 * queue is that you can efficiently (in O(1) time) get the smallest key in
 * the queue. Adding and removing elements takes O(log n) time. A key can
 * have its priority decreased in O(log n) time.
 */
var PriorityQueue = exports["default"] = /*#__PURE__*/function () {
  function PriorityQueue() {
    _classCallCheck(this, PriorityQueue);
    _classPrivateMethodInitSpec(this, _swap);
    _classPrivateMethodInitSpec(this, _decrease);
    _classPrivateMethodInitSpec(this, _heapify);
    _classPrivateFieldInitSpec(this, _arr, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _keyIndices, {
      writable: true,
      value: {}
    });
  }
  _createClass(PriorityQueue, [{
    key: "size",
    value:
    /**
     * Returns the number of elements in the queue. Takes `O(1)` time.
     */
    function size() {
      return _classPrivateFieldGet(this, _arr).length;
    }

    /**
     * Returns the keys that are in the queue. Takes `O(n)` time.
     */
  }, {
    key: "keys",
    value: function keys() {
      return _classPrivateFieldGet(this, _arr).map(function (x) {
        return x.key;
      });
    }

    /**
     * Returns `true` if **key** is in the queue and `false` if not.
     */
  }, {
    key: "has",
    value: function has(key) {
      return _classPrivateFieldGet(this, _keyIndices).hasOwnProperty(key);
    }

    /**
     * Returns the priority for **key**. If **key** is not present in the queue
     * then this function returns `undefined`. Takes `O(1)` time.
     *
     * @param {Object} key
     */
  }, {
    key: "priority",
    value: function priority(key) {
      var index = _classPrivateFieldGet(this, _keyIndices)[key];
      if (index !== undefined) {
        return _classPrivateFieldGet(this, _arr)[index].priority;
      }
    }

    /**
     * Returns the key for the minimum element in this queue. If the queue is
     * empty this function throws an Error. Takes `O(1)` time.
     */
  }, {
    key: "min",
    value: function min() {
      if (this.size() === 0) {
        throw new Error("Queue underflow");
      }
      return _classPrivateFieldGet(this, _arr)[0].key;
    }

    /**
     * Inserts a new key into the priority queue. If the key already exists in
     * the queue this function returns `false`; otherwise it will return `true`.
     * Takes `O(n)` time.
     *
     * @param {Object} key the key to add
     * @param {Number} priority the initial priority for the key
     */
  }, {
    key: "add",
    value: function add(key, priority) {
      var keyIndices = _classPrivateFieldGet(this, _keyIndices);
      key = String(key);
      if (!keyIndices.hasOwnProperty(key)) {
        var arr = _classPrivateFieldGet(this, _arr);
        var index = arr.length;
        keyIndices[key] = index;
        arr.push({
          key: key,
          priority: priority
        });
        _classPrivateMethodGet(this, _decrease, _decrease2).call(this, index);
        return true;
      }
      return false;
    }

    /**
     * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
     */
  }, {
    key: "removeMin",
    value: function removeMin() {
      _classPrivateMethodGet(this, _swap, _swap2).call(this, 0, _classPrivateFieldGet(this, _arr).length - 1);
      var min = _classPrivateFieldGet(this, _arr).pop();
      delete _classPrivateFieldGet(this, _keyIndices)[min.key];
      _classPrivateMethodGet(this, _heapify, _heapify2).call(this, 0);
      return min.key;
    }

    /**
     * Decreases the priority for **key** to **priority**. If the new priority is
     * greater than the previous priority, this function will throw an Error.
     *
     * @param {Object} key the key for which to raise priority
     * @param {Number} priority the new priority for the key
     */
  }, {
    key: "decrease",
    value: function decrease(key, priority) {
      var index = _classPrivateFieldGet(this, _keyIndices)[key];
      if (priority > _classPrivateFieldGet(this, _arr)[index].priority) {
        throw new Error("New priority is greater than current priority. " + "Key: " + key + " Old: " + _classPrivateFieldGet(this, _arr)[index].priority + " New: " + priority);
      }
      _classPrivateFieldGet(this, _arr)[index].priority = priority;
      _classPrivateMethodGet(this, _decrease, _decrease2).call(this, index);
    }
  }]);
  return PriorityQueue;
}();
function _heapify2(i) {
  var arr = _classPrivateFieldGet(this, _arr);
  var l = 2 * i;
  var r = l + 1;
  var largest = i;
  if (l < arr.length) {
    largest = arr[l].priority < arr[largest].priority ? l : largest;
    if (r < arr.length) {
      largest = arr[r].priority < arr[largest].priority ? r : largest;
    }
    if (largest !== i) {
      _classPrivateMethodGet(this, _swap, _swap2).call(this, i, largest);
      _classPrivateMethodGet(this, _heapify, _heapify2).call(this, largest);
    }
  }
}
function _decrease2(index) {
  var arr = _classPrivateFieldGet(this, _arr);
  var priority = arr[index].priority;
  var parent;
  while (index !== 0) {
    parent = index >> 1;
    if (arr[parent].priority < priority) {
      break;
    }
    _classPrivateMethodGet(this, _swap, _swap2).call(this, index, parent);
    index = parent;
  }
}
function _swap2(i, j) {
  var arr = _classPrivateFieldGet(this, _arr);
  var keyIndices = _classPrivateFieldGet(this, _keyIndices);
  var origArrI = arr[i];
  var origArrJ = arr[j];
  arr[i] = origArrJ;
  arr[j] = origArrI;
  keyIndices[origArrJ.key] = i;
  keyIndices[origArrI.key] = j;
}
