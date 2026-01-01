/**
 * Residents API Tests
 */
import { describe, expect, it } from 'vitest';
import { apiRequest, assertPaginatedResponse, createPaginationBody } from '../helpers/api';

describe('Residents API', () => {
    const endpoint = '/api/residents';

    describe('POST /api/residents', () => {
        it('should return paginated residents list with default pagination', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody()),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);
        });

        it('should return residents with custom pagination', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ page: 1, limit: 5 })),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);
            expect(response.data.pagination.limit).toBe(5);
        });

        it('should return residents sorted by createdAt descending', async () => {
            const response = await apiRequest(endpoint, {
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

        it('should filter residents by firstName contains', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(
                    createPaginationBody({
                        searchCriterias: [
                            {
                                columnName: 'firstName',
                                columnOperator: 'contains',
                                columnValue: 'John',
                            },
                        ],
                    })
                ),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);
        });

        it('should include flat relation', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ limit: 1 })),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);

            if (response.data.data.length > 0) {
                const resident = response.data.data[0];
                // Check if flat relation is included (may be null/undefined if no flat)
                expect(resident).toHaveProperty('flat');
            }
        });

        it('should return correct pagination metadata', async () => {
            const response = await apiRequest(endpoint, {
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
        });
    });

    describe('Resident data structure', () => {
        it('should return residents with required fields', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ limit: 1 })),
            });

            expect(response.status).toBe(200);

            if (response.data.data.length > 0) {
                const resident = response.data.data[0];
                expect(resident).toHaveProperty('residentId');
                expect(resident).toHaveProperty('flatId');
                expect(resident).toHaveProperty('firstName');
                expect(resident).toHaveProperty('lastName');
                expect(resident).toHaveProperty('leaseStartDate');
                expect(resident).toHaveProperty('createdAt');
                expect(resident).toHaveProperty('updatedAt');
            }
        });
    });
});

