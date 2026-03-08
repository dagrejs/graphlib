import {Graph} from '../../../lib';
import type {Edge, EdgeFunction, WeightFunction} from '../../../lib/types';

export function tests(sp: (g: Graph, weightFn?: WeightFunction, edgeFn?: EdgeFunction) => Record<string, Record<string, {
    distance: number;
    predecessor: string
}>>) {
    describe("allShortestPaths", () => {
        it("returns 0 for the node itself", () => {
            const g = new Graph();
            g.setNode("a");
            expect(sp(g)).toEqual({a: {a: {distance: 0, predecessor: ''}}});
        });

        it("returns the distance and path from all nodes to other nodes", () => {
            const g = new Graph();
            g.setEdge("a", "b");
            g.setEdge("b", "c");
            expect(sp(g)).toEqual({
                a: {
                    a: {distance: 0, predecessor: ''},
                    b: {distance: 1, predecessor: "a"},
                    c: {distance: 2, predecessor: "b"}
                },
                b: {
                    a: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                    b: {distance: 0, predecessor: ''},
                    c: {distance: 1, predecessor: "b"}
                },
                c: {
                    a: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                    b: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                    c: {distance: 0, predecessor: ''}
                }
            });
        });

        it("uses an optionally supplied weight function", () => {
            const g = new Graph();
            g.setEdge("a", "b", 2);
            g.setEdge("b", "c", 3);

            expect(sp(g, weightFn(g))).toEqual({
                a: {
                    a: {distance: 0, predecessor: ''},
                    b: {distance: 2, predecessor: "a"},
                    c: {distance: 5, predecessor: "b"}
                },
                b: {
                    a: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                    b: {distance: 0, predecessor: ''},
                    c: {distance: 3, predecessor: "b"}
                },
                c: {
                    a: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                    b: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                    c: {distance: 0, predecessor: ''}
                }
            });
        });

        it("uses an optionally supplied incident function", () => {
            const g = new Graph();
            g.setEdge("a", "b");
            g.setEdge("b", "c");

            expect(sp(g, undefined, (v) => g.inEdges(v) ?? [])).toEqual({
                a: {
                    a: {distance: 0, predecessor: ''},
                    b: {distance: Number.POSITIVE_INFINITY, predecessor: ''},
                    c: {distance: Number.POSITIVE_INFINITY, predecessor: ''}
                },
                b: {
                    a: {distance: 1, predecessor: "b"},
                    b: {distance: 0, predecessor: ''},
                    c: {distance: Number.POSITIVE_INFINITY, predecessor: ''}
                },
                c: {
                    a: {distance: 2, predecessor: "b"},
                    b: {distance: 1, predecessor: "c"},
                    c: {distance: 0, predecessor: ''}
                }
            });
        });

        it("works with undirected graphs", () => {
            const g = new Graph({directed: false});
            g.setEdge("a", "b", 1);
            g.setEdge("b", "c", 2);
            g.setEdge("c", "a", 4);
            g.setEdge("b", "d", 6);

            expect(sp(g, weightFn(g), (v) => g.nodeEdges(v) ?? [])).toEqual({
                a: {
                    a: {distance: 0, predecessor: ''},
                    b: {distance: 1, predecessor: "a"},
                    c: {distance: 3, predecessor: "b"},
                    d: {distance: 7, predecessor: "b"},
                },
                b: {
                    a: {distance: 1, predecessor: "b"},
                    b: {distance: 0, predecessor: ''},
                    c: {distance: 2, predecessor: "b"},
                    d: {distance: 6, predecessor: "b"},
                },
                c: {
                    a: {distance: 3, predecessor: "b"},
                    b: {distance: 2, predecessor: "c"},
                    c: {distance: 0, predecessor: ''},
                    d: {distance: 8, predecessor: "b"},
                },
                d: {
                    a: {distance: 7, predecessor: "b"},
                    b: {distance: 6, predecessor: "d"},
                    c: {distance: 8, predecessor: "b"},
                    d: {distance: 0, predecessor: ''},
                }
            });
        });
    });
}

function weightFn(g: Graph): WeightFunction {
    return (e: Edge) => {
        return g.edge(e) as number;
    };
}
