"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isAcyclic;
var _topsort = _interopRequireDefault(require("./topsort.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function isAcyclic(g) {
  try {
    (0, _topsort["default"])(g);
  } catch (e) {
    if (e instanceof _topsort["default"].CycleException) {
      return false;
    }
    throw e;
  }
  return true;
}
