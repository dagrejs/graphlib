"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = postorder;
var _dfs = _interopRequireDefault(require("./dfs.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function postorder(g, vs) {
  return (0, _dfs["default"])(g, vs, "post");
}
