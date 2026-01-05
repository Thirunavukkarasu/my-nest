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

/**
 * Get auth token for authenticated requests
 */
export async function getAuthToken(email: string, password: string): Promise<string | null> {
    try {
        const response = await apiRequest('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.status === 200 && response.data.token) {
            return response.data.token;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Ensure test user exists and get auth token
 * Creates the user if it doesn't exist, then logs in
 */
export async function ensureTestUserAndGetToken(
    email: string = 'test@example.com',
    password: string = 'password123',
    name: string = 'Test User'
): Promise<string | null> {
    try {
        // Try to login first
        let token = await getAuthToken(email, password);

        if (token) {
            return token;
        }

        // If login fails, try to register the user
        const registerResponse = await apiRequest('/api/register', {
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        });

        // If registration succeeds or user already exists, try login again
        if (registerResponse.status === 201 || registerResponse.status === 409) {
            // Small delay to ensure user is created/available
            await new Promise(resolve => setTimeout(resolve, 100));
            token = await getAuthToken(email, password);
            return token;
        }

        return null;
    } catch (error) {
        console.error('Error ensuring test user:', error);
        return null;
    }
}

/**
 * Make authenticated API request
 */
export async function authenticatedRequest<T = any>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
): Promise<ApiTestResponse<T>> {
    return apiRequest<T>(endpoint, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });
}

