#!/usr/bin/env node

import Benchmark from 'benchmark';
import seedrandom from 'seedrandom';
import {sprintf} from 'sprintf-js';
import {Graph} from '../lib';
import * as alg from '../lib/alg/index';
import type {Edge} from '../lib/types';

const seed = process.env.SEED;
seedrandom(seed, {global: true});
if (seed) {
    console.log('SEED: %s (%d)', seed, Math.random());
}

const NODE_SIZES = [100];
const EDGE_DENSITY = 0.2;
const KEY_SIZE = 10;

interface BenchContext {
    count: number;

    nextInt(range: number): number;
}

function runBenchmark(name: string, fn: (this: BenchContext) => void): void {
    const options: Benchmark.Options = {};
    options.onComplete = function (bench: Benchmark.Event): void {
        const target = bench.target;
        if (!target) return;

        const hz = target.hz || 0;
        const stats = target.stats;
        if (!stats) return;

        const rme = stats.rme;
        const samples = stats.sample.length;
        const msg = sprintf(
            '    %25s: %13s ops/sec ± %s%% (%3d run(s) sampled)',
            target.name,
            Benchmark.formatNumber(Number(hz.toFixed(2))),
            rme.toFixed(2),
            samples
        );
        console.log(msg);
    };
    options.onError = function (bench: Benchmark.Event): void {
        const target = bench.target as (Benchmark.Target & { error?: string });
        if (target && target.error) {
            console.error('    ' + target.error);
        }
    };
    options.setup = function (this: BenchContext): void {
        this.count = Math.random() * 1000;
        this.nextInt = function (range: number): number {
            return Math.floor(this.count++ % range);
        };
    };
    new Benchmark(name, fn, options).run();
}

function keys(count: number): string[] {
    const ks: string[] = [];
    for (let i = 0; i < count; ++i) {
        let k = '';
        for (let j = 0; j < KEY_SIZE; ++j) {
            k += String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }
        ks.push(k);
    }
    return ks;
}

function buildGraph(numNodes: number, edgeDensity: number): Graph {
    const g = new Graph();
    const numEdges = numNodes * numNodes * edgeDensity;
    const ks = keys(numNodes);

    ks.forEach(k => g.setNode(k));

    for (let i = 0; i < numEdges; ++i) {
        let v: string, w: string;
        do {
            v = ks[Math.floor(Math.random() * ks.length)]!;
            w = ks[Math.floor(Math.random() * ks.length)]!;
        } while (g.hasEdge(v, w));
        g.setEdge(v, w);
    }
    return g;
}

NODE_SIZES.forEach(size => {
    const g = buildGraph(size, EDGE_DENSITY);
    const nodes = g.nodes();
    const edges = g.edges();
    const nameSuffix = '(' + size + ',' + EDGE_DENSITY + ')';

    runBenchmark('nodes' + nameSuffix, function () {
        g.nodes();
    });

    runBenchmark('sources' + nameSuffix, function () {
        g.sources();
    });

    runBenchmark('sinks' + nameSuffix, function () {
        g.sinks();
    });

    runBenchmark('filterNodes all' + nameSuffix, function () {
        g.filterNodes(() => true);
    });

    runBenchmark('filterNodes none' + nameSuffix, function () {
        g.filterNodes(() => false);
    });

    runBenchmark('setNode' + nameSuffix, function () {
        g.setNode('key', 'label');
    });

    runBenchmark('node' + nameSuffix, function (this: BenchContext) {
        g.node(nodes[this.nextInt(nodes.length)]!);
    });

    runBenchmark('set + removeNode' + nameSuffix, function () {
        g.setNode('key');
        g.removeNode('key');
    });

    runBenchmark('predecessors' + nameSuffix, function (this: BenchContext) {
        g.predecessors(nodes[this.nextInt(nodes.length)]!);
    });

    runBenchmark('successors' + nameSuffix, function (this: BenchContext) {
        g.successors(nodes[this.nextInt(nodes.length)]!);
    });

    runBenchmark('neighbors' + nameSuffix, function (this: BenchContext) {
        g.neighbors(nodes[this.nextInt(nodes.length)]!);
    });

    runBenchmark('edges' + nameSuffix, function () {
        g.edges();
    });

    runBenchmark('setPath' + nameSuffix, function () {
        g.setPath(['a', 'b', 'c', 'd', 'e']);
    });

    runBenchmark('setEdge' + nameSuffix, function () {
        g.setEdge('from', 'to', 'label');
    });

    runBenchmark('edge' + nameSuffix, function (this: BenchContext) {
        const edge = edges[this.nextInt(edges.length)] as Edge;
        g.edge(edge);
    });

    runBenchmark('set + removeEdge' + nameSuffix, function () {
        g.setEdge('from', 'to');
        g.removeEdge('from', 'to');
    });

    runBenchmark('inEdges' + nameSuffix, function (this: BenchContext) {
        g.inEdges(nodes[this.nextInt(nodes.length)]!);
    });

    runBenchmark('outEdges' + nameSuffix, function (this: BenchContext) {
        g.outEdges(nodes[this.nextInt(nodes.length)]!);
    });

    runBenchmark('nodeEdges' + nameSuffix, function (this: BenchContext) {
        g.nodeEdges(nodes[this.nextInt(nodes.length)]!);
    });

    runBenchmark('components' + nameSuffix, function () {
        alg.components(g);
    });

    runBenchmark('dijkstraAll' + nameSuffix, function () {
        alg.dijkstraAll(g);
    });
});
