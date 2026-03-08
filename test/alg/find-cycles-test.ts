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

    it("returns multiple entries for multiple cycles", () => {
        const g = new Graph();
        g.setPath(["a", "b", "a"]);
        g.setPath(["c", "d", "e", "c"]);
        g.setPath(["f", "g", "g"]);
        g.setNode("h");
        expect(sort(findCycles(g))).toEqual([["a", "b"], ["c", "d", "e"], ["g"]]);
    });
});

// A helper that sorts components and their contents
function sort(cmpts: string[][]): string[][] {
    return cmpts.map(cmpt => cmpt.sort()).sort((a, b) => a[0]!.localeCompare(b[0]!));
}
