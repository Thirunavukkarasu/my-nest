/**
 * API Integration Tests
 * Run all API tests together
 */
import { describe } from 'vitest';

describe('API Integration Tests', () => {
    // Import all test suites
    require('./flats.test');
    require('./residents.test');
    require('./payments.test');
    require('./auth.test');
});

