var dfs = require("../../compiled/lib/alg/dfs.js").dfs;

module.exports = preorder;

function preorder(g, vs) {
  return dfs(g, vs, "pre");
}
