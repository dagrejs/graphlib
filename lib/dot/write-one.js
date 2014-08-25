var _ = require("lodash");

module.exports = writeOne;

var UNESCAPED_ID_PATTERN = /^[a-zA-Z\200-\377_][a-zA-Z\200-\377_0-9]*$/;

function writeOne(g, options) {
  var ec = g.isDirected() ? "->" : "--",
      writer = new Writer();

  options = options || {};

  if (options.strict) {
    writer.write("strict ");
  }

  writer.writeLine((g.isDirected() ? "digraph" : "graph") + " {");
  writer.indent();

  var graphAttrs = g.getGraph();
  if (_.isObject(graphAttrs)) {
    _.each(graphAttrs, function(v, k) {
      writer.writeLine(id(k) + "=" + id(v) + ";");
    });
  }

  writeSubgraph(g, undefined, writer);

  g.edges().forEach(function(edge) {
    writeEdge(edge, ec, writer);
  });

  writer.unindent();
  writer.writeLine("}");

  return writer.toString();
}

function writeSubgraph(g, v, writer) {
  var children = g.getChildren ? g.getChildren(v) : g.nodeIds();
  _.each(children, function(w) {
    if (!g.getChildren || !g.getChildren(w).length) {
      writeNode(g, w, writer);
    } else {
      writer.writeLine("subgraph " + id(w) + " {");
      writer.indent();

      _.map(g.getNode(w), function(val, key) {
        writer.writeLine(id(key) + "=" + id(val) + ";");
      });

      writeSubgraph(g, w, writer);
      writer.unindent();
      writer.writeLine("}");
    }
  });
}

function writeNode(g, v, writer) {
  writer.write(id(v));
  writeAttrs(g.getNode(v), writer);
  writer.writeLine();
}

function writeEdge(edge, ec, writer) {
  var edges = edge.label,
      v = edge.v,
      w = edge.w;

  if (_.isPlainObject(edges)) {
    edges = [edges];
  } else if (!_.isArray(edges)) {
    edges = [{}];
  }

  _.each(edges, function(attrs) {
    writer.write(id(v) + " " + ec + " " + id(w));
    writeAttrs(attrs, writer);
    writer.writeLine();
  });
}

function writeAttrs(attrs, writer) {
  if (_.isObject(attrs)) {
    var attrStrs = _.map(attrs, function(val, key) {
      return id(key) + "=" + id(val);
    });
    if (attrStrs.length) {
      writer.write(" [" + attrStrs.join(",") + "]");
    }
  }
}

function id(obj) {
  if (typeof obj === "number" || obj.toString().match(UNESCAPED_ID_PATTERN)) {
    return obj;
  }

  return "\"" + obj.toString().replace(/"/g, "\\\"") + "\"";
}

// Helper object for making a pretty printer
function Writer() {
  this._indent = "";
  this._content = "";
  this._shouldIndent = true;
}

Writer.prototype.INDENT = "  ";

Writer.prototype.indent = function() {
  this._indent += this.INDENT;
};

Writer.prototype.unindent = function() {
  this._indent = this._indent.slice(this.INDENT.length);
};

Writer.prototype.writeLine = function(line) {
  this.write((line || "") + "\n");
  this._shouldIndent = true;
};

Writer.prototype.write = function(str) {
  if (this._shouldIndent) {
    this._shouldIndent = false;
    this._content += this._indent;
  }
  this._content += str;
};

Writer.prototype.toString = function() {
  return this._content;
};

