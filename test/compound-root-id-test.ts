import {Graph} from '../lib/graph.js';
import * as json from '../lib/json.js';

describe('NUL node IDs in compound graphs', () => {
    test('does not replace the list of top-level nodes', () => {
        const graph = new Graph({compound: true}).setNodes(['before', '\x00', 'after']);
        expect(graph.children()).toEqual(['before', '\x00', 'after']);
        expect(graph.children('\x00')).toEqual([]);
        expect(graph.parent('\x00')).toBeUndefined();
    });

    test('uses a NUL ID as an ordinary parent', () => {
        const graph = new Graph({compound: true}).setNode('unrelated').setParent('child', '\x00');
        expect(graph.parent('child')).toBe('\x00');
        expect(graph.children('\x00')).toEqual(['child']);
        expect(graph.children()).toEqual(['unrelated', '\x00']);
    });

    test('can reparent a NUL node and still rejects a real cycle', () => {
        const graph = new Graph({compound: true}).setParent('\x00', 'container');
        expect(graph.parent('\x00')).toBe('container');
        expect(graph.children()).toEqual(['container']);
        expect(graph.children('container')).toEqual(['\x00']);
        expect(() => graph.setParent('container', '\x00')).toThrow('would create a cycle');
    });

    test('promotes children when their NUL parent is removed', () => {
        const graph = new Graph({compound: true}).setParent('child', '\x00').setNode('other');
        graph.removeNode('\x00');
        expect(graph.nodeCount()).toBe(2);
        expect(graph.children().sort()).toEqual(['child', 'other']);
        expect(graph.parent('child')).toBeUndefined();
        expect(graph.children('\x00')).toEqual([]);
    });

    test('preserves a NUL parent when serializing and filtering', () => {
        const graph = new Graph({compound: true}).setParent('child', '\x00').setNode('other');
        const restored = json.read(JSON.parse(JSON.stringify(json.write(graph))));
        expect(restored.parent('child')).toBe('\x00');
        expect(restored.children('\x00')).toEqual(['child']);
        const filtered = graph.filterNodes(v => v !== '\x00');
        expect(filtered.hasNode('\x00')).toBe(false);
        expect(filtered.children().sort()).toEqual(['child', 'other']);
    });

    test('keeps non-compound root and NUL-node queries distinct', () => {
        const graph = new Graph().setNodes(['a', '\x00']);
        expect(graph.children()).toEqual(['a', '\x00']);
        expect(graph.children('\x00')).toEqual([]);
    });
});
