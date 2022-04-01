var dfs = require("../../compiled/lib/alg/dfs.js").dfs;

module.exports = postorder;

function postorder(g, vs) {
  return dfs(g, vs, "post");
}
