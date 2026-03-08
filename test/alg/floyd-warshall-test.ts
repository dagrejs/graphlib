import {Graph} from '../../lib';
import {floydWarshall} from '../../lib/alg';
import type {Edge} from '../../lib/types';
import {tests as allShortestPathsTest} from './utils/all-shortest-paths-test';

describe("alg.floydWarshall", () => {
    allShortestPathsTest(floydWarshall);

    it("handles negative weights", () => {
        const g = new Graph();
        g.setEdge("a", "b", 1);
        g.setEdge("a", "c", -2);
        g.setEdge("b", "d", 3);
        g.setEdge("c", "d", 3);

        expect(floydWarshall(g, weightFn(g))).toEqual({
            a: {
                a: {distance: 0, predecessor: ''},
                b: {distance: 1, predecessor: "a"},
                c: {distance: -2, predecessor: "a"},
                d: {distance: 1, predecessor: "c"}
            },
            b: {
                a: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                b: {distance: 0, predecessor: ''},
                c: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                d: {distance: 3, predecessor: "b"}
            },
            c: {
                a: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                b: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                c: {distance: 0, predecessor: ''},
                d: {distance: 3, predecessor: "c"}
            },
            d: {
                a: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                b: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                c: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                d: {distance: 0, predecessor: ''}
            }
        });
    });

    it("does include negative weight self edges", () => {
        const g = new Graph();
        g.setEdge("a", "a", -1);

        // In the case of a negative cycle the distance is not well-defined beyond
        // having a negative value along the diagonal.
        expect(floydWarshall(g, weightFn(g))).toEqual({
            a: {
                a: {distance: -2, predecessor: "a"}
            }
        });
    });
});

function weightFn(g: Graph) {
    return (edge: Edge) => {
        return g.edge(edge) as number;
    };
}
