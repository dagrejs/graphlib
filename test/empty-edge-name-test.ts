import {Graph} from '../lib';
import * as json from '../lib/json';
import {dijkstra} from '../lib/alg';

describe.each([true, false])('empty edge names (directed: %s)', directed => {
    it('keeps an empty name distinct from the unnamed edge', () => {
        const g = new Graph({directed, multigraph: true});
        g.setEdge('a', 'b', 7).setEdge('a', 'b', 2, '');

        const named = g.edges().find(edge => edge.name === '');
        expect(named).toEqual({v: 'a', w: 'b', name: ''});
        expect(g.edge(named!)).toBe(2);
        expect(g.edge('a', 'b')).toBe(7);
        expect(g.edgeCount()).toBe(2);
        expect(dijkstra(g, 'a', edge => g.edge(edge) as number).b?.distance).toBe(2);
    });

    it('preserves empty names and labels in JSON and filtered graphs', () => {
        const g = new Graph({directed, multigraph: true});
        g.setEdge('a', 'b', 7).setEdge('a', 'b', 2, '');

        for (const copy of [json.read(json.write(g)), g.filterNodes(() => true)]) {
            expect(copy.edgeCount()).toBe(2);
            expect(copy.edge('a', 'b', '')).toBe(2);
            expect(copy.edge('a', 'b')).toBe(7);
        }
    });

    it('removes an empty-named edge by its descriptor without removing its sibling', () => {
        const g = new Graph({directed, multigraph: true});
        g.setEdge('a', 'b', 7).setEdge('a', 'b', 2, '');
        const named = g.edges().find(edge => edge.name === '');

        expect(named).toBeDefined();
        g.removeEdge(named!);
        expect(g.hasEdge('a', 'b', '')).toBe(false);
        expect(g.edge('a', 'b')).toBe(7);
        expect(g.edgeCount()).toBe(1);
    });

    it('removes incident empty-named edges when removing their node', () => {
        const g = new Graph({directed, multigraph: true});
        g.setEdge('a', 'b', 2, '');
        g.removeNode('a');
        expect(g.edges()).toEqual([]);
        expect(g.edgeCount()).toBe(0);
        expect(g.nodeEdges('b')).toEqual([]);
    });
});
