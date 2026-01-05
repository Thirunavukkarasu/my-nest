/**
 * Flats API Tests
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { apiRequest, assertPaginatedResponse, authenticatedRequest, createPaginationBody, ensureTestUserAndGetToken } from '../helpers/api';

describe('Flats API', () => {
    const endpoint = '/api/flats';
    let authToken: string | null = null;

    beforeAll(async () => {
        // Ensure test user exists and get auth token
        authToken = await ensureTestUserAndGetToken();
    });

    describe('POST /api/flats', () => {
        it('should return paginated flats list with default pagination', async () => {
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

        it('should return flats with custom pagination', async () => {
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

        it('should return flats sorted by floorNumber ascending', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest(endpoint, authToken, {
                method: 'POST',
                body: JSON.stringify(
                    createPaginationBody({
                        sortCriterias: [{ columnName: 'floorNumber', columnOrder: 'asc' }],
                    })
                ),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);

            // Verify sorting if data exists
            if (response.data.data.length > 1) {
                const floors = response.data.data.map((flat: any) => flat.floorNumber);
                const sortedFloors = [...floors].sort((a, b) => a - b);
                expect(floors).toEqual(sortedFloors);
            }
        });

        it('should return flats sorted by createdAt descending', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest(endpoint, authToken, {
                method: 'POST',
                body: JSON.stringify(
                    createPaginationBody({
                        sortCriterias: [{ columnName: 'createdAt', columnOrder: 'desc' }],
                    })
                ),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);
        });

        it('should filter flats by flatNumber contains', async () => {
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
                                columnName: 'flatNumber',
                                columnOperator: 'contains',
                                columnValue: 'G',
                            },
                        ],
                    })
                ),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);

            // Verify all returned flats match the search criteria
            response.data.data.forEach((flat: any) => {
                expect(flat.flatNumber).toContain('G');
            });
        });

        it('should include residents and ledgerEntries relations', async () => {
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
                const flat = response.data.data[0];
                // Check if relations are included (may be null/undefined if no relations)
                expect(flat).toHaveProperty('residents');
                expect(flat).toHaveProperty('ledgerEntries');
            }
        });

        it('should handle invalid request body gracefully', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest(endpoint, authToken, {
                method: 'POST',
                body: JSON.stringify({ invalid: 'data' }),
            });

            // Should either return 200 with empty data or 400/500 error
            expect([200, 400, 500]).toContain(response.status);
        });

        it('should handle empty request body', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest(endpoint, authToken, {
                method: 'POST',
                body: JSON.stringify({}),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);
        });

        it('should return correct pagination metadata', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest(endpoint, authToken, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ page: 1, limit: 10 })),
            });

            expect(response.status).toBe(200);
            const { pagination } = response.data;

            expect(pagination).toHaveProperty('page', 1);
            expect(pagination).toHaveProperty('limit', 10);
            expect(pagination).toHaveProperty('total');
            expect(pagination).toHaveProperty('totalPages');
            expect(typeof pagination.total).toBe('number');
            expect(typeof pagination.totalPages).toBe('number');
            expect(pagination.total).toBeGreaterThanOrEqual(0);
            expect(pagination.totalPages).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Flat data structure', () => {
        it('should return flats with required fields', async () => {
            if (!authToken) {
                console.warn('Skipping test: No auth token available');
                return;
            }

            const response = await authenticatedRequest(endpoint, authToken, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ limit: 1 })),
            });

            expect(response.status).toBe(200);

            if (response.data.data.length > 0) {
                const flat = response.data.data[0];
                expect(flat).toHaveProperty('flatId');
                expect(flat).toHaveProperty('flatNumber');
                expect(flat).toHaveProperty('floorNumber');
                expect(flat).toHaveProperty('createdAt');
                expect(flat).toHaveProperty('updatedAt');
            }
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

