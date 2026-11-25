import {Graph} from '../../lib';
import {dijkstra, prim} from '../../lib/alg';

describe('Prim spanning tree orientation', () => {
    it('returns a tree that can be traversed from either endpoint', () => {
        const graph = new Graph({directed: false});
        graph.setEdge('a', 'b', 1).setEdge('b', 'c', 2).setEdge('a', 'c', 10);

        const tree = prim(graph, edge => graph.edge(edge) as number);

        expect(tree.isDirected()).toBe(false);
        expect(tree.edgeCount()).toBe(2);
        expect(dijkstra(tree, 'a').c?.distance).toBe(2);
        expect(dijkstra(tree, 'c').a?.distance).toBe(2);
    });

    it('returns undirected graphs for empty and single-node inputs', () => {
        for (const graph of [new Graph(), new Graph().setNode('only')]) {
            const tree = prim(graph, () => 1);
            expect(tree.isDirected()).toBe(false);
            expect(tree.nodes()).toEqual(graph.nodes());
        }
    });
});
