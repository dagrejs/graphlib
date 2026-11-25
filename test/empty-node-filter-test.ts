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

describe('filterNodes with an empty parent ID', () => {
    it('does not recreate an excluded empty parent', () => {
        const g = new Graph({compound: true});
        g.setParent('child', '');
        const copy = g.filterNodes(v => v !== '');
        expect(copy.nodes()).toEqual(['child']);
        expect(copy.parent('child')).toBeUndefined();
        expect(copy.children()).toEqual(['child']);
        expect(g.parent('child')).toBe('');
    });

    it('finds a retained ancestor through an excluded empty parent', () => {
        const g = new Graph({compound: true});
        g.setParent('child', '').setParent('', 'grandparent');
        const copy = g.filterNodes(v => v !== '');
        expect(copy.hasNode('')).toBe(false);
        expect(copy.parent('child')).toBe('grandparent');
        expect(copy.children('grandparent')).toEqual(['child']);
    });

    it('preserves an empty parent when the filter retains it', () => {
        const g = new Graph({compound: true});
        g.setParent('child', '');
        const copy = g.filterNodes(() => true);
        expect(copy.parent('child')).toBe('');
        expect(copy.children('')).toEqual(['child']);
        expect(copy.nodeCount()).toBe(2);
    });
});
