import {Graph} from '../../lib';
import {dijkstraAll} from '../../lib/alg';
import type {Edge} from '../../lib/types';
import {tests as allShortestPathsTest} from './utils/all-shortest-paths-test';

describe("alg.dijkstraAll", () => {
    allShortestPathsTest(dijkstraAll);
    it("throws an Error if it encounters a negative edge weight", () => {
        const g = new Graph();
        g.setEdge("a", "b", 1);
        g.setEdge("a", "c", -2);
        g.setEdge("b", "d", 3);
        g.setEdge("c", "d", 3);
        expect(() => {
            dijkstraAll(g, weight(g));
        }).toThrow();
    });
});

function weight(g: Graph) {
    return (e: Edge) => {
        return g.edge(e) as number;
    };
}