/**
 * API Test Helpers
 * Utilities for testing API endpoints
 */

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000';

export interface ApiTestResponse<T = any> {
    status: number;
    data: T;
    headers: Headers;
}

/**
 * Make a test API request
 */
export async function apiRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiTestResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => ({}));

    return {
        status: response.status,
        data,
        headers: response.headers,
    };
}

/**
 * Test pagination parameters
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    searchCriterias?: Array<{
        columnName: string;
        columnOperator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
        columnValue: string;
    }>;
    sortCriterias?: Array<{
        columnName: string;
        columnOrder: 'asc' | 'desc';
    }>;
}

/**
 * Create pagination request body
 */
export function createPaginationBody(params: PaginationParams = {}) {
    return {
        page: params.page || 1,
        limit: params.limit || 10,
        searchCriterias: params.searchCriterias || [],
        sortCriterias: params.sortCriterias || [],
    };
}

/**
 * Assert API response structure
 */
export function assertPaginatedResponse(response: any) {
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('pagination');
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.pagination).toHaveProperty('page');
    expect(response.pagination).toHaveProperty('limit');
    expect(response.pagination).toHaveProperty('total');
    expect(response.pagination).toHaveProperty('totalPages');
}

/**
 * Assert error response structure
 */
export function assertErrorResponse(response: any) {
    expect(response).toHaveProperty('error');
    expect(response).toHaveProperty('message');
}

