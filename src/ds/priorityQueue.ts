/**
 * A highly optimized Priority Queue implemented via a binary heap.
 * Elements are ordered based on a provided three-way comparator function,
 * identical to `Array.prototype.sort()`.
 * 
 * By default, it acts as a Min-Queue for numbers and strings.
 * 
 * @example
 * ```ts
 * import { PriorityQueue } from 'xstd/ds';
 * 
 * // Default Min-Queue
 * const minQ = new PriorityQueue<number>();
 * minQ.push(5);
 * minQ.push(1);
 * console.log(minQ.pop()); // 1
 * 
 * // Custom Max-Queue for Objects
 * const maxQ = new PriorityQueue<{ id: string, prio: number }>((a, b) => b.prio - a.prio);
 * maxQ.push({ id: 'a', prio: 10 });
 * maxQ.push({ id: 'b', prio: 50 });
 * console.log(maxQ.pop()); // { id: 'b', prio: 50 }
 * ```
 * 
 * @time O(log N) for `push` and `pop`. O(1) for `peek`.
 * @space O(N) where N is the number of elements.
 */
export class PriorityQueue<T> implements Iterable<T> {
  private data: T[];
  private comparator: (a: T, b: T) => number;

  /**
   * Initializes a new Priority Queue.
   * @param comparator - Optional. A function that defines the sort order. 
   * Returns < 0 if a < b, > 0 if a > b, and 0 if equal. 
   * Defaults to ascending order (Min-Queue).
   */
  constructor(comparator?: (a: T, b: T) => number) {
    this.data = [];
    // Default comparator mimics standard JS `<` and `>` behavior for numbers/strings
    this.comparator = comparator ?? ((a: T, b: T) => (a < b ? -1 : a > b ? 1 : 0));
  }

  /**
   * Gets the number of elements in the queue.
   */
  get size(): number {
    return this.data.length;
  }

  /**
   * Checks if the queue is empty.
   */
  get isEmpty(): boolean {
    return this.data.length === 0;
  }

  /**
   * Pushes an element into the priority queue.
   * @param item - The element to add.
   */
  push(item: T): void {
    this.data.push(item);
    this.heapifyUp(this.data.length - 1);
  }

  /**
   * Removes and returns the highest priority element.
   * @returns The highest priority element, or undefined if empty.
   */
  pop(): T | undefined {
    if (this.isEmpty) return undefined;
    
    const top = this.data[0];
    const bottom = this.data.pop();
    
    // If there are still elements left, move the last item to the top and heapify down
    if (this.data.length > 0 && bottom !== undefined) {
      this.data[0] = bottom;
      this.heapifyDown(0);
    }
    
    return top;
  }

  /**
   * Returns the highest priority element without removing it.
   */
  peek(): T | undefined {
    if (this.isEmpty) return undefined;
    return this.data[0];
  }

  /**
   * Clears all elements from the queue.
   */
  clear(): void {
    this.data = [];
  }

  /**
   * Bubbles an element up the tree to its correct heap position.
   */
  private heapifyUp(index: number): void {
    let currentIndex = index;
    const item = this.data[currentIndex];

    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      const parent = this.data[parentIndex];

      // If item is >= parent, the heap property is satisfied
      if (this.comparator(item, parent) >= 0) break;

      this.data[currentIndex] = parent;
      currentIndex = parentIndex;
    }

    this.data[currentIndex] = item;
  }

  /**
   * Sinks an element down the tree to its correct heap position.
   */
  private heapifyDown(index: number): void {
    let currentIndex = index;
    const length = this.data.length;
    const item = this.data[currentIndex];

    while (true) {
      const leftChildIndex = 2 * currentIndex + 1;
      const rightChildIndex = 2 * currentIndex + 2;
      let swapIndex = -1;

      if (leftChildIndex < length) {
        const leftChild = this.data[leftChildIndex];
        if (this.comparator(leftChild, item) < 0) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        const rightChild = this.data[rightChildIndex];
        const compareTo = swapIndex === -1 ? item : this.data[leftChildIndex];
        
        if (this.comparator(rightChild, compareTo) < 0) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === -1) break;

      this.data[currentIndex] = this.data[swapIndex];
      currentIndex = swapIndex;
    }

    this.data[currentIndex] = item;
  }

  /**
   * Iterator for native JS loops (for...of) and spreading.
   * Note: Yields elements in heap array order, not strictly sorted order.
   */
  [Symbol.iterator](): Iterator<T> {
    return this.data[Symbol.iterator]();
  }
}
