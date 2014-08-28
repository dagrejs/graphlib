// Includes only the "core" of graphlib
module.exports = {
  Digraph: require("./digraph"),
  CDigraph: require("./compound-digraph"),

  Graph: require("./graph"),
  CGraph: require("./compound-graph"),

  util: require("./util"),
  version: require("./version")
};
