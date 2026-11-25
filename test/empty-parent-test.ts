import {Graph} from '../lib';

describe('filtering an empty compound parent ID', () => {
    it('promotes children to the retained ancestor without recreating a rejected node', () => {
        const graph = new Graph({compound: true});
        graph.setParent('', 'root').setParent('child', '');

        const filtered = graph.filterNodes(node => node !== '');

        expect(filtered.nodes().sort()).toEqual(['child', 'root']);
        expect(filtered.parent('child')).toBe('root');
        expect(filtered.children('root')).toEqual(['child']);
    });

    it('promotes children to the graph root when no ancestor survives', () => {
        const graph = new Graph({compound: true});
        graph.setParent('child', '');

        const filtered = graph.filterNodes(node => node !== '');

        expect(filtered.nodes()).toEqual(['child']);
        expect(filtered.parent('child')).toBeUndefined();
        expect(filtered.children()).toEqual(['child']);
    });

    it('retains an empty parent when that node passes the filter', () => {
        const graph = new Graph({compound: true});
        graph.setParent('child', '');

        const filtered = graph.filterNodes(() => true);

        expect(filtered.parent('child')).toBe('');
        expect(filtered.children('')).toEqual(['child']);
    });
});
