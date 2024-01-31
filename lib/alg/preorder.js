"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = preorder;
var _dfs = _interopRequireDefault(require("./dfs.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function preorder(g, vs) {
  return (0, _dfs["default"])(g, vs, "pre");
}
