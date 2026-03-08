import * as graphlib from '../index';

// These are smoke tests to make sure the bundles look like they are working
// correctly.

describe("bundle", () => {
    it("exports graphlib", () => {
        expect(graphlib).toBeDefined();
        expect(typeof graphlib).toBe("object");
        expect(graphlib.Graph).toBeInstanceOf(Function);
        expect(typeof graphlib.json).toBe("object");
        expect(typeof graphlib.alg).toBe("object");
        expect(typeof graphlib.version).toBe("string");
    });

    it("can do simple graph operations", () => {
        const g = new graphlib.Graph();
        g.setNode("a");
        g.setNode("b");
        g.setEdge("a", "b");
        expect(g.hasNode("a")).toBe(true);
        expect(g.hasNode("b")).toBe(true);
        expect(g.hasEdge("a", "b")).toBe(true);
    });

    it("can serialize to json and back", () => {
        const g = new graphlib.Graph();
        g.setNode("a");
        g.setNode("b");
        g.setEdge("a", "b");

        const json = graphlib.json.write(g);
        const g2 = graphlib.json.read(json);
        expect(g2.hasNode("a")).toBe(true);
        expect(g2.hasNode("b")).toBe(true);
        expect(g2.hasEdge("a", "b")).toBe(true);
    });
});
