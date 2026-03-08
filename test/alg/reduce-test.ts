import {Graph} from '../../lib';
import {reduce} from '../../lib/alg/reduce';

describe("alg.reduce", () => {
    it("returns the initial accumulator value when the graph is empty",
        () => {
            const g = new Graph();

            expect(reduce(g, [], "pre", (a: number, _) => {
                return a;
            }, 0)).toEqual(0);
        }
    );

    it("applies the accumulator function to all nodes in the graph", () => {
        const g = new Graph({directed: false});
        g.setPath(["1", "2", "3", "5", "7"]);
        g.setPath(["2", "5", "11", "13"]);

        expect(reduce(g, "2", "pre", (a, b) => {
            return Number(a) + Number(b);
        }, 0)).toEqual(42);
    });

    it("traverses the graph in pre order", () => {
        const g = new Graph({directed: false});
        g.setPath(["1", "2", "3", "5", "7"]);
        g.setPath(["2", "5", "11", "13"]);

        expect(reduce(g, "2", "pre", (a, b) => {
            return a + b + "-";
        }, "")).toEqual("2-1-3-5-11-13-7-");
    });

    it("traverses the graph in post order", () => {
        const g = new Graph({directed: false});
        g.setPath(["1", "2", "3", "5", "7"]);
        g.setPath(["2", "5", "11", "13"]);

        expect(reduce(g, "2", "post", (a, b) => {
            return a + b + "-";
        }, "")).toEqual("1-13-11-7-5-3-2-");
    });
});
