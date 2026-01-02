/**
 * Ledger API Tests
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { apiRequest, assertPaginatedResponse, authenticatedRequest, createPaginationBody, ensureTestUserAndGetToken } from '../helpers/api';

describe('Ledger API', () => {
    const endpoint = '/api/ledger';
    let authToken: string | null = null;

    beforeAll(async () => {
        // Ensure test user exists and get auth token
        authToken = await ensureTestUserAndGetToken();
    });

    describe('POST /api/ledger', () => {
        it('should return paginated ledger entries with default pagination', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest(endpoint, authToken, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody()),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);
        });

        it('should return ledger entries with custom pagination', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest(endpoint, authToken, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ page: 1, limit: 5 })),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);
            expect(response.data.pagination.limit).toBe(5);
        });

        it('should filter ledger entries by entryType', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest(endpoint, authToken, {
                method: 'POST',
                body: JSON.stringify(
                    createPaginationBody({
                        searchCriterias: [
                            {
                                columnName: 'entryType',
                                columnOperator: 'equals',
                                columnValue: 'credit',
                            },
                        ],
                    })
                ),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);
        });

        it('should include flat, resident, and creator relations', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest(endpoint, authToken, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ limit: 1 })),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);

            if (response.data.data.length > 0) {
                const entry = response.data.data[0];
                // Check if relations are included (may be null/undefined)
                expect(entry).toHaveProperty('flat');
                expect(entry).toHaveProperty('resident');
                expect(entry).toHaveProperty('creator');
            }
        });
    });

    describe('POST /api/ledger/mutate - Create entry', () => {
        it('should create a credit entry', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            // First, get a flat and resident for the test
            const flatsResponse = await authenticatedRequest('/api/flats', authToken, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ limit: 1 })),
            });

            if (flatsResponse.data.data.length === 0) {
                console.warn('Skipping test: No flats available');
                return;
            }

            const flat = flatsResponse.data.data[0];
            const residentsResponse = await authenticatedRequest('/api/residents', authToken, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ limit: 1 })),
            });

            if (residentsResponse.data.data.length === 0) {
                console.warn('Skipping test: No residents available');
                return;
            }

            const resident = residentsResponse.data.data[0];

            const response = await authenticatedRequest('/api/ledger/mutate', authToken, {
                method: 'POST',
                body: JSON.stringify({
                    transactionDate: new Date().toISOString().split('T')[0],
                    entryType: 'credit',
                    category: 'maintenance',
                    flatId: flat.flatId,
                    residentId: resident.residentId,
                    amount: '2000.00',
                    status: 'completed',
                }),
            });

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('success', true);
            expect(response.data).toHaveProperty('data');
            expect(response.data.data).toHaveProperty('ledgerId');
            expect(response.data.data.entryType).toBe('credit');
        }, 10000); // 10 second timeout for this test

        it('should create a debit entry', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest('/api/ledger/mutate', authToken, {
                method: 'POST',
                body: JSON.stringify({
                    transactionDate: new Date().toISOString().split('T')[0],
                    entryType: 'debit',
                    category: 'security',
                    expenseCategory: 'security_salary',
                    paidBy: 'Admin',
                    amount: '5000.00',
                    description: 'Security guard salary',
                    status: 'completed',
                }),
            });

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('success', true);
            expect(response.data.data.entryType).toBe('debit');
        }, 10000); // 10 second timeout for this test

        it('should reject invalid entry type', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest('/api/ledger/mutate', authToken, {
                method: 'POST',
                body: JSON.stringify({
                    transactionDate: new Date().toISOString().split('T')[0],
                    entryType: 'invalid',
                    category: 'maintenance',
                    amount: '2000.00',
                }),
            });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/ledger/balance', () => {
        it('should return current balance', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest('/api/ledger/balance', authToken, {
                method: 'GET',
            });

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success', true);
            expect(response.data).toHaveProperty('balance');
            expect(typeof response.data.balance).toBe('number');
        });
    });

    describe('Authentication', () => {
        it('should require authentication', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody()),
            });

            expect(response.status).toBe(401);
        });
    });
});

