import {Graph} from '../../lib';
import {bellmanFord} from '../../lib/alg';
import type {Edge} from '../../lib/types';
import {tests as shortestPathsTests} from './utils/shortest-paths-tests';

describe("alg.bellmanFord", () => {
    shortestPathsTests(bellmanFord);

    it("Works with negative weight edges on the graph", () => {
        const g = new Graph();
        g.setEdge("a", "b", -1);
        g.setEdge("a", "c", 4);
        g.setEdge("b", "c", 3);
        g.setEdge("b", "d", 2);
        g.setEdge("b", "e", 2);
        g.setEdge("d", "c", 5);
        g.setEdge("d", "b", 1);
        g.setEdge("e", "d", -3);

        expect(bellmanFord(g, "a", weightFn(g))).toEqual({
            a: {distance: 0, predecessor: ''},
            b: {distance: -1, predecessor: "a"},
            c: {distance: 2, predecessor: "b"},
            d: {distance: -2, predecessor: "e"},
            e: {distance: 1, predecessor: "b"}
        });
    });

    it("Throws an error if the graph contains a negative weight cycle", () => {
        const g = new Graph();
        g.setEdge("a", "b", 1);
        g.setEdge("b", "c", 3);
        g.setEdge("c", "d", -5);
        g.setEdge("d", "e", 4);
        g.setEdge("d", "b", 1);
        g.setEdge("c", "f", 8);

        expect(() => {
            bellmanFord(g, "a", weightFn(g));
        }).toThrow();
    });
});

function weightFn(g: Graph) {
    return (e: Edge) => {
        return g.edge(e) as number;
    };
}
