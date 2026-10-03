import type { DocItem } from '../types';

export const dequeDoc: DocItem = {
  id: "deque",
  label: "Deque",
  description:
    "A Double-Ended Queue (Deque) built on a dynamic circular buffer. \n\n**Why use this?** In a native JavaScript Array, calling `shift()` or `unshift()` forces the engine to re-index every single element, resulting in an O(N) performance cost. This Deque supports O(1) amortized insertion and removal at both the front and back, making it exponentially faster for queues, sliding windows, and undo/redo buffers.",
  importPath: "jstdlib/ds",
  since: "0.1.0",
  methods: {
    "new Deque()": {
      signature: "new Deque<T>(initialCapacity?: number)",
      description: "Creates a new Deque instance. Optionally accepts an initial buffer capacity.",
      params: [
        { name: "initialCapacity", type: "number", optional: true, description: "Starting buffer size. Defaults to 16. The buffer auto-resizes when full." },
      ],
      returns: { type: "Deque<T>", description: "A new empty Deque instance." },
      timeComplexity: "O(1)",
      example: `import { Deque } from 'jstdlib/ds';\n\nconst deque = new Deque<string>();\nconsole.log(deque.isEmpty); // true`,
    },
    "pushFront": {
      signature: "pushFront(item: T): void",
      description: "Inserts an element at the front of the deque.",
      params: [
        { name: "item", type: "T", description: "The element to insert." },
      ],
      returns: { type: "void", description: "" },
      timeComplexity: "O(1) amortized",
      example: `const deque = new Deque<string>();\ndeque.pushFront("b");\ndeque.pushFront("a");\nconsole.log([...deque]); // ["a", "b"]`,
    },
    "pushBack": {
      signature: "pushBack(item: T): void",
      description: "Inserts an element at the back of the deque.",
      params: [
        { name: "item", type: "T", description: "The element to insert." },
      ],
      returns: { type: "void", description: "" },
      timeComplexity: "O(1) amortized",
      example: `const deque = new Deque<string>();\ndeque.pushBack("a");\ndeque.pushBack("b");\nconsole.log([...deque]); // ["a", "b"]`,
    },
    "popFront": {
      signature: "popFront(): T | undefined",
      description: "Removes and returns the element at the front of the deque. Returns undefined if the deque is empty.",
      returns: { type: "T | undefined", description: "The front element, or undefined if empty." },
      timeComplexity: "O(1)",
      example: `const deque = new Deque<number>();\ndeque.pushBack(1);\ndeque.pushBack(2);\nconsole.log(deque.popFront()); // 1\nconsole.log(deque.popFront()); // 2\nconsole.log(deque.popFront()); // undefined`,
    },
    "popBack": {
      signature: "popBack(): T | undefined",
      description: "Removes and returns the element at the back of the deque. Returns undefined if the deque is empty.",
      returns: { type: "T | undefined", description: "The back element, or undefined if empty." },
      timeComplexity: "O(1)",
      example: `const deque = new Deque<number>();\ndeque.pushBack(1);\ndeque.pushBack(2);\nconsole.log(deque.popBack()); // 2`,
    },
    "peekFront": {
      signature: "peekFront(): T | undefined",
      description: "Returns the front element without removing it.",
      returns: { type: "T | undefined", description: "The front element, or undefined if empty." },
      timeComplexity: "O(1)",
      example: `const deque = new Deque<number>();\ndeque.pushBack(42);\nconsole.log(deque.peekFront()); // 42\nconsole.log(deque.size);        // 1 — not removed`,
    },
    "peekBack": {
      signature: "peekBack(): T | undefined",
      description: "Returns the back element without removing it.",
      returns: { type: "T | undefined", description: "The back element, or undefined if empty." },
      timeComplexity: "O(1)",
      example: `const deque = new Deque<number>();\ndeque.pushBack(1);\ndeque.pushBack(99);\nconsole.log(deque.peekBack()); // 99`,
    },
    "size": {
      signature: "get size(): number",
      description: "Returns the number of elements currently in the deque.",
      returns: { type: "number", description: "Current element count." },
      timeComplexity: "O(1)",
      example: `const deque = new Deque<number>();\ndeque.pushBack(1);\ndeque.pushBack(2);\nconsole.log(deque.size); // 2`,
    },
    "isEmpty": {
      signature: "get isEmpty(): boolean",
      description: "Returns true if the deque contains no elements.",
      returns: { type: "boolean", description: "Whether the deque is empty." },
      timeComplexity: "O(1)",
      example: `const deque = new Deque<number>();\nconsole.log(deque.isEmpty); // true\ndeque.pushBack(1);\nconsole.log(deque.isEmpty); // false`,
    },
    "clear": {
      signature: "clear(): void",
      description: "Removes all elements from the deque and resets its state.",
      returns: { type: "void", description: "" },
      timeComplexity: "O(1)",
      example: `const deque = new Deque<number>();\ndeque.pushBack(1);\ndeque.pushBack(2);\ndeque.clear();\nconsole.log(deque.size);    // 0\nconsole.log(deque.isEmpty); // true`,
    },
    "[Symbol.iterator]": {
      signature: "[Symbol.iterator](): Iterator<T>",
      description: "Makes the Deque natively iterable. Enables for...of loops and array spreading.",
      returns: { type: "Iterator<T>", description: "An iterator yielding elements from front to back." },
      timeComplexity: "O(N)",
      example: `const deque = new Deque<number>();\ndeque.pushBack(1);\ndeque.pushBack(2);\ndeque.pushBack(3);\n\nfor (const item of deque) {\n  console.log(item); // 1, 2, 3\n}\n\nconst arr = [...deque]; // [1, 2, 3]`,
    },
  },
};
