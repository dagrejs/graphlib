import {Graph} from '../lib';

describe.each([true, false])('empty node edge filters (directed: %s)', directed => {
    it('filters outgoing edges to the empty node', () => {
        const g = new Graph({directed});
        g.setEdge('a', '', 'target').setEdge('a', 'b', 'other');
        expect(g.outEdges('a', '')?.map(edge => g.edge(edge))).toEqual(['target']);
        expect(g.outEdges('a')).toHaveLength(2);
    });

    it('filters incoming edges from the empty node', () => {
        const g = new Graph({directed});
        g.setEdge('', 'a', 'target').setEdge('b', 'a', 'other');
        expect(g.inEdges('a', '')?.map(edge => g.edge(edge))).toEqual(['target']);
        expect(g.inEdges('a')).toHaveLength(2);
    });

    it('filters incident edges to the empty node', () => {
        const g = new Graph({directed});
        g.setEdge('a', '', 'target').setEdge('b', 'a', 'other');
        expect(g.nodeEdges('a', '')?.map(edge => g.edge(edge))).toEqual(['target']);
        expect(g.nodeEdges('a')).toHaveLength(2);
        expect(g.nodeEdges('b', '')).toEqual([]);
    });
});
