#!/usr/bin/env tsx
/**
 * API Test Runner Script
 * Run this script to test all API endpoints manually
 */

import { apiRequest, createPaginationBody } from '../helpers/api';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000';

interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
    status?: number;
}

const results: TestResult[] = [];

async function runTest(name: string, testFn: () => Promise<any>): Promise<void> {
    try {
        await testFn();
        results.push({ name, passed: true });
        console.log(`✅ ${name}`);
    } catch (error: any) {
        results.push({
            name,
            passed: false,
            error: error.message,
            status: error.status,
        });
        console.log(`❌ ${name}: ${error.message}`);
    }
}

async function main() {
    console.log('🧪 Running API Tests...\n');
    console.log(`Base URL: ${BASE_URL}\n`);

    // Test Flats API
    await runTest('Flats API - Get paginated list', async () => {
        const response = await apiRequest('/api/flats', {
            method: 'POST',
            body: JSON.stringify(createPaginationBody()),
        });
        if (response.status !== 200) {
            throw new Error(`Expected 200, got ${response.status}`);
        }
        if (!response.data.data || !Array.isArray(response.data.data)) {
            throw new Error('Invalid response structure');
        }
    });

    await runTest('Flats API - Search by flatNumber', async () => {
        const response = await apiRequest('/api/flats', {
            method: 'POST',
            body: JSON.stringify(
                createPaginationBody({
                    searchCriterias: [
                        {
                            columnName: 'flatNumber',
                            columnOperator: 'contains',
                            columnValue: 'G',
                        },
                    ],
                })
            ),
        });
        if (response.status !== 200) {
            throw new Error(`Expected 200, got ${response.status}`);
        }
    });

    // Test Residents API
    await runTest('Residents API - Get paginated list', async () => {
        const response = await apiRequest('/api/residents', {
            method: 'POST',
            body: JSON.stringify(createPaginationBody()),
        });
        if (response.status !== 200) {
            throw new Error(`Expected 200, got ${response.status}`);
        }
        if (!response.data.data || !Array.isArray(response.data.data)) {
            throw new Error('Invalid response structure');
        }
    });

    // Test Payments API
    await runTest('Payments API - Get paginated list', async () => {
        const response = await apiRequest('/api/payments', {
            method: 'POST',
            body: JSON.stringify(createPaginationBody()),
        });
        if (response.status !== 200) {
            throw new Error(`Expected 200, got ${response.status}`);
        }
        if (!response.data.data || !Array.isArray(response.data.data)) {
            throw new Error('Invalid response structure');
        }
    });

    // Test Register API
    await runTest('Register API - Create new user', async () => {
        const testEmail = `test-${Date.now()}@example.com`;
        const response = await apiRequest('/api/register', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Test User',
                email: testEmail,
                password: 'password123',
            }),
        });
        if (response.status !== 201) {
            throw new Error(`Expected 201, got ${response.status}: ${JSON.stringify(response.data)}`);
        }
    });

    // Print summary
    console.log('\n📊 Test Summary:');
    console.log('================');
    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;
    console.log(`Total: ${results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);

    if (failed > 0) {
        console.log('\n❌ Failed Tests:');
        results
            .filter((r) => !r.passed)
            .forEach((r) => {
                console.log(`  - ${r.name}`);
                if (r.error) console.log(`    Error: ${r.error}`);
                if (r.status) console.log(`    Status: ${r.status}`);
            });
        process.exit(1);
    } else {
        console.log('\n🎉 All tests passed!');
        process.exit(0);
    }
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});

