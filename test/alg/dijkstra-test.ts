import {Graph} from '../../lib';
import {bellmanFord, dijkstra} from '../../lib/alg';
import type {Edge} from '../../lib/types';
import {tests as shortestPathsTests} from './utils/shortest-paths-tests';

describe("alg.dijkstra", () => {
    shortestPathsTests(bellmanFord);

    it("throws an Error if it encounters a negative edge weight", () => {
        const g = new Graph();
        g.setEdge("a", "b", 1);
        g.setEdge("a", "c", -2);
        g.setEdge("b", "d", 3);
        g.setEdge("c", "d", 3);

        expect(() => {
            dijkstra(g, "a", weightFn(g));
        }).toThrow();
    });
});

function weightFn(g: Graph) {
    return (e: Edge) => {
        return g.edge(e) as number;
    };
}
