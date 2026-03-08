import {Graph} from '../../lib';
import {components} from '../../lib/alg';

describe("alg.components", () => {
    it("returns an empty list for an empty graph", () => {
        expect(components(new Graph({directed: false}))).toHaveLength(0);
    });

    it("returns singleton lists for unconnected nodes", () => {
        const g = new Graph({directed: false});
        g.setNode("a");
        g.setNode("b");

        const result = components(g).sort((a, b) => a[0]!.localeCompare(b[0]!));
        expect(result).toEqual([["a"], ["b"]]);
    });

    it("returns a list of nodes in a component", () => {
        const g = new Graph({directed: false});
        g.setEdge("a", "b");
        g.setEdge("b", "c");

        const result = components(g).map(xs => xs.sort());
        expect(result).toEqual([["a", "b", "c"]]);
    });

    it("returns nodes connected by a neighbor relationship in a digraph", () => {
        const g = new Graph();
        g.setPath(["a", "b", "c", "a"]);
        g.setEdge("d", "c");
        g.setEdge("e", "f");

        const result = components(g).map(xs => xs.sort()).sort((a, b) => a[0]!.localeCompare(b[0]!));
        expect(result).toEqual([["a", "b", "c", "d"], ["e", "f"]]);
    });
});
