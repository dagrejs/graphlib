import {Graph} from '../../lib';
import {dijkstra} from '../../lib/alg';
import {extractPath} from '../../lib/alg/extract-path';

describe('path extraction boundaries', () => {
    it('accepts an empty node ID as the source or an intermediate vertex', () => {
        const graph = new Graph().setPath(['source', '', 'destination']);

        expect(extractPath(dijkstra(graph, ''), '', 'destination')).toEqual({
            weight: 1, path: ['', 'destination']
        });
        expect(extractPath(dijkstra(graph, 'source'), 'source', 'destination')).toEqual({
            weight: 2, path: ['source', '', 'destination']
        });
    });

    it('rejects an unreachable vertex used as the source, including a self path', () => {
        const graph = new Graph().setEdge('a', 'b').setNode('unreachable');
        const paths = dijkstra(graph, 'a');

        expect(() => extractPath(paths, 'unreachable', 'b')).toThrow('Invalid source vertex');
        expect(() => extractPath(paths, 'unreachable', 'unreachable')).toThrow('Invalid source vertex');
    });

    it('rejects incomplete predecessor chains instead of returning a partial path', () => {
        const paths = {
            source: {distance: 0, predecessor: ''},
            destination: {distance: 2, predecessor: 'missing'}
        };

        expect(() => extractPath(paths, 'source', 'destination')).toThrow('Invalid destination vertex');
    });

    it('rejects cyclic predecessor chains', () => {
        const paths = {
            source: {distance: 0, predecessor: ''},
            a: {distance: 1, predecessor: 'b'},
            b: {distance: 2, predecessor: 'a'}
        };

        expect(() => extractPath(paths, 'source', 'a')).toThrow('Invalid destination vertex');
    });
});
