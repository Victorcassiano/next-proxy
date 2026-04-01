import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    alias: [
      { find: /^(.*)\.js$/, replacement: '$1' },
    ],
  },
})