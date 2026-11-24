import {Graph} from '../../lib';
import {isAcyclic} from '../../lib/alg';

describe("alg.isAcyclic", () => {
    it("returns true if the graph has no cycles", () => {
        const g = new Graph();
        g.setPath(["a", "b", "c"]);
        expect(isAcyclic(g)).toBe(true);
    });

    it("returns false if the graph has at least one cycle", () => {
        const g = new Graph();
        g.setPath(["a", "b", "c", "a"]);
        expect(isAcyclic(g)).toBe(false);
    });

    it("returns false if the graph has a cycle of 1 node", () => {
        const g = new Graph();
        g.setPath(["a", "a"]);
        expect(isAcyclic(g)).toBe(false);
    });

    it("rethrows non-CycleException errors", () => {
        expect(() => {
            isAcyclic(undefined as unknown as Graph);
        }).toThrow();
    });

    describe("undirected", () => {
        it("returns true if an undirected graph has no cycles", () => {
            const g = new Graph({directed: false});
            g.setPath(["a", "b", "c"]);
            g.setEdge("d", "e");
            expect(isAcyclic(g)).toBe(true);
        });

        it("returns false for an undirected triangle", () => {
            const g = new Graph({directed: false});
            g.setEdge("a", "b");
            g.setEdge("b", "c");
            g.setEdge("a", "c");
            expect(isAcyclic(g)).toBe(false);
        });

        it("returns false for a self-loop in an undirected graph", () => {
            const g = new Graph({directed: false});
            g.setEdge("a", "a");
            expect(isAcyclic(g)).toBe(false);
        });

        it("returns false for parallel edges in an undirected multigraph", () => {
            const g = new Graph({directed: false, multigraph: true});
            g.setEdge("a", "b", "first", "first");
            g.setEdge("a", "b", "second", "second");
            expect(isAcyclic(g)).toBe(false);
        });

        it("returns false when a cycle is in a disconnected component", () => {
            const g = new Graph({directed: false});
            g.setEdge("a", "b");
            g.setPath(["c", "d", "e", "c"]);
            expect(isAcyclic(g)).toBe(false);
        });
    });
});
