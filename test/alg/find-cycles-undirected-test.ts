import {Graph} from '../../lib';
import {findCycles} from '../../lib/alg';

function sortComponents(components: string[][]): string[][] {
    return components
        .map(component => component.slice().sort())
        .sort((a, b) => a[0]!.localeCompare(b[0]!));
}

describe("alg.findCycles undirected regression", () => {
    it("detects an undirected triangle", () => {
        const g = new Graph({directed: false});

        g.setEdge("a", "b");
        g.setEdge("b", "c");
        g.setEdge("a", "c");

        expect(sortComponents(findCycles(g))).toEqual([
            ["a", "b", "c"]
        ]);
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

        expect(sortComponents(findCycles(g))).toEqual([
            ["a", "b", "c"]
        ]);
    });

    it("keeps cycles separate when connected by a bridge", () => {
        const g = new Graph({directed: false});

        g.setPath(["a", "b", "c", "a"]);
        g.setEdge("c", "d");
        g.setPath(["d", "e", "f", "d"]);

        expect(sortComponents(findCycles(g))).toEqual([
            ["a", "b", "c"],
            ["d", "e", "f"]
        ]);
    });

    it("detects self-loops and parallel edges in undirected multigraphs", () => {
        const g = new Graph({
            directed: false,
            multigraph: true
        });

        g.setEdge("a", "a", "loop", "loop");
        g.setEdge("b", "c", "first", "first");
        g.setEdge("b", "c", "second", "second");
        g.setEdge("c", "d");

        expect(sortComponents(findCycles(g))).toEqual([
            ["a"],
            ["b", "c"]
        ]);
    });
});
