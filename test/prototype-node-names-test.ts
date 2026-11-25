import {Graph} from '../lib';
import * as json from '../lib/json';
import {bellmanFord, components, dijkstra, dijkstraAll, findCycles, floydWarshall,
    postorder, preorder, prim, tarjan, topsort} from '../lib/alg';

const names = ['__proto__', 'constructor', 'toString', 'hasOwnProperty'];

describe('node IDs matching Object.prototype properties', () => {
    it.each(names)('supports the node lifecycle for %s', name => {
        const graph = new Graph({compound: true});
        expect(graph.hasNode(name)).toBe(false);
        graph.removeNode(name);
        graph.setNode(name, {label: name}).setParent('child', name);

        expect(graph.nodeCount()).toBe(2);
        expect(graph.node(name)).toEqual({label: name});
        expect(graph.children(name)).toEqual(['child']);
        expect(graph.parent('child')).toBe(name);
        expect(json.read(json.write(graph)).node(name)).toEqual({label: name});
        expect(graph.filterNodes(() => true).parent('child')).toBe(name);

        graph.setEdge(name, 'child', 'edge');
        expect(graph.successors(name)).toEqual(['child']);
        graph.removeNode(name);
        expect(graph.nodes()).toEqual(['child']);
        expect(graph.edgeCount()).toBe(0);
        expect(graph.parent('child')).toBeUndefined();
    });

    it('visits every node during traversals and component analysis', () => {
        const graph = new Graph().setPath(names);

        expect(preorder(graph, names[0]!)).toEqual(names);
        expect(postorder(graph, names[0]!)).toEqual([...names].reverse());
        expect(topsort(graph)).toEqual(names);
        expect(components(graph)).toEqual([names]);
        expect(tarjan(graph)).toEqual([...names].reverse().map(name => [name]));
        graph.setEdge(names[names.length - 1]!, names[0]!);
        expect(findCycles(graph)[0]?.sort()).toEqual([...names].sort());
    });

    it('computes single-source and all-pairs shortest paths', () => {
        const graph = new Graph().setPath(names, 2);
        const weight = (edge: {v: string; w: string}) => graph.edge(edge) as number;

        for (const paths of [dijkstra(graph, names[0]!, weight), bellmanFord(graph, names[0]!, weight),
            dijkstraAll(graph, weight)[names[0]!]!, floydWarshall(graph, weight)[names[0]!]!]) {
            expect(Object.keys(paths)).toEqual(names);
            const target = names[names.length - 1]!;
            expect(paths[target]?.distance).toBe(6);
            expect(paths[target]?.predecessor).toBe('toString');
        }
    });

    it('uses prototype-named vertices in the minimum spanning tree', () => {
        const graph = new Graph({directed: false}).setPath(names, 1);
        const tree = prim(graph, edge => graph.edge(edge) as number);

        expect(tree.nodeCount()).toBe(names.length);
        expect(tree.edgeCount()).toBe(names.length - 1);
        expect(tree.neighbors('constructor')?.sort()).toEqual(['__proto__', 'toString']);
    });
});
