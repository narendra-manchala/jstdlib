/**
 * A highly optimized Double-Ended Queue (Deque) utilizing a dynamic circular buffer.
 * Allows for insertion and removal at both ends in guaranteed amortized O(1) time complexity.
 *
 * @example
 * ```ts
 * import { Deque } from 'xstd/ds';
 *
 * const deque = new Deque<string>();
 * deque.pushBack("Task C");
 * deque.pushFront("Task A");
 *
 * console.log(deque.popFront()); // "Task A"
 * ```
 *
 * @time O(1) amortized for pushFront, pushBack, popFront, popBack.
 * @space O(N) where N is the number of elements in the queue.
 */
declare class Deque<T> implements Iterable<T> {
    private buffer;
    private head;
    private tail;
    private _size;
    private capacity;
    /**
     * Initializes a new Deque.
     * @param initialCapacity - The starting capacity of the buffer (default is 16).
     */
    constructor(initialCapacity?: number);
    /**
     * Gets the number of elements in the deque.
     */
    get size(): number;
    /**
     * Checks if the deque is empty.
     */
    get isEmpty(): boolean;
    /**
     * Adds an element to the front of the deque.
     * @param item - The item to add.
     */
    pushFront(item: T): void;
    /**
     * Adds an element to the back of the deque.
     * @param item - The item to add.
     */
    pushBack(item: T): void;
    /**
     * Removes and returns the element at the front of the deque.
     * @returns The front element, or undefined if empty.
     */
    popFront(): T | undefined;
    /**
     * Removes and returns the element at the back of the deque.
     * @returns The back element, or undefined if empty.
     */
    popBack(): T | undefined;
    /**
     * Returns the element at the front without removing it.
     */
    peekFront(): T | undefined;
    /**
     * Returns the element at the back without removing it.
     */
    peekBack(): T | undefined;
    /**
     * Clears all elements from the deque.
     */
    clear(): void;
    /**
     * Resizes the internal circular buffer when capacity is reached.
     */
    private resize;
    /**
     * Iterator for native JS loops (for...of) and spreading.
     */
    [Symbol.iterator](): Iterator<T>;
}

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
declare class PriorityQueue<T> implements Iterable<T> {
    private data;
    private comparator;
    /**
     * Initializes a new Priority Queue.
     * @param comparator - Optional. A function that defines the sort order.
     * Returns < 0 if a < b, > 0 if a > b, and 0 if equal.
     * Defaults to ascending order (Min-Queue).
     */
    constructor(comparator?: (a: T, b: T) => number);
    /**
     * Gets the number of elements in the queue.
     */
    get size(): number;
    /**
     * Checks if the queue is empty.
     */
    get isEmpty(): boolean;
    /**
     * Pushes an element into the priority queue.
     * @param item - The element to add.
     */
    push(item: T): void;
    /**
     * Removes and returns the highest priority element.
     * @returns The highest priority element, or undefined if empty.
     */
    pop(): T | undefined;
    /**
     * Returns the highest priority element without removing it.
     */
    peek(): T | undefined;
    /**
     * Clears all elements from the queue.
     */
    clear(): void;
    /**
     * Bubbles an element up the tree to its correct heap position.
     */
    private heapifyUp;
    /**
     * Sinks an element down the tree to its correct heap position.
     */
    private heapifyDown;
    /**
     * Iterator for native JS loops (for...of) and spreading.
     * Note: Yields elements in heap array order, not strictly sorted order.
     */
    [Symbol.iterator](): Iterator<T>;
}

export { Deque, PriorityQueue };
