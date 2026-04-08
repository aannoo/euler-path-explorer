import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['**/e2e/**', '**/node_modules/**'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['js/**/*.js'],
      exclude: ['js/**/*.test.js'],
    },
  },
});
