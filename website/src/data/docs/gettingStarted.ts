import type { DocItem } from '../types';

export const gettingStartedDoc: DocItem = {
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
      example: `// Only the Deque code is bundled, nothing else.\nimport { Deque } from 'jstdlib/ds';`,
      timeComplexity: "O(1) mindset",
    }
  }
};
