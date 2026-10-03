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
export class Deque<T> implements Iterable<T> {
  private buffer: (T | undefined)[];
  private head: number;
  private tail: number;
  private _size: number;
  private capacity: number;

  /**
   * Initializes a new Deque.
   * @param initialCapacity - The starting capacity of the buffer (default is 16).
   */
  constructor(initialCapacity = 16) {
    this.capacity = initialCapacity;
    this.buffer = new Array(this.capacity);
    this.head = 0;
    this.tail = 0;
    this._size = 0;
  }

  /**
   * Gets the number of elements in the deque.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Checks if the deque is empty.
   */
  get isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Adds an element to the front of the deque.
   * @param item - The item to add.
   */
  pushFront(item: T): void {
    if (this._size === this.capacity) {
      this.resize();
    }
    this.head = (this.head - 1 + this.capacity) % this.capacity;
    this.buffer[this.head] = item;
    this._size++;
  }

  /**
   * Adds an element to the back of the deque.
   * @param item - The item to add.
   */
  pushBack(item: T): void {
    if (this._size === this.capacity) {
      this.resize();
    }
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;
    this._size++;
  }

  /**
   * Removes and returns the element at the front of the deque.
   * @returns The front element, or undefined if empty.
   */
  popFront(): T | undefined {
    if (this.isEmpty) return undefined;

    const item = this.buffer[this.head];
    this.buffer[this.head] = undefined; // Prevent memory leak / help GC
    this.head = (this.head + 1) % this.capacity;
    this._size--;
    return item as T;
  }

  /**
   * Removes and returns the element at the back of the deque.
   * @returns The back element, or undefined if empty.
   */
  popBack(): T | undefined {
    if (this.isEmpty) return undefined;

    this.tail = (this.tail - 1 + this.capacity) % this.capacity;
    const item = this.buffer[this.tail];
    this.buffer[this.tail] = undefined; // Prevent memory leak / help GC
    this._size--;
    return item as T;
  }

  /**
   * Returns the element at the front without removing it.
   */
  peekFront(): T | undefined {
    if (this.isEmpty) return undefined;
    return this.buffer[this.head];
  }

  /**
   * Returns the element at the back without removing it.
   */
  peekBack(): T | undefined {
    if (this.isEmpty) return undefined;
    const index = (this.tail - 1 + this.capacity) % this.capacity;
    return this.buffer[index];
  }

  /**
   * Clears all elements from the deque.
   */
  clear(): void {
    this.buffer = new Array(this.capacity);
    this.head = 0;
    this.tail = 0;
    this._size = 0;
  }

  /**
   * Resizes the internal circular buffer when capacity is reached.
   */
  private resize(): void {
    const newCapacity = this.capacity * 2;
    const newBuffer = new Array(newCapacity);

    for (let i = 0; i < this._size; i++) {
      newBuffer[i] = this.buffer[(this.head + i) % this.capacity];
    }

    this.buffer = newBuffer;
    this.capacity = newCapacity;
    this.head = 0;
    this.tail = this._size;
  }

  /**
   * Iterator for native JS loops (for...of) and spreading.
   */
  *[Symbol.iterator](): Iterator<T> {
    for (let i = 0; i < this._size; i++) {
      yield this.buffer[(this.head + i) % this.capacity] as T;
    }
  }
}
