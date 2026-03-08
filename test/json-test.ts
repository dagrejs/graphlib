import {Graph} from '../lib';
import {read, write} from '../lib/json';

describe("json", () => {
    it("preserves the graph options", () => {
        expect(rw(new Graph({directed: true})).isDirected()).toBe(true);
        expect(rw(new Graph({directed: false})).isDirected()).toBe(false);
        expect(rw(new Graph({multigraph: true})).isMultigraph()).toBe(true);
        expect(rw(new Graph({multigraph: false})).isMultigraph()).toBe(false);
        expect(rw(new Graph({compound: true})).isCompound()).toBe(true);
        expect(rw(new Graph({compound: false})).isCompound()).toBe(false);
    });

    it("preserves the graph value, if any", () => {
        expect(rw(new Graph().setGraph(1)).graph()).toBe(1);
        expect(rw(new Graph().setGraph({foo: "bar"})).graph()).toEqual({foo: "bar"});
        expect(rw(new Graph()).graph()).toBeUndefined();
    });

    it("preserves nodes", () => {
        expect(rw(new Graph().setNode("a")).hasNode("a")).toBe(true);
        expect(rw(new Graph().setNode("a")).node("a")).toBeUndefined();
        expect(rw(new Graph().setNode("a", 1)).node("a")).toBe(1);
        expect(rw(new Graph().setNode("a", {foo: "bar"})).node("a")).toEqual({foo: "bar"});
    });

    it("preserves simple edges", () => {
        expect(rw(new Graph().setEdge("a", "b")).hasEdge("a", "b")).toBe(true);
        expect(rw(new Graph().setEdge("a", "b")).edge("a", "b")).toBeUndefined();
        expect(rw(new Graph().setEdge("a", "b", 1)).edge("a", "b")).toBe(1);
        expect(rw(new Graph().setEdge("a", "b", {foo: "bar"})).edge("a", "b")).toEqual({foo: "bar"});
    });

    it("preserves multi-edges", () => {
        const g = new Graph({multigraph: true});

        g.setEdge({v: "a", w: "b", name: "foo"});
        expect(rw(g).hasEdge("a", "b", "foo")).toBe(true);

        g.setEdge({v: "a", w: "b", name: "foo"});
        expect(rw(g).edge("a", "b", "foo")).toBeUndefined();

        g.setEdge({v: "a", w: "b", name: "foo"}, 1);
        expect(rw(g).edge("a", "b", "foo")).toBe(1);

        g.setEdge({v: "a", w: "b", name: "foo"}, {foo: "bar"});
        expect(rw(g).edge("a", "b", "foo")).toEqual({foo: "bar"});
    });

    it("preserves parent / child relationships", () => {
        expect(rw(new Graph({compound: true}).setNode("a")).parent("a")).toBeUndefined();
        expect(rw(new Graph({compound: true}).setParent("a", "parent")).parent("a")).toBe("parent");
    });
});

function rw(g: Graph): Graph {
    return read(write(g));
}
