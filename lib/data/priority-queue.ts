/**
 * A min-priority queue data structure. This algorithm is derived from Cormen,
 * et al., "Introduction to Algorithms". The basic idea of a min-priority
 * queue is that you can efficiently (in O(1) time) get the smallest key in
 * the queue. Adding and removing elements takes O(log n) time. A key can
 * have its priority decreased in O(log n) time.
 */

interface PriorityQueueEntry {
    key: string;
    priority: number;
}

export class PriorityQueue {
    private _arr: PriorityQueueEntry[] = [];
    private _keyIndices: Record<string, number> = {};

    /**
     * Returns the number of elements in the queue. Takes `O(1)` time.
     */
    size(): number {
        return this._arr.length;
    }

    /**
     * Returns the keys that are in the queue. Takes `O(n)` time.
     */
    keys(): string[] {
        return this._arr.map(x => x.key);
    }

    /**
     * Returns `true` if **key** is in the queue and `false` if not.
     */
    has(key: string): boolean {
        return key in this._keyIndices;
    }

    /**
     * Returns the priority for **key**. If **key** is not present in the queue
     * then this function returns `undefined`. Takes `O(1)` time.
     */
    priority(key: string): number | undefined {
        const index = this._keyIndices[key];
        if (index !== undefined) {
            return this._arr[index]!.priority;
        }
        return undefined;
    }

    /**
     * Returns the key for the minimum element in this queue. If the queue is
     * empty this function throws an Error. Takes `O(1)` time.
     */
    min(): string {
        if (this.size() === 0) {
            throw new Error("Queue underflow");
        }
        return this._arr[0]!.key;
    }

    /**
     * Inserts a new key into the priority queue. If the key already exists in
     * the queue this function returns `false`; otherwise it will return `true`.
     * Takes `O(n)` time.
     */
    add(key: string, priority: number): boolean {
        const keyIndices = this._keyIndices;
        const keyStr = String(key);

        if (!(keyStr in keyIndices)) {
            const arr = this._arr;
            const index = arr.length;
            keyIndices[keyStr] = index;
            arr.push({key: keyStr, priority});
            this._decrease(index);
            return true;
        }
        return false;
    }

    /**
     * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
     */
    removeMin(): string {
        this._swap(0, this._arr.length - 1);
        const min = this._arr.pop()!;
        delete this._keyIndices[min.key];
        this._heapify(0);
        return min.key;
    }

    /**
     * Decreases the priority for **key** to **priority**. If the new priority is
     * greater than the previous priority, this function will throw an Error.
     */
    decrease(key: string, priority: number): void {
        const index = this._keyIndices[key];
        if (index === undefined) {
            throw new Error(`Key not found: ${key}`);
        }

        const currentPriority = this._arr[index]!.priority;
        if (priority > currentPriority) {
            throw new Error(
                `New priority is greater than current priority. Key: ${key} Old: ${currentPriority} New: ${priority}`
            );
        }
        this._arr[index]!.priority = priority;
        this._decrease(index);
    }

    private _heapify(i: number): void {
        const arr = this._arr;
        const l = 2 * i;
        const r = l + 1;
        let largest = i;

        if (l < arr.length) {
            largest = arr[l]!.priority < arr[largest]!.priority ? l : largest;
            if (r < arr.length) {
                largest = arr[r]!.priority < arr[largest]!.priority ? r : largest;
            }
            if (largest !== i) {
                this._swap(i, largest);
                this._heapify(largest);
            }
        }
    }

    private _decrease(index: number): void {
        const arr = this._arr;
        const priority = arr[index]!.priority;
        let parent: number;

        while (index !== 0) {
            parent = index >> 1;
            if (arr[parent]!.priority < priority) {
                break;
            }
            this._swap(index, parent);
            index = parent;
        }
    }

    private _swap(i: number, j: number): void {
        const arr = this._arr;
        const keyIndices = this._keyIndices;
        const origArrI = arr[i]!;
        const origArrJ = arr[j]!;

        arr[i] = origArrJ;
        arr[j] = origArrI;
        keyIndices[origArrJ.key] = i;
        keyIndices[origArrI.key] = j;
    }
}
