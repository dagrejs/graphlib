"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = findCycles;
var _tarjan = _interopRequireDefault(require("./tarjan.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function findCycles(g) {
  return (0, _tarjan["default"])(g).filter(function (cmpt) {
    return cmpt.length > 1 || cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]);
  });
}
