var dfs = require("./dfs");

module.exports = preorder;

function preorder(g, v, fn, successors) {
  return dfs(g, v, "post", fn, successors);
}
