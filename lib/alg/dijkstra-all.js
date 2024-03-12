"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dijkstraAll;
var _dijkstra = _interopRequireDefault(require("./dijkstra.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function dijkstraAll(g, weightFunc, edgeFunc) {
  return g.nodes().reduce(function (acc, v) {
    acc[v] = (0, _dijkstra.default)(g, v, weightFunc, edgeFunc);
    return acc;
  }, {});
}
module.exports = exports.default;
