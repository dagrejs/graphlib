import {Graph} from '../../lib';
import {findCycles} from '../../lib/alg';

describe("alg.findCycles", () => {
    it("returns an empty array for an empty graph", () => {
        expect(findCycles(new Graph())).toEqual([]);
    });

    it("returns an empty array if the graph has no cycles", () => {
        const g = new Graph();
        g.setPath(["a", "b", "c"]);
        expect(findCycles(g)).toEqual([]);
    });

    it("returns a single entry for a cycle of 1 node", () => {
        const g = new Graph();
        g.setPath(["a", "a"]);
        expect(sort(findCycles(g))).toEqual([["a"]]);
    });

    it("returns a single entry for a cycle of 2 nodes", () => {
        const g = new Graph();
        g.setPath(["a", "b", "a"]);
        expect(sort(findCycles(g))).toEqual([["a", "b"]]);
    });

    it("returns a single entry for a triangle", () => {
        const g = new Graph();
        g.setPath(["a", "b", "c", "a"]);
        expect(sort(findCycles(g))).toEqual([["a", "b", "c"]]);
    });

    it("detects a self-loop created with a named edge in a multigraph", () => {
        const g = new Graph({multigraph: true});
        g.setNode("a");
        g.setEdge("a", "a", "label", "name");
        expect(sort(findCycles(g))).toEqual([["a"]]);
    });

    it("returns multiple entries for multiple cycles", () => {
        const g = new Graph();
        g.setPath(["a", "b", "a"]);
        g.setPath(["c", "d", "e", "c"]);
        g.setPath(["f", "g", "g"]);
        g.setNode("h");
        expect(sort(findCycles(g))).toEqual([["a", "b"], ["c", "d", "e"], ["g"]]);
    });

    describe("undirected", () => {
        it("detects an undirected triangle", () => {
            const g = new Graph({directed: false});
            g.setEdge("a", "b");
            g.setEdge("b", "c");
            g.setEdge("a", "c");
            expect(sort(findCycles(g))).toEqual([["a", "b", "c"]]);
        });

        it("returns no cycles for an undirected tree", () => {
            const g = new Graph({directed: false});
            g.setEdge("a", "b");
            g.setEdge("b", "c");
            expect(findCycles(g)).toEqual([]);
        });

        it("excludes nodes outside an undirected cycle", () => {
            const g = new Graph({directed: false});
            g.setPath(["a", "b", "c", "a"]);
            g.setEdge("c", "d");
            expect(sort(findCycles(g))).toEqual([["a", "b", "c"]]);
        });

        it("keeps cycles separate when connected by a bridge", () => {
            const g = new Graph({directed: false});
            g.setPath(["a", "b", "c", "a"]);
            g.setEdge("c", "d");
            g.setPath(["d", "e", "f", "d"]);
            expect(sort(findCycles(g))).toEqual([["a", "b", "c"], ["d", "e", "f"]]);
        });

        it("detects self-loops and parallel edges in undirected multigraphs", () => {
            const g = new Graph({directed: false, multigraph: true});
            g.setEdge("a", "a", "loop", "loop");
            g.setEdge("b", "c", "first", "first");
            g.setEdge("b", "c", "second", "second");
            g.setEdge("c", "d");
            expect(sort(findCycles(g))).toEqual([["a"], ["b", "c"]]);
        });
    });
});

// A helper that sorts components and their contents
function sort(cmpts: string[][]): string[][] {
    return cmpts.map(cmpt => cmpt.sort()).sort((a, b) => a[0]!.localeCompare(b[0]!));
}
