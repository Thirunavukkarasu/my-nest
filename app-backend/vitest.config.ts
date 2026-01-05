import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./src/__tests__/setup.ts'],
        reporters: ['verbose', 'dot'],
        testTimeout: 10000, // 10 second default timeout for all tests
        pool: 'threads', // Run tests in parallel using worker threads
        poolOptions: {
            threads: {
                singleThread: false, // Enable parallel execution
                minThreads: 1, // Minimum threads
                maxThreads: 4, // Maximum threads to avoid overwhelming the API server
            },
        },
        outputFile: {
            json: './test-results.json',
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});

