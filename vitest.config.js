import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['docs/js/**/*.js'],
      exclude: ['docs/js/**/*.test.js']
    }
  }
});
