/**
 * API Client Service
 * Handles all API communication with the backend
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface SearchCriteria {
    columnName: string;
    columnOperator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
    columnValue: string;
}

interface SortCriteria {
    columnName: string;
    columnOrder: 'asc' | 'desc';
}

interface PaginationParams {
    page?: number;
    limit?: number;
    searchCriterias?: SearchCriteria[];
    sortCriterias?: SortCriteria[];
}

class ApiClient {
    private baseUrl: string;
    private authToken: string | null = null;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    setAuthToken(token: string | null) {
        this.authToken = token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(options.headers as Record<string, string> || {}),
            };

            if (this.authToken) {
                headers['Authorization'] = `Bearer ${this.authToken}`;
            }

            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    error: errorData.message || errorData.error || `HTTP ${response.status}`,
                };
            }

            const data = await response.json();
            return { data };
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : 'Network error occurred',
            };
        }
    }

    // Flats API
    async getFlats(params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
        return this.request<PaginatedResponse<any>>('/flats', {
            method: 'POST',
            body: JSON.stringify({
                page: params.page || 1,
                limit: params.limit || 10,
                searchCriterias: params.searchCriterias || [],
                sortCriterias: params.sortCriterias || [],
            }),
        });
    }

    // Residents API
    async getResidents(params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
        return this.request<PaginatedResponse<any>>('/residents', {
            method: 'POST',
            body: JSON.stringify({
                page: params.page || 1,
                limit: params.limit || 10,
                searchCriterias: params.searchCriterias || [],
                sortCriterias: params.sortCriterias || [],
            }),
        });
    }

    // Payments API
    async getPayments(params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
        return this.request<PaginatedResponse<any>>('/payments', {
            method: 'POST',
            body: JSON.stringify({
                page: params.page || 1,
                limit: params.limit || 10,
                searchCriterias: params.searchCriterias || [],
                sortCriterias: params.sortCriterias || [],
            }),
        });
    }

    // Auth API
    async login(email: string, password: string): Promise<ApiResponse<any>> {
        // Note: NextAuth uses a different endpoint structure
        // We'll need to check the actual auth flow
        return this.request('/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(name: string, email: string, password: string): Promise<ApiResponse<any>> {
        return this.request('/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
    }
}

export const apiClient = new ApiClient();
export type { PaginationParams, SearchCriteria, SortCriteria };

