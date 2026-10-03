import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'ds/index': 'src/ds/index.ts',
    'tree/index': 'src/tree/index.ts',
    'async/index': 'src/async/index.ts',
    'object/index': 'src/object/index.ts',
    'fn/index': 'src/fn/index.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  treeshake: true,
  minify: false,
  sourcemap: true,
  splitting: false,
});
