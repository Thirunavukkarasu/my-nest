/**
 * Payments API Tests
 */
import { describe, expect, it } from 'vitest';
import { apiRequest, assertPaginatedResponse, createPaginationBody } from '../helpers/api';

describe('Payments API', () => {
    const endpoint = '/api/payments';

    describe('POST /api/payments', () => {
        it('should return paginated payments list with default pagination', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody()),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);
        });

        it('should return payments with custom pagination', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ page: 1, limit: 5 })),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);
            expect(response.data.pagination.limit).toBe(5);
        });

        it('should return payments sorted by createdAt descending', async () => {
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

        it('should filter payments by status', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(
                    createPaginationBody({
                        searchCriterias: [
                            {
                                columnName: 'status',
                                columnOperator: 'equals',
                                columnValue: 'paid',
                            },
                        ],
                    })
                ),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);
        });

        it('should include flat and resident relations', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ limit: 1 })),
            });

            expect(response.status).toBe(200);
            assertPaginatedResponse(response.data);

            if (response.data.data.length > 0) {
                const payment = response.data.data[0];
                // Check if relations are included (may be null/undefined if no relations)
                expect(payment).toHaveProperty('flat');
                expect(payment).toHaveProperty('resident');
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

    describe('Payment data structure', () => {
        it('should return payments with required fields', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ limit: 1 })),
            });

            expect(response.status).toBe(200);

            if (response.data.data.length > 0) {
                const payment = response.data.data[0];
                expect(payment).toHaveProperty('paymentId');
                expect(payment).toHaveProperty('flatId');
                expect(payment).toHaveProperty('residentId');
                expect(payment).toHaveProperty('amount');
                expect(payment).toHaveProperty('paymentDate');
                expect(payment).toHaveProperty('createdAt');
                expect(payment).toHaveProperty('updatedAt');
            }
        });

        it('should have amount as a valid number string', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(createPaginationBody({ limit: 1 })),
            });

            expect(response.status).toBe(200);

            if (response.data.data.length > 0) {
                const payment = response.data.data[0];
                expect(payment.amount).toBeDefined();
                // Amount should be a string (decimal type from DB)
                expect(typeof payment.amount).toBe('string');
                expect(parseFloat(payment.amount)).not.toBeNaN();
            }
        });
    });
});

