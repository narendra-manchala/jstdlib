// src/ds/deque.ts
var Deque = class {
  buffer;
  head;
  tail;
  _size;
  capacity;
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
  get size() {
    return this._size;
  }
  /**
   * Checks if the deque is empty.
   */
  get isEmpty() {
    return this._size === 0;
  }
  /**
   * Adds an element to the front of the deque.
   * @param item - The item to add.
   */
  pushFront(item) {
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
  pushBack(item) {
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
  popFront() {
    if (this.isEmpty) return void 0;
    const item = this.buffer[this.head];
    this.buffer[this.head] = void 0;
    this.head = (this.head + 1) % this.capacity;
    this._size--;
    return item;
  }
  /**
   * Removes and returns the element at the back of the deque.
   * @returns The back element, or undefined if empty.
   */
  popBack() {
    if (this.isEmpty) return void 0;
    this.tail = (this.tail - 1 + this.capacity) % this.capacity;
    const item = this.buffer[this.tail];
    this.buffer[this.tail] = void 0;
    this._size--;
    return item;
  }
  /**
   * Returns the element at the front without removing it.
   */
  peekFront() {
    if (this.isEmpty) return void 0;
    return this.buffer[this.head];
  }
  /**
   * Returns the element at the back without removing it.
   */
  peekBack() {
    if (this.isEmpty) return void 0;
    const index = (this.tail - 1 + this.capacity) % this.capacity;
    return this.buffer[index];
  }
  /**
   * Clears all elements from the deque.
   */
  clear() {
    this.buffer = new Array(this.capacity);
    this.head = 0;
    this.tail = 0;
    this._size = 0;
  }
  /**
   * Resizes the internal circular buffer when capacity is reached.
   */
  resize() {
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
  *[Symbol.iterator]() {
    for (let i = 0; i < this._size; i++) {
      yield this.buffer[(this.head + i) % this.capacity];
    }
  }
};

// src/ds/priorityQueue.ts
var PriorityQueue = class {
  data;
  comparator;
  /**
   * Initializes a new Priority Queue.
   * @param comparator - Optional. A function that defines the sort order. 
   * Returns < 0 if a < b, > 0 if a > b, and 0 if equal. 
   * Defaults to ascending order (Min-Queue).
   */
  constructor(comparator) {
    this.data = [];
    this.comparator = comparator ?? ((a, b) => a < b ? -1 : a > b ? 1 : 0);
  }
  /**
   * Gets the number of elements in the queue.
   */
  get size() {
    return this.data.length;
  }
  /**
   * Checks if the queue is empty.
   */
  get isEmpty() {
    return this.data.length === 0;
  }
  /**
   * Pushes an element into the priority queue.
   * @param item - The element to add.
   */
  push(item) {
    this.data.push(item);
    this.heapifyUp(this.data.length - 1);
  }
  /**
   * Removes and returns the highest priority element.
   * @returns The highest priority element, or undefined if empty.
   */
  pop() {
    if (this.isEmpty) return void 0;
    const top = this.data[0];
    const bottom = this.data.pop();
    if (this.data.length > 0 && bottom !== void 0) {
      this.data[0] = bottom;
      this.heapifyDown(0);
    }
    return top;
  }
  /**
   * Returns the highest priority element without removing it.
   */
  peek() {
    if (this.isEmpty) return void 0;
    return this.data[0];
  }
  /**
   * Clears all elements from the queue.
   */
  clear() {
    this.data = [];
  }
  /**
   * Bubbles an element up the tree to its correct heap position.
   */
  heapifyUp(index) {
    let currentIndex = index;
    const item = this.data[currentIndex];
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      const parent = this.data[parentIndex];
      if (this.comparator(item, parent) >= 0) break;
      this.data[currentIndex] = parent;
      currentIndex = parentIndex;
    }
    this.data[currentIndex] = item;
  }
  /**
   * Sinks an element down the tree to its correct heap position.
   */
  heapifyDown(index) {
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
  *[Symbol.iterator]() {
    for (const item of this.data) {
      yield item;
    }
  }
};

export { Deque, PriorityQueue };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map