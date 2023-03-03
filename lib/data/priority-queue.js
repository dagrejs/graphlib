/**
 * A min-priority queue data structure. This algorithm is derived from Cormen,
 * et al., "Introduction to Algorithms". The basic idea of a min-priority
 * queue is that you can efficiently (in O(1) time) get the smallest key in
 * the queue. Adding and removing elements takes O(log n) time. A key can
 * have its priority decreased in O(log n) time.
 */
class PriorityQueue {
  #arr = [];
  #keyIndices = {};

  /**
   * Returns the number of elements in the queue. Takes `O(1)` time.
   */
  size() {
    return this.#arr.length;
  }

  /**
   * Returns the keys that are in the queue. Takes `O(n)` time.
   */
  keys() {
    return this.#arr.map(function(x) { return x.key; });
  }

  /**
   * Returns `true` if **key** is in the queue and `false` if not.
   */
  has(key) {
    return this.#keyIndices.hasOwnProperty(key);
  }

  /**
   * Returns the priority for **key**. If **key** is not present in the queue
   * then this function returns `undefined`. Takes `O(1)` time.
   *
   * @param {Object} key
   */
  priority(key) {
    var index = this.#keyIndices[key];
    if (index !== undefined) {
      return this.#arr[index].priority;
    }
  }

  /**
   * Returns the key for the minimum element in this queue. If the queue is
   * empty this function throws an Error. Takes `O(1)` time.
   */
  min() {
    if (this.size() === 0) {
      throw new Error("Queue underflow");
    }
    return this.#arr[0].key;
  }

  /**
   * Inserts a new key into the priority queue. If the key already exists in
   * the queue this function returns `false`; otherwise it will return `true`.
   * Takes `O(n)` time.
   *
   * @param {Object} key the key to add
   * @param {Number} priority the initial priority for the key
   */
  add(key, priority) {
    var keyIndices = this.#keyIndices;
    key = String(key);
    if (!keyIndices.hasOwnProperty(key)) {
      var arr = this.#arr;
      var index = arr.length;
      keyIndices[key] = index;
      arr.push({key: key, priority: priority});
      this.#decrease(index);
      return true;
    }
    return false;
  }

  /**
   * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
   */
  removeMin() {
    this.#swap(0, this.#arr.length - 1);
    var min = this.#arr.pop();
    delete this.#keyIndices[min.key];
    this.#heapify(0);
    return min.key;
  }

  /**
   * Decreases the priority for **key** to **priority**. If the new priority is
   * greater than the previous priority, this function will throw an Error.
   *
   * @param {Object} key the key for which to raise priority
   * @param {Number} priority the new priority for the key
   */
  decrease(key, priority) {
    var index = this.#keyIndices[key];
    if (priority > this.#arr[index].priority) {
      throw new Error("New priority is greater than current priority. " +
          "Key: " + key + " Old: " + this.#arr[index].priority + " New: " + priority);
    }
    this.#arr[index].priority = priority;
    this.#decrease(index);
  }

  #heapify(i) {
    var arr = this.#arr;
    var l = 2 * i;
    var r = l + 1;
    var largest = i;
    if (l < arr.length) {
      largest = arr[l].priority < arr[largest].priority ? l : largest;
      if (r < arr.length) {
        largest = arr[r].priority < arr[largest].priority ? r : largest;
      }
      if (largest !== i) {
        this.#swap(i, largest);
        this.#heapify(largest);
      }
    }
  }

  #decrease(index) {
    var arr = this.#arr;
    var priority = arr[index].priority;
    var parent;
    while (index !== 0) {
      parent = index >> 1;
      if (arr[parent].priority < priority) {
        break;
      }
      this.#swap(index, parent);
      index = parent;
    }
  }

  #swap(i, j) {
    var arr = this.#arr;
    var keyIndices = this.#keyIndices;
    var origArrI = arr[i];
    var origArrJ = arr[j];
    arr[i] = origArrJ;
    arr[j] = origArrI;
    keyIndices[origArrJ.key] = i;
    keyIndices[origArrI.key] = j;
  }
}

module.exports = PriorityQueue;
