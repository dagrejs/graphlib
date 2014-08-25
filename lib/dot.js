var _ = require("lodash"),
    dotGrammar = require("./dot-grammar"),
    CGraph = require("./compound-graph"),
    CDigraph = require("./compound-digraph");

exports.readMany = readMany;
exports.read = readOne;

function readMany(str) {
  var parseTree = dotGrammar.parse(str);
  return _.map(parseTree, buildGraph);
}

function readOne(str) {
  var parseTree = dotGrammar.parse(str, { startRule: "graphStmt" });
  return buildGraph(parseTree);
}

function buildGraph(parseTree) {
  var g = parseTree.type === "graph" ? new CGraph() : new CDigraph(),
      defaultStack = [{ node: {}, edge: {} }],
      strict = parseTree.strict;
  g.setGraph({});
  _.each(parseTree.stmts, function(stmt) { handleStmt(g, strict, stmt, defaultStack); });
  return g;
}

function handleStmt(g, strict, stmt, defaultStack, sg) {
  switch(stmt.type) {
    case "node": handleNodeStmt(g, strict, stmt, defaultStack, sg); break;
    case "edge": handleEdgeStmt(g, strict, stmt, defaultStack, sg); break;
    case "subgraph": handleSubgraphStmt(g, strict, stmt, defaultStack, sg); break;
    case "attr": handleAttrStmt(g, strict, stmt, defaultStack); break;
    case "inlineAttr": handleInlineAttrsStmt(g, strict, stmt, defaultStack, sg); break;
  }
}

function handleNodeStmt(g, strict, stmt, defaultStack, sg) {
  var v = stmt.id,
      attrs = stmt.attrs;

  maybeCreateNode(g, v, defaultStack, sg);

  _.merge(g.getNode(v), attrs);
}

function handleEdgeStmt(g, strict, stmt, defaultStack, sg) {
  var attrs = stmt.attrs,
      prev, curr;
  _.each(stmt.elems, function(elem) {
    handleStmt(g, strict, elem, defaultStack, sg);

    switch(elem.type) {
      case "node": curr = [elem.id]; break;
      case "subgraph": curr = collectNodeIds(elem); break;
    }

    _.each(prev, function(v) {
      _.each(curr, function(w) {
        g.updateEdge(v, w, function(label) {
          if (strict) {
            if (!label) {
              label = _.clone(_.last(defaultStack).edge);
            }
            return _.merge(label, attrs);
          } else {
            if (!label) {
              label = [];
            }
            label.push(_.merge(_.clone(_.last(defaultStack).edge), attrs));
            return label;
          }
        });
      });
    });

    prev = curr;
  });
}

function handleSubgraphStmt(g, strict, stmt, defaultStack, sg) {
  var id = stmt.id;
  if (id === undefined) {
    id = generateSubgraphId(g);
  }

  defaultStack.push(_.clone(_.last(defaultStack)));

  maybeCreateNode(g, id, defaultStack, sg);

  _.each(stmt.stmts, function(s) {
    handleStmt(g, strict, s, defaultStack, id);
  });

  // If there are no statements remove the subgraph
  if (!g.getChildren(id).length) {
    g.removeNode(id);
  }

  defaultStack.pop();
}

function handleAttrStmt(g, strict, stmt, defaultStack) {
  _.merge(_.last(defaultStack)[stmt.attrType], stmt.attrs);
}

function handleInlineAttrsStmt(g, strict, stmt, defaultStack, sg) {
  _.merge(sg ? g.getNode(sg) : g.getGraph(), stmt.attrs);
}

function generateSubgraphId(g) {
  var id;
  do {
    id = _.uniqueId("sg");
  } while (g.hasNode(id));
  return id;
}

function maybeCreateNode(g, v, defaultStack, sg) {
  if (!g.hasNode(v)) {
    g.setNode(v, _.clone(_.last(defaultStack).node));
    g.setParent(v, sg);
  }
}

// Collect all nodes involved in a subgraph statement
function collectNodeIds(stmt) {
  var ids = {},
      stack = [],
      curr;

  var push = stack.push.bind(stack);

  push(stmt);
  while(stack.length) {
    curr = stack.pop();
    switch(curr.type) {
      case "node": ids[curr.id] = true; break;
      case "edge": _.each(curr.elems, push); break;
      case "subgraph": _.each(curr.stmts, push); break;
    }
  }

  return _.keys(ids);
}
