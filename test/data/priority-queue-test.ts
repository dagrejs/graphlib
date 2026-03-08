import {PriorityQueue} from '../../lib/data/priority-queue';

describe("data.PriorityQueue", () => {
    let pq: PriorityQueue;

    beforeEach(() => {
        pq = new PriorityQueue();
    });

    describe("size", () => {
        it("returns 0 for an empty queue", () => {
            expect(pq.size()).toBe(0);
        });

        it("returns the number of elements in the queue", () => {
            pq.add("a", 1);
            expect(pq.size()).toBe(1);
            pq.add("b", 2);
            expect(pq.size()).toBe(2);
        });
    });

    describe("keys", () => {
        it("returns all of the keys in the queue", () => {
            pq.add("a", 1);
            pq.add("1", 2);
            pq.add("false", 3);
            pq.add("undefined", 4);
            pq.add("null", 5);
            expect(pq.keys().sort()).toEqual(["a", "1", "false", "undefined", "null"].sort());
        });
    });

    describe("has", () => {
        it("returns true if the key is in the queue", () => {
            pq.add("a", 1);
            expect(pq.has("a")).toBe(true);
        });

        it("returns false if the key is not in the queue", () => {
            expect(pq.has("a")).toBe(false);
        });
    });

    describe("priority", () => {
        it("returns the current priority for the key", () => {
            pq.add("a", 1);
            pq.add("b", 2);
            expect(pq.priority("a")).toBe(1);
            expect(pq.priority("b")).toBe(2);
        });

        it("returns undefined if the key is not in the queue", () => {
            expect(pq.priority("foo")).toBeUndefined();
        });
    });

    describe("min", () => {
        it("throws an error if there is no element in the queue", () => {
            expect(() => {
                pq.min();
            }).toThrow();
        });

        it("returns the smallest element", () => {
            pq.add("b", 2);
            pq.add("a", 1);
            expect(pq.min()).toBe("a");
        });

        it("does not remove the minimum element from the queue", () => {
            pq.add("b", 2);
            pq.add("a", 1);
            pq.min();
            expect(pq.size()).toBe(2);
        });
    });

    describe("add", () => {
        it("adds the key to the queue", () => {
            pq.add("a", 1);
            expect(pq.keys()).toEqual(["a"]);
        });

        it("returns true if the key was added", () => {
            expect(pq.add("a", 1)).toBe(true);
        });

        it("returns false if the key already exists in the queue", () => {
            pq.add("a", 1);
            expect(pq.add("a", 1)).toBe(false);
        });
    });

    describe("removeMin", () => {
        it("removes the minimum element from the queue", () => {
            pq.add("b", 2);
            pq.add("a", 1);
            pq.add("c", 3);
            pq.add("e", 5);
            pq.add("d", 4);
            expect(pq.removeMin()).toBe("a");
            expect(pq.removeMin()).toBe("b");
            expect(pq.removeMin()).toBe("c");
            expect(pq.removeMin()).toBe("d");
            expect(pq.removeMin()).toBe("e");
        });

        it("throws an error if there is no element in the queue", () => {
            expect(() => {
                pq.removeMin();
            }).toThrow();
        });
    });

    describe("decrease", () => {
        it("decreases the priority of a key", () => {
            pq.add("a", 1);
            pq.decrease("a", -1);
            expect(pq.priority("a")).toBe(-1);
        });

        it("raises an error if the key is not in the queue", () => {
            expect(() => {
                pq.decrease("a", -1);
            }).toThrow();
        });

        it("raises an error if the new priority is greater than current", () => {
            pq.add("a", 1);
            expect(() => {
                pq.decrease("a", 2);
            }).toThrow();
        });
    });
});
