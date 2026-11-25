import {Graph} from '../lib';

describe('undirected sources and sinks', () => {
    it.each([['a', 'b', 'c'], ['z', 'b', 'a']])(
        'returns only isolated nodes in the path %s - %s - %s', (a, b, c) => {
            const graph = new Graph({directed: false});
            graph.setPath([a, b, c]).setNode('isolated');

            expect(graph.sources()).toEqual(['isolated']);
            expect(graph.sinks()).toEqual(['isolated']);
        }
    );

    it('does not treat self-loops as isolated nodes', () => {
        const graph = new Graph({directed: false});
        graph.setEdge('loop', 'loop').setNode('isolated');

        expect(graph.sources()).toEqual(['isolated']);
        expect(graph.sinks()).toEqual(['isolated']);
    });

    it('preserves directional terminals in a directed graph', () => {
        const graph = new Graph();
        graph.setPath(['a', 'b', 'c']).setNode('isolated');

        expect(graph.sources()).toEqual(['a', 'isolated']);
        expect(graph.sinks()).toEqual(['c', 'isolated']);
    });
});
