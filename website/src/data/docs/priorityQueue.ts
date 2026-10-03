import type { DocItem } from '../types';

export const priorityQueueDoc: DocItem = {
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
      example: `import { PriorityQueue } from 'jstdlib/ds';\n\n// Min-Queue (default)\nconst minQ = new PriorityQueue<number>();\n\n// Max-Queue\nconst maxQ = new PriorityQueue<number>((a, b) => b - a);\n\n// Object Queue by priority field\nconst taskQ = new PriorityQueue<{ name: string; prio: number }>(\n  (a, b) => a.prio - b.prio\n);`,
    },
    "push": {
      signature: "push(item: T): void",
      description: "Adds an element and restores the heap property by bubbling it up.",
      params: [{ name: "item", type: "T", description: "The element to add." }],
      returns: { type: "void", description: "" },
      timeComplexity: "O(log N)",
      example: `const pq = new PriorityQueue<number>();\npq.push(5);\npq.push(1);\npq.push(3);\nconsole.log(pq.peek()); // 1`,
    },
    "pop": {
      signature: "pop(): T | undefined",
      description: "Removes and returns the highest-priority element, then restores heap order.",
      returns: { type: "T | undefined", description: "The highest-priority element, or undefined if empty." },
      timeComplexity: "O(log N)",
      example: `const pq = new PriorityQueue<number>();\npq.push(5);\npq.push(1);\npq.push(3);\nconsole.log(pq.pop()); // 1\nconsole.log(pq.pop()); // 3\nconsole.log(pq.pop()); // 5`,
    },
    "peek": {
      signature: "peek(): T | undefined",
      description: "Returns the highest-priority element without removing it.",
      returns: { type: "T | undefined", description: "The top element, or undefined if empty." },
      timeComplexity: "O(1)",
      example: `const pq = new PriorityQueue<number>();\npq.push(10);\npq.push(2);\nconsole.log(pq.peek()); // 2\nconsole.log(pq.size);   // 2 — element not removed`,
    },
    "size": {
      signature: "get size(): number",
      description: "Returns the number of elements in the queue.",
      returns: { type: "number", description: "Current element count." },
      timeComplexity: "O(1)",
      example: `const pq = new PriorityQueue<number>();\npq.push(1);\nconsole.log(pq.size); // 1`,
    },
    "isEmpty": {
      signature: "get isEmpty(): boolean",
      description: "Returns true if the queue has no elements.",
      returns: { type: "boolean", description: "Whether the queue is empty." },
      timeComplexity: "O(1)",
      example: `const pq = new PriorityQueue<number>();\nconsole.log(pq.isEmpty); // true\npq.push(5);\nconsole.log(pq.isEmpty); // false`,
    },
    "clear": {
      signature: "clear(): void",
      description: "Removes all elements from the queue.",
      returns: { type: "void", description: "" },
      timeComplexity: "O(1)",
      example: `const pq = new PriorityQueue<number>();\npq.push(1);\npq.clear();\nconsole.log(pq.size); // 0`,
    },
    "[Symbol.iterator]": {
      signature: "[Symbol.iterator](): Iterator<T>",
      description: "Makes the queue iterable. Note: iterates in heap-array order, not sorted order. Use repeated pop() for sorted output.",
      returns: { type: "Iterator<T>", description: "An iterator over the internal heap array." },
      timeComplexity: "O(N)",
      example: `const pq = new PriorityQueue<number>();\npq.push(3); pq.push(1); pq.push(2);\n\n// Heap array order (not guaranteed sorted):\nconsole.log([...pq]); // e.g. [1, 3, 2]\n\n// Sorted drain:\nconst sorted = [];\nwhile (!pq.isEmpty) sorted.push(pq.pop());\nconsole.log(sorted); // [1, 2, 3]`,
    },
  },
};
