var dfs = require("./dfs");

module.exports = postorder;

function postorder(g, vs, fn, successors) {
  return dfs(g, vs, "post", fn, successors);
}
