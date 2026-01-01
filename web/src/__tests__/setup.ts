/**
 * Test setup file
 * Runs before all tests
 */
import { afterAll, beforeAll } from 'vitest';

// Set test environment variables
process.env.NODE_ENV = 'test';

beforeAll(() => {
    // Setup before all tests
    console.log('Setting up test environment...');
});

afterAll(() => {
    // Cleanup after all tests
    console.log('Cleaning up test environment...');
});

