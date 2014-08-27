var dfs = require("./dfs");

module.exports = preorder;

function preorder(g, vs, fn, successors) {
  return dfs(g, vs, "post", fn, successors);
}
