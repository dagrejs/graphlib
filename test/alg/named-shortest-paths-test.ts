import {Graph} from '../../lib';
import {bellmanFord, shortestPaths} from '../../lib/alg';

describe.each([
    ['bellmanFord', bellmanFord],
    ['shortestPaths', shortestPaths]
] as const)('alg.%s with named edges', (_name, algorithm) => {
    it('uses named negative edges when finding distances and predecessors', () => {
        const g = new Graph({multigraph: true});
        g.setEdge('a', 'b', 1, 'x');
        g.setEdge('b', 'c', -1, 'y');
        g.setNode('unreachable');

        expect(algorithm(g, 'a', e => g.edge(e) as number)).toEqual({
            a: {distance: 0, predecessor: ''},
            b: {distance: 1, predecessor: 'a'},
            c: {distance: 0, predecessor: 'b'},
            unreachable: {distance: Infinity, predecessor: ''}
        });
    });

    it('distinguishes parallel named edges from an unnamed edge', () => {
        const g = new Graph({multigraph: true});
        g.setEdge('a', 'b', 10);
        g.setEdge('a', 'b', 2, 'fast');
        g.setEdge('a', 'b', 7, 'slow');
        g.setEdge('b', 'c', 3, 'onward');

        expect(algorithm(g, 'a', e => g.edge(e) as number)).toEqual({
            a: {distance: 0, predecessor: ''},
            b: {distance: 2, predecessor: 'a'},
            c: {distance: 5, predecessor: 'b'}
        });
    });

    it.each([2, -2])('supports object labels with an edge weight of %s', weight => {
        const g = new Graph({multigraph: true});
        g.setEdge('a', 'b', {weight}, 'weighted');

        expect(algorithm(g, 'a', e => (g.edge(e) as {weight: number}).weight)).toEqual({
            a: {distance: 0, predecessor: ''},
            b: {distance: weight, predecessor: 'a'}
        });
    });

    it('looks up original directed edges when traversing incoming edges', () => {
        const g = new Graph({multigraph: true});
        g.setEdge('a', 'b', 4, 'first');
        g.setEdge('b', 'c', -2, 'second');

        expect(algorithm(g, 'c', e => g.edge(e) as number, v => g.inEdges(v) ?? [])).toEqual({
            a: {distance: 2, predecessor: 'b'},
            b: {distance: -2, predecessor: 'c'},
            c: {distance: 0, predecessor: ''}
        });
    });

    it('traverses named undirected edges against their stored orientation', () => {
        const g = new Graph({directed: false, multigraph: true});
        g.setEdge('a', 'b', 2, 'first');
        g.setEdge('b', 'c', 3, 'second');

        expect(algorithm(g, 'c', e => g.edge(e) as number, v => g.nodeEdges(v) ?? [])).toEqual({
            a: {distance: 5, predecessor: 'b'},
            b: {distance: 3, predecessor: 'c'},
            c: {distance: 0, predecessor: ''}
        });
    });

    it('detects negative cycles made from named edges', () => {
        const g = new Graph({multigraph: true});
        g.setEdge('a', 'b', 1, 'out');
        g.setEdge('b', 'a', -2, 'back');

        expect(() => algorithm(g, 'a', e => g.edge(e) as number))
            .toThrow('The graph contains a negative weight cycle');
    });
});
