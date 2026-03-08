import {Graph} from '../../../lib';
import type {Edge, EdgeFunction, WeightFunction} from '../../../lib/types';
import * as alg from '../../../lib/alg/index';

export function tests(algorithm: (g: Graph, source: string, weightFn?: WeightFunction, edgeFn?: EdgeFunction) => Record<string, {
    distance: number;
    predecessor: string
}>) {
    describe("Shortest Path Algorithms", () => {
        it("assigns distance 0 for the source node", () => {
            const g = new Graph();
            g.setNode("source");
            expect(algorithm(g, "source")).toEqual({source: {distance: 0, predecessor: ''}});
        });

        it("returns Number.POSITIVE_INFINITY for unconnected nodes", () => {
            const g = new Graph();
            g.setNode("a");
            g.setNode("b");
            expect(algorithm(g, "a")).toEqual({
                a: {distance: 0, predecessor: ''},
                b: {distance: Number.POSITIVE_INFINITY, predecessor: ''}
            });
        });

        it("returns the distance and path from the source node to other nodes", () => {
            const g = new Graph();
            g.setPath(["a", "b", "c"]);
            g.setEdge("b", "d");
            expect(algorithm(g, "a")).toEqual({
                a: {distance: 0, predecessor: ''},
                b: {distance: 1, predecessor: "a"},
                c: {distance: 2, predecessor: "b"},
                d: {distance: 2, predecessor: "b"}
            });
        });

        it("works for undirected graphs", () => {
            const g = new Graph({directed: false});
            g.setPath(["a", "b", "c"]);
            g.setEdge("b", "d");
            expect(algorithm(g, "a")).toEqual({
                a: {distance: 0, predecessor: ''},
                b: {distance: 1, predecessor: "a"},
                c: {distance: 2, predecessor: "b"},
                d: {distance: 2, predecessor: "b"}
            });
        });

        it("works for undirected graphs when edges have a different natural order",
            () => {
                const g = new Graph({directed: false});
                g.setPath(["a", "b", "c"]);
                g.setEdge("b", "d");
                expect(algorithm(g, "d")).toEqual({
                    a: {distance: 2, predecessor: "b"},
                    b: {distance: 1, predecessor: "d"},
                    c: {distance: 2, predecessor: "b"},
                    d: {distance: 0, predecessor: ''}
                });
            }
        );

        it("uses an optionally supplied weight function", () => {
            const g = new Graph();
            g.setEdge("a", "b", 1);
            g.setEdge("a", "c", 2);
            g.setEdge("b", "d", 3);
            g.setEdge("c", "d", 3);

            expect(algorithm(g, "a", weightFn(g))).toEqual({
                a: {distance: 0, predecessor: ''},
                b: {distance: 1, predecessor: "a"},
                c: {distance: 2, predecessor: "a"},
                d: {distance: 4, predecessor: "b"}
            });
        });

        it("uses an optionally supplied edge function", () => {
            const g = new Graph();
            g.setPath(["a", "c", "d"]);
            g.setEdge("b", "c");

            expect(algorithm(g, "d", undefined, (e) => g.inEdges(e) ?? [])).toEqual({
                a: {distance: 2, predecessor: "c"},
                b: {distance: 2, predecessor: "c"},
                c: {distance: 1, predecessor: "d"},
                d: {distance: 0, predecessor: ''}
            });
        });
    });
}

// Test shortestPaths() function
describe("alg.shortestPaths", () => {
    tests(alg.shortestPaths);

    it("uses dijkstra if no weightFn is provided", () => {
        const g = new Graph();
        g.setPath(["a", "b", "c"]);
        g.setEdge("b", "d", -10);

        expect(alg.shortestPaths(g, "a")).toEqual(alg.dijkstra(g, "a"));
    });

    it("uses bellman-ford if the graph contains a negative edge", () => {
        const g = new Graph();
        g.setEdge("a", "b", 10);
        g.setEdge("b", "c", 8);
        g.setEdge("a", "d", -3);
        g.setEdge("d", "c", 2);

        expect(alg.shortestPaths(g, "a", weightFn(g))).toEqual(alg.bellmanFord(g, "a", weightFn(g)));
    });
});

function weightFn(g: Graph): WeightFunction {
    return (e: Edge) => {
        return g.edge(e) as number;
    };
}
