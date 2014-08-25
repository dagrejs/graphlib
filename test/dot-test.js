var _ = require("lodash"),
    expect = require("./chai").expect,
    dot = require("..").dot,
    Digraph = require("..").Digraph,
    CDigraph = require("..").CDigraph,
    Graph = require("..").Graph;

describe("dot", function() {
  describe("read", function() {
    describe("graph", function() {
      it("can read an empty digraph", function() {
        var g = dot.read("digraph {}");
        expect(g.nodeCount()).to.equal(0);
        expect(g.edgeCount()).to.equal(0);
        expect(g.getGraph()).to.eql({});
        expect(g.isDirected()).to.be.true;
      });

      it("can read an empty graph", function() {
        var g = dot.read("graph {}");
        expect(g.nodeCount()).to.equal(0);
        expect(g.edgeCount()).to.equal(0);
        expect(g.getGraph()).to.eql({});
        expect(g.isDirected()).to.be.false;
      });

      it("can handle leading and trailing whitespace", function() {
        var g = dot.read(" digraph {} ");
        expect(g.nodeCount()).to.equal(0);
        expect(g.edgeCount()).to.equal(0);
        expect(g.getGraph()).to.eql({});
        expect(g.isDirected()).to.be.true;
      });

      it("safely ignores the id for the graph", function() {
        var g = dot.read("digraph foobar {}");
        expect(g.nodeCount()).to.equal(0);
        expect(g.edgeCount()).to.equal(0);
        expect(g.getGraph()).to.eql({});
        expect(g.isDirected()).to.be.true;
      });

      it("can read graph attributes", function() {
        var g = dot.read("digraph { foo = bar; }");
        expect(g.getGraph()).to.eql({ foo: "bar" });
      });

      it("can handle various forms of whitespace", function() {
        var g = dot.read("digraph {\tfoo\r=bar\n; }");
        expect(g.getGraph()).to.eql({ foo: "bar" });
      });
    });

    describe("comments", function() {
      it("ignores single-line comments", function() {
        var g = dot.read("digraph { a //comment\n }");
        expect(g.hasNode("a")).to.be.true;
      });

      it("ignores multi-line comments", function() {
        var g = dot.read("digraph { a /*comment*/\n }");
        expect(g.hasNode("a")).to.be.true;
      });
    });

    describe("nodes", function() {
      it("can read a single node graph", function() {
        var g = dot.read("digraph { a }");
        expect(g.nodeCount()).to.equal(1);
        expect(g.hasNode("a")).to.be.true;
        expect(g.edgeCount()).to.equal(0);
      });

      it("can read a node with an attribute", function() {
        var g = dot.read("digraph { a [label=foo]; }");
        expect(g.getNode("a")).to.eql({ label: "foo" });
      });

      it("can read a node with a quoted attribute", function() {
        var g = dot.read("digraph { a [label=\"foo and bar\"]; }");
        expect(g.getNode("a")).to.eql({ label: "foo and bar" });
      });

      it("can read a node with comma-separated attributes", function() {
        var g = dot.read("digraph { a [label=l, foo=f, bar=b]; }");
        expect(g.getNode("a")).to.eql({ label: "l", foo: "f", bar: "b" });
      });

      it("can read a node with space-separated attributes", function() {
        var g = dot.read("digraph { a [label=l foo=f bar=b]; }");
        expect(g.getNode("a")).to.eql({ label: "l", foo: "f", bar: "b" });
      });

      it("can read a node with multiple attr defs", function() {
        var g = dot.read("digraph { a [label=l] [foo=1] [foo=2]; }");
        expect(g.getNode("a")).to.eql({ label: "l", foo: "2" });
      });

      it("can read nodes with numeric ids", function() {
        var list = ["12", "-12", "12.34", "-12.34", ".34", "-.34", "12.", "-12."];
        var g = dot.read("digraph { " + list.join(";") + " }");
        expect(_.sortBy(g.nodeIds())).to.eql(_.sortBy(list));
      });

      it("can read escaped quotes", function() {
        expect(dot.read("digraph { \"\\\"a\\\"\" }").nodeIds()).to.eql(["\"a\""]);
      });

      it("preserves non-quote escapes", function() {
        expect(dot.read("digraph { \"foo\\-bar\" }").nodeIds()).to.eql(["foo\\-bar"]);
      });

      it("can read quoted unicode", function() {
        var g = dot.read("digraph { \"♖♘♗♕♔♗♘♖\" }");
        expect(g.nodeIds()).to.eql(["♖♘♗♕♔♗♘♖"]);
      });

      it("fails to read unquoted unicode", function() {
        expect(function() { dot.read("digraph { ♖♘♗♕♔♗♘♖ }"); }).to.throw();
      });

      it("treats a number id followed by a letter as two nodes", function() {
        // Yes this is what the language specifies!
        var g = dot.read("digraph { 123a }");
        expect(_.sortBy(g.nodeIds())).to.eql(["123", "a"]);
      });

      it("ignores node ports", function() {
        var g = dot.read("digraph { a:port }");
        expect(g.getNode("a")).to.eql({});
      });

      var compass = ["n", "ne", "e", "se", "s", "sw", "w", "nw", "c", "_"];
      it("ignores node compass", function() {
        _.each(compass, function(c) {
          expect(dot.read("digraph { a:" + c + " }").getNode("a")).to.eql({});
          expect(dot.read("digraph { a : " + c + " }").getNode("a")).to.eql({});
        });
      });

      it("ignores node port compass", function() {
        _.each(compass, function(c) {
          expect(dot.read("digraph { a:port:" + c + " }").getNode("a")).to.eql({});
          expect(dot.read("digraph { a : port : " + c + " }").getNode("a")).to.eql({});
        });
      });
    });

    describe("edges", function() {
      it("can read an unlabelled undirected edge", function() {
        var g = dot.read("strict graph { a -- b }");
        expect(g.edgeCount()).to.equal(1);
        expect(g.getEdge("a", "b")).to.eql({});
      });

      it("fails if reading an undirected edge in a directed graph", function() {
        expect(function() { dot.read("graph { a -> b }"); }).to.throw();
      });

      it("can read an unlabelled directed edge", function() {
        var g = dot.read("strict digraph { a -> b }");
        expect(g.edgeCount()).to.equal(1);
        expect(g.getEdge("a", "b")).to.eql({});
      });

      it("fails if reading a directed edge in an undirected graph", function() {
        expect(function() { dot.read("digraph { a -- b }"); }).to.throw();
      });

      it("can read an edge with attributes", function() {
        var g = dot.read("strict digraph { a -> b [label=foo]; }");
        expect(g.getEdge("a", "b")).to.eql({ label: "foo" });
      });

      it("can assign attributes to a path of nodes", function() {
        var g = dot.read("strict digraph { a -> b -> c [label=foo]; }");
        expect(g.getEdge("a", "b")).to.eql({ label: "foo" });
        expect(g.getEdge("b", "c")).to.eql({ label: "foo" });
        expect(g.edgeCount()).to.equal(2);
      });

      it("assigns multiple labels if an edge is defined multiple times", function() {
        var g = dot.read("digraph { a -> b [x=1 z=3]; a -> b [y=2 z=4] }");
        expect(_.sortBy(g.getEdge("a", "b"), "z")).to.eql([
          { x: "1", z: "3" },
          { y: "2", z: "4" }
        ]);
        expect(g.edgeCount()).to.equal(1);
      });

      it("updates an edge if it is defined multiple times in strict mode", function() {
        var g = dot.read("strict digraph { a -> b [x=1 z=3]; a -> b [y=2 z=4] }");
        expect(g.getEdge("a", "b")).to.eql({ x: "1", y: "2", z: "4" });
        expect(g.edgeCount()).to.equal(1);
      });
    });

    describe("subgraphs", function() {
      it("ignores empty subgraphs", function() {
        expect(dot.read("digraph { subgraph X {} }").nodeIds()).to.be.empty;
        expect(dot.read("digraph { subgraph {} }").nodeIds()).to.be.empty;
        expect(dot.read("digraph { {} }").nodeIds()).to.be.empty;
      });

      it("reads nodes in a subgraph", function() {
        var g = dot.read("digraph { subgraph X { a; b }; c }");
        expect(_.sortBy(g.nodeIds())).to.eql(["X", "a", "b", "c"]);
        expect(_.sortBy(g.getChildren())).to.eql(["X", "c"]);
        expect(_.sortBy(g.getChildren("X"))).to.eql(["a", "b"]);
      });

      it("assigns a node to the first subgraph in which it appears", function() {
        var g = dot.read("digraph { subgraph X { a }; subgraph Y { a; b } }");
        expect(g.getParent("a")).to.equal("X");
        expect(g.getParent("b")).to.equal("Y");
      });

      it("reads edges in a subgraph", function() {
        var g = dot.read("strict digraph { subgraph X { a; b; a -> b } }");
        expect(_.sortBy(g.nodeIds())).to.eql(["X", "a", "b"]);
        expect(_.sortBy(g.getChildren("X"))).to.eql(["a", "b"]);
        expect(g.getEdge("a", "b")).to.eql({});
        expect(g.edgeCount()).to.equal(1);
      });

      it("assigns graph attributes to the subgraph in which they appear", function() {
        var g = dot.read("strict digraph { subgraph X { foo=bar; a } }");
        expect(g.getGraph()).to.eql({});
        expect(g.getNode("X")).to.eql({ foo: "bar" });
      });

      it("reads anonymous subgraphs #1", function() {
        var g = dot.read("digraph { subgraph { a } }");
        expect(g.getParent("a")).to.not.be.undefined;
        expect(g.getParent(g.getParent("a"))).to.be.undefined;
      });

      it("reads anonymous subgraphs #2", function() {
        var g = dot.read("digraph { { a } }");
        expect(g.getParent("a")).to.not.be.undefined;
        expect(g.getParent(g.getParent("a"))).to.be.undefined;
      });

      it("reads subgraphs as the LHS of an edge statement", function() {
        var g = dot.read("digraph { {a; b} -> c }");
        expect(g.hasEdge("a", "c")).to.be.true;
        expect(g.hasEdge("b", "c")).to.be.true;
        expect(g.edgeCount()).to.equal(2);
      });

      it("reads subgraphs as the RHS of an edge statement", function() {
        var g = dot.read("digraph { a -> { b; c } }");
        expect(g.hasEdge("a", "b")).to.be.true;
        expect(g.hasEdge("a", "c")).to.be.true;
        expect(g.edgeCount()).to.equal(2);
      });

      it("handles subgraphs with edges as an LHS of another edge statment", function() {
        var g = dot.read("digraph { {a -> b} -> c }");
        expect(g.hasEdge("a", "b")).to.be.true;
        expect(g.hasEdge("a", "c")).to.be.true;
        expect(g.hasEdge("b", "c")).to.be.true;
        expect(g.edgeCount()).to.equal(3);
      });

      it("reads subgraphs as both the LHS and RHS side of an edge statement", function() {
        var g = dot.read("digraph { { a; b } -> { c; d } }");
        expect(g.hasEdge("a", "c")).to.be.true;
        expect(g.hasEdge("a", "d")).to.be.true;
        expect(g.hasEdge("b", "c")).to.be.true;
        expect(g.hasEdge("b", "d")).to.be.true;
        expect(g.edgeCount()).to.equal(4);
      });

      it("applies edges attributes when using subgraphs as LHS or RHS", function() {
        var g = dot.read("strict digraph { { a; b } -> { c; d } [foo=bar] }");
        expect(g.getEdge("a", "c")).to.eql({ foo: "bar" });
        expect(g.getEdge("a", "d")).to.eql({ foo: "bar" });
        expect(g.getEdge("b", "c")).to.eql({ foo: "bar" });
        expect(g.getEdge("b", "d")).to.eql({ foo: "bar" });
        expect(g.edgeCount()).to.equal(4);
      });
    });

    describe("defaults", function() {
      it("adds default attributes to nodes", function() {
        var g = dot.read("digraph { node [color=black]; a [label=foo]; b [label=bar] }");
        expect(g.getNode("a")).to.eql({ color: "black", label: "foo" });
        expect(g.getNode("b")).to.eql({ color: "black", label: "bar" });
      });

      it("can apply multiple node defaults", function() {
        var g = dot.read("digraph { node[color=black]; node[shape=box]; a [label=foo] }");
        expect(g.getNode("a")).to.eql({ color: "black", shape: "box", label: "foo" });
      });

      it("only applies defaults already visited", function() {
        var g = dot.read("digraph { node[color=black]; a; node[shape=box]; b; }");
        expect(g.getNode("a")).to.eql({ color: "black" });
        expect(g.getNode("b")).to.eql({ color: "black", shape: "box" });
      });

      it("only applies defaults to nodes created in the subgraph", function() {
        var g = dot.read("digraph { a; { node[color=black]; a; b; } }");
        expect(g.getNode("a")).to.eql({});
        expect(g.getNode("b")).to.eql({ color: "black" });
      });

      it("allows defaults to redefined", function() {
        var g = dot.read("digraph { node[color=black]; a; node[color=green]; b; }");
        expect(g.getNode("a")).to.eql({ color: "black" });
        expect(g.getNode("b")).to.eql({ color: "green" });
      });

      it("applies defaults to nodes created through an edge statement", function() {
        var g = dot.read("digraph { node[color=black]; a -> b; }");
        expect(g.getNode("a")).to.eql({ color: "black" });
        expect(g.getNode("b")).to.eql({ color: "black" });
      });

      it("applies defaults to subgraphs", function() {
        var g = dot.read("digraph { node[color=black]; { a; { b; c[color=green]; } } }");
        expect(g.getNode("a")).to.eql({ color: "black" });
        expect(g.getNode("b")).to.eql({ color: "black" });
        expect(g.getNode("c")).to.eql({ color: "green" });
      });

      it("applies defaults to edges", function() {
        var g = dot.read("strict digraph { edge[color=black]; a -> b }");
        expect(g.getNode("a")).to.eql({});
        expect(g.getNode("b")).to.eql({});
        expect(g.getEdge("a", "b")).to.eql({ color: "black" });
      });
    });

    describe("failure cases", function() {
      it("fails if the graph block is not closed", function() {
        expect(function() { dot.read("digraph {"); }).to.throw();
      });

      it("fails if an attribute block is not closed", function() {
        expect(function() { dot.read("digraph { a [k=v}"); }).to.throw();
      });

      it("fails if an attribute is missing a key", function() {
        expect(function() { dot.read("digraph { a [=v] }"); }).to.throw();
      });

      it("fails if an attribute is missing a value", function() {
        expect(function() { dot.read("digraph { a [k=] }"); }).to.throw();
      });

      it("fails if an edge is missing an LHS", function() {
        expect(function() { dot.read("digraph { -> b }"); }).to.throw();
      });

      it("fails if an edge is missing an RHS", function() {
        expect(function() { dot.read("digraph { a -> }"); }).to.throw();
      });

      it("fails if a subgraph is left unclosed", function() {
        expect(function() { dot.read("digraph { { a "); }).to.throw();
      });

      it("fails if a new subgraph is opened after a previous one", function() {
        expect(function() { dot.read("digraph {} digraph {}"); }).to.throw();
      });
    });
  });

  describe("readMany", function() {
    it("can read multiple graphs", function() {
      var gs = dot.readMany("digraph {} graph {}");
      expect(gs).to.have.length(2);
      expect(gs[0].isDirected()).to.be.true;
      expect(gs[1].isDirected()).to.be.false;
    });
  });

  describe("write", function() {
    it("can write an empty digraph", function() {
      var str = dot.write(new Digraph());
      var g = dot.read(str);
      expect(g.nodeCount()).to.equal(0);
      expect(g.edgeCount()).to.equal(0);
      expect(g.getGraph()).to.eql({});
      expect(g.isDirected()).to.be.true;
    });

    it("can write an empty graph", function() {
      var str = dot.write(new Graph());
      var g = dot.read(str);
      expect(g.nodeCount()).to.equal(0);
      expect(g.edgeCount()).to.equal(0);
      expect(g.getGraph()).to.eql({});
      expect(g.isDirected()).to.be.false;
    });

    it("can write a graph label with an object", function() {
      var g = new Digraph();
      g.setGraph({ foo: "bar" });
      var str = dot.write(g);
      var g2 = dot.read(str);
      expect(g2.getGraph()).to.eql({ foo: "bar" });
    });

    it("can write a node", function() {
      var g = new Digraph();
      g.setNode("n1");
      var str = dot.write(g);
      var g2 = dot.read(str);
      expect(g2.hasNode("n1")).to.be.true;
      expect(g2.getNode("n1")).to.eql({});
      expect(g2.nodeCount()).to.equal(1);
      expect(g2.edgeCount()).to.equal(0);
    });

    it("can write a node with attributes", function() {
      var g = new Digraph();
      g.setNode("n1", { foo: "bar" });
      var str = dot.write(g);
      var g2 = dot.read(str);
      expect(g2.getNode("n1")).to.eql({ foo: "bar" });
      expect(g2.nodeCount()).to.equal(1);
      expect(g2.edgeCount()).to.equal(0);
    });

    it("can write an edge", function() {
      var g = new Digraph();
      g.setEdge("n1", "n2");
      var str = dot.write(g, { strict: true });
      var g2 = dot.read(str);
      expect(g2.hasEdge("n1", "n2")).to.be.true;
      expect(g2.getEdge("n1", "n2")).to.eql({});
      expect(g2.nodeCount()).to.equal(2);
      expect(g2.edgeCount()).to.equal(1);
    });

    it("can write an edge with attributes", function() {
      var g = new Digraph();
      g.setEdge("n1", "n2", { foo: "bar" });
      var str = dot.write(g, { strict: true });
      var g2 = dot.read(str);
      expect(g2.getEdge("n1", "n2")).to.eql({ foo: "bar" });
      expect(g2.nodeCount()).to.equal(2);
      expect(g2.edgeCount()).to.equal(1);
    });

    it("can write multi-edges", function() {
      var g = new Digraph();
      g.setEdge("n1", "n2", [{ foo: "bar" }, { foo: "baz" }]);
      var str = dot.write(g);
      var g2 = dot.read(str);
      expect(_.sortBy(g2.getEdge("n1", "n2"), "foo")).to.eql([
        { foo: "bar" },
        { foo: "baz" }
      ]);
      expect(g2.nodeCount()).to.equal(2);
      expect(g2.edgeCount()).to.equal(1);
    });

    it("can write ids that must be escaped", function() {
      var g = new Digraph();
      g.setNode("\"n1\"");
      var str = dot.write(g);
      var g2 = dot.read(str);
      expect(g2.hasNode("\"n1\"")).to.be.true;
      expect(g2.getNode("\"n1\"")).to.eql({});
      expect(g2.nodeCount()).to.equal(1);
      expect(g2.edgeCount()).to.equal(0);
    });

    it("can write subgraphs", function() {
      var g = new CDigraph();
      g.setParent("n1", "root");
      var str = dot.write(g);
      var g2 = dot.read(str);
      expect(g2.hasNode("n1")).to.be.true;
      expect(g2.hasNode("root")).to.be.true;
      expect(g2.getParent("n1")).to.equal("root");
      expect(g2.nodeCount()).to.equal(2);
      expect(g2.edgeCount()).to.equal(0);
    });

    it("can write subgraphs with attributes", function() {
      var g = new CDigraph();
      g.setParent("n1", "root");
      g.setNode("root", { foo: "bar" });
      var str = dot.write(g);
      var g2 = dot.read(str);
      expect(g2.hasNode("n1")).to.be.true;
      expect(g2.hasNode("root")).to.be.true;
      expect(g2.getNode("root")).to.eql({ foo: "bar" });
      expect(g2.getParent("n1")).to.equal("root");
      expect(g2.nodeCount()).to.equal(2);
      expect(g2.edgeCount()).to.equal(0);
    });
  });
});
