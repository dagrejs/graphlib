/**
 * A min-priority queue data structure. This algorithm is derived from Cormen,
 * et al., "Introduction to Algorithms". The basic idea of a min-priority
 * queue is that you can efficiently (in O(1) time) get the smallest key in
 * the queue. Adding and removing elements takes O(log n) time. A key can
 * have its priority decreased in O(log n) time.
 */
export declare class PriorityQueue {
    private _arr;
    private _keyIndices;
    /**
     * Returns the number of elements in the queue. Takes `O(1)` time.
     */
    size(): number;
    /**
     * Returns the keys that are in the queue. Takes `O(n)` time.
     */
    keys(): string[];
    /**
     * Returns `true` if **key** is in the queue and `false` if not.
     */
    has(key: string): boolean;
    /**
     * Returns the priority for **key**. If **key** is not present in the queue
     * then this function returns `undefined`. Takes `O(1)` time.
     */
    priority(key: string): number | undefined;
    /**
     * Returns the key for the minimum element in this queue. If the queue is
     * empty this function throws an Error. Takes `O(1)` time.
     */
    min(): string;
    /**
     * Inserts a new key into the priority queue. If the key already exists in
     * the queue this function returns `false`; otherwise it will return `true`.
     * Takes `O(n)` time.
     */
    add(key: string, priority: number): boolean;
    /**
     * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
     */
    removeMin(): string;
    /**
     * Decreases the priority for **key** to **priority**. If the new priority is
     * greater than the previous priority, this function will throw an Error.
     */
    decrease(key: string, priority: number): void;
    private _heapify;
    private _decrease;
    private _swap;
}
//# sourceMappingURL=priority-queue.d.ts.map