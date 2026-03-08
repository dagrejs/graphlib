import {Graph} from '../../lib';
import {prim} from '../../lib/alg';
import type {Edge} from '../../lib/types';

describe("alg.prim", () => {
    it("returns an empty graph for an empty input", () => {
        const source = new Graph();

        const g = prim(source, weightFn(source));
        expect(g.nodeCount()).toBe(0);
        expect(g.edgeCount()).toBe(0);
    });

    it("returns a single node graph for a graph with a single node", () => {
        const source = new Graph();
        source.setNode("a");

        const g = prim(source, weightFn(source));
        expect(g.nodes()).toEqual(["a"]);
        expect(g.edgeCount()).toBe(0);
    });

    it("returns a deterministic result given an optimal solution", () => {
        const source = new Graph();
        source.setEdge("a", "b", 1);
        source.setEdge("b", "c", 2);
        source.setEdge("b", "d", 3);
        // This edge should not be in the min spanning tree
        source.setEdge("c", "d", 20);
        // This edge should not be in the min spanning tree
        source.setEdge("c", "e", 60);
        source.setEdge("d", "e", 1);

        const g = prim(source, weightFn(source));
        expect(g.neighbors("a")?.sort()).toEqual(["b"]);
        expect(g.neighbors("b")?.sort()).toEqual(["a", "c", "d"]);
        expect(g.neighbors("c")?.sort()).toEqual(["b"]);
        expect(g.neighbors("d")?.sort()).toEqual(["b", "e"]);
        expect(g.neighbors("e")?.sort()).toEqual(["d"]);
    });

    it("throws an Error for unconnected graphs", () => {
        const source = new Graph();
        source.setNode("a");
        source.setNode("b");

        expect(() => {
            prim(source, weightFn(source));
        }).toThrow();
    });
});

function weightFn(g: Graph) {
    return (edge: Edge) => {
        return g.edge(edge) as number;
    };
}
