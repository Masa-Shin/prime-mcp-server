import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    include: [
      'src/**/*.{test,spec}.{js,ts}',
      'tests/**/*.{test,spec}.{js,ts}'
    ],
    coverage: {
      include: ['src/**/*'],
      exclude: ['src/**/*.d.ts']
    }
  },
  resolve: {
    alias: {
      // Handle .js imports for .ts files
      '^(\\.{1,2}/.*)\\.js$': '$1.ts'
    }
  }
});