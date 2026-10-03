export interface MethodParam {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
}

export interface MethodDoc {
  signature: string;
  description: string;
  params?: MethodParam[];
  returns?: { type: string; description: string };
  timeComplexity: string;
  spaceComplexity?: string;
  example: string;
}

export interface DocItem {
  id: string;
  label: string;
  description: string;
  importPath: string;
  since: string;
  methods: Record<string, MethodDoc>;
}

export interface DocSection {
  section: string;
  items: DocItem[];
}

export const DOCS: DocSection[] = [
  {
    section: "Getting Started",
    items: [
      {
        id: "getting-started",
        label: "Introduction",
        description:
          "jstdlib is a zero-dependency, TypeScript-native standard library for JavaScript. It provides high-performance data structures, async primitives, and utilities that the native language lacks, designed with performance and type safety in mind.\n\nInstall via npm:\n`npm install jstdlib`",
        importPath: "jstdlib",
        since: "0.1.0",
        methods: {
          "Design Philosophy": {
            signature: "Zero Dependencies | TypeScript First | High Performance",
            description: "jstdlib is strictly tree-shakeable. You only bundle what you import. Every data structure is rigorously tested for performance (Big-O guarantees) and memory efficiency.",
            example: `// Only the Deque code is bundled, nothing else.
import { Deque } from 'jstdlib/ds';`,
            timeComplexity: "O(1) mindset",
          }
        }
      }
    ]
  },
  {
    section: "Data Structures",
    items: [
      {
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
            example: `import { Deque } from 'jstdlib/ds';

const deque = new Deque<string>();
console.log(deque.isEmpty); // true`,
          },
          "pushFront": {
            signature: "pushFront(item: T): void",
            description: "Inserts an element at the front of the deque.",
            params: [
              { name: "item", type: "T", description: "The element to insert." },
            ],
            returns: { type: "void", description: "" },
            timeComplexity: "O(1) amortized",
            example: `const deque = new Deque<string>();
deque.pushFront("b");
deque.pushFront("a");
console.log([...deque]); // ["a", "b"]`,
          },
          "pushBack": {
            signature: "pushBack(item: T): void",
            description: "Inserts an element at the back of the deque.",
            params: [
              { name: "item", type: "T", description: "The element to insert." },
            ],
            returns: { type: "void", description: "" },
            timeComplexity: "O(1) amortized",
            example: `const deque = new Deque<string>();
deque.pushBack("a");
deque.pushBack("b");
console.log([...deque]); // ["a", "b"]`,
          },
          "popFront": {
            signature: "popFront(): T | undefined",
            description: "Removes and returns the element at the front of the deque. Returns undefined if the deque is empty.",
            returns: { type: "T | undefined", description: "The front element, or undefined if empty." },
            timeComplexity: "O(1)",
            example: `const deque = new Deque<number>();
deque.pushBack(1);
deque.pushBack(2);
console.log(deque.popFront()); // 1
console.log(deque.popFront()); // 2
console.log(deque.popFront()); // undefined`,
          },
          "popBack": {
            signature: "popBack(): T | undefined",
            description: "Removes and returns the element at the back of the deque. Returns undefined if the deque is empty.",
            returns: { type: "T | undefined", description: "The back element, or undefined if empty." },
            timeComplexity: "O(1)",
            example: `const deque = new Deque<number>();
deque.pushBack(1);
deque.pushBack(2);
console.log(deque.popBack()); // 2`,
          },
          "peekFront": {
            signature: "peekFront(): T | undefined",
            description: "Returns the front element without removing it.",
            returns: { type: "T | undefined", description: "The front element, or undefined if empty." },
            timeComplexity: "O(1)",
            example: `const deque = new Deque<number>();
deque.pushBack(42);
console.log(deque.peekFront()); // 42
console.log(deque.size);        // 1 — not removed`,
          },
          "peekBack": {
            signature: "peekBack(): T | undefined",
            description: "Returns the back element without removing it.",
            returns: { type: "T | undefined", description: "The back element, or undefined if empty." },
            timeComplexity: "O(1)",
            example: `const deque = new Deque<number>();
deque.pushBack(1);
deque.pushBack(99);
console.log(deque.peekBack()); // 99`,
          },
          "size": {
            signature: "get size(): number",
            description: "Returns the number of elements currently in the deque.",
            returns: { type: "number", description: "Current element count." },
            timeComplexity: "O(1)",
            example: `const deque = new Deque<number>();
deque.pushBack(1);
deque.pushBack(2);
console.log(deque.size); // 2`,
          },
          "isEmpty": {
            signature: "get isEmpty(): boolean",
            description: "Returns true if the deque contains no elements.",
            returns: { type: "boolean", description: "Whether the deque is empty." },
            timeComplexity: "O(1)",
            example: `const deque = new Deque<number>();
console.log(deque.isEmpty); // true
deque.pushBack(1);
console.log(deque.isEmpty); // false`,
          },
          "clear": {
            signature: "clear(): void",
            description: "Removes all elements from the deque and resets its state.",
            returns: { type: "void", description: "" },
            timeComplexity: "O(1)",
            example: `const deque = new Deque<number>();
deque.pushBack(1);
deque.pushBack(2);
deque.clear();
console.log(deque.size);    // 0
console.log(deque.isEmpty); // true`,
          },
          "[Symbol.iterator]": {
            signature: "[Symbol.iterator](): Iterator<T>",
            description: "Makes the Deque natively iterable. Enables for...of loops and array spreading.",
            returns: { type: "Iterator<T>", description: "An iterator yielding elements from front to back." },
            timeComplexity: "O(N)",
            example: `const deque = new Deque<number>();
deque.pushBack(1);
deque.pushBack(2);
deque.pushBack(3);

for (const item of deque) {
  console.log(item); // 1, 2, 3
}

const arr = [...deque]; // [1, 2, 3]`,
          },
        },
      },
      {
        id: "priority-queue",
        label: "PriorityQueue",
        description:
          "A Priority Queue built on a binary heap. Elements are dequeued in priority order defined by a comparator function.\n\n**Why use this?** If you have a changing list of tasks and need to repeatedly find the 'most important' one, sorting a native Array on every insert takes O(N log N) time. A PriorityQueue maintains a heap structure, making insertions and extractions incredibly fast at O(log N), while peeking the highest priority item is O(1).",
        importPath: "jstdlib/ds",
        since: "0.1.0",
        methods: {
          "new PriorityQueue()": {
            signature: "new PriorityQueue<T>(comparator?: (a: T, b: T) => number)",
            description: "Creates a new PriorityQueue. Accepts an optional comparator. A negative return means `a` has higher priority.",
            params: [
              { name: "comparator", type: "(a: T, b: T) => number", optional: true, description: "Sort order function. Defaults to ascending (min-queue)." },
            ],
            returns: { type: "PriorityQueue<T>", description: "A new empty PriorityQueue." },
            timeComplexity: "O(1)",
            example: `import { PriorityQueue } from 'jstdlib/ds';

// Min-Queue (default)
const minQ = new PriorityQueue<number>();

// Max-Queue
const maxQ = new PriorityQueue<number>((a, b) => b - a);

// Object Queue by priority field
const taskQ = new PriorityQueue<{ name: string; prio: number }>(
  (a, b) => a.prio - b.prio
);`,
          },
          "push": {
            signature: "push(item: T): void",
            description: "Adds an element and restores the heap property by bubbling it up.",
            params: [{ name: "item", type: "T", description: "The element to add." }],
            returns: { type: "void", description: "" },
            timeComplexity: "O(log N)",
            example: `const pq = new PriorityQueue<number>();
pq.push(5);
pq.push(1);
pq.push(3);
console.log(pq.peek()); // 1`,
          },
          "pop": {
            signature: "pop(): T | undefined",
            description: "Removes and returns the highest-priority element, then restores heap order.",
            returns: { type: "T | undefined", description: "The highest-priority element, or undefined if empty." },
            timeComplexity: "O(log N)",
            example: `const pq = new PriorityQueue<number>();
pq.push(5);
pq.push(1);
pq.push(3);
console.log(pq.pop()); // 1
console.log(pq.pop()); // 3
console.log(pq.pop()); // 5`,
          },
          "peek": {
            signature: "peek(): T | undefined",
            description: "Returns the highest-priority element without removing it.",
            returns: { type: "T | undefined", description: "The top element, or undefined if empty." },
            timeComplexity: "O(1)",
            example: `const pq = new PriorityQueue<number>();
pq.push(10);
pq.push(2);
console.log(pq.peek()); // 2
console.log(pq.size);   // 2 — element not removed`,
          },
          "size": {
            signature: "get size(): number",
            description: "Returns the number of elements in the queue.",
            returns: { type: "number", description: "Current element count." },
            timeComplexity: "O(1)",
            example: `const pq = new PriorityQueue<number>();
pq.push(1);
console.log(pq.size); // 1`,
          },
          "isEmpty": {
            signature: "get isEmpty(): boolean",
            description: "Returns true if the queue has no elements.",
            returns: { type: "boolean", description: "Whether the queue is empty." },
            timeComplexity: "O(1)",
            example: `const pq = new PriorityQueue<number>();
console.log(pq.isEmpty); // true
pq.push(5);
console.log(pq.isEmpty); // false`,
          },
          "clear": {
            signature: "clear(): void",
            description: "Removes all elements from the queue.",
            returns: { type: "void", description: "" },
            timeComplexity: "O(1)",
            example: `const pq = new PriorityQueue<number>();
pq.push(1);
pq.clear();
console.log(pq.size); // 0`,
          },
          "[Symbol.iterator]": {
            signature: "[Symbol.iterator](): Iterator<T>",
            description: "Makes the queue iterable. Note: iterates in heap-array order, not sorted order. Use repeated pop() for sorted output.",
            returns: { type: "Iterator<T>", description: "An iterator over the internal heap array." },
            timeComplexity: "O(N)",
            example: `const pq = new PriorityQueue<number>();
pq.push(3); pq.push(1); pq.push(2);

// Heap array order (not guaranteed sorted):
console.log([...pq]); // e.g. [1, 3, 2]

// Sorted drain:
const sorted = [];
while (!pq.isEmpty) sorted.push(pq.pop());
console.log(sorted); // [1, 2, 3]`,
          },
        },
      },
    ],
  },
];
