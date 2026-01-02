/**
 * API Client Service
 * Handles all API communication with the backend
 */

import { storage } from './storage';

// Base URL should not include /api since we add it in each endpoint
// In Expo, environment variables prefixed with EXPO_PUBLIC_ are available at build time
// @ts-ignore - Expo injects process.env at build time
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://my-nest-api22.vercel.app';

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
    private tokenLoaded: boolean = false;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async loadToken() {
        if (this.tokenLoaded) return;
        const token = await storage.getToken();
        if (token) {
            this.authToken = token;
        }
        this.tokenLoaded = true;
    }

    setAuthToken(token: string | null) {
        this.authToken = token;
        if (token) {
            storage.setToken(token);
        } else {
            storage.removeToken();
        }
    }

    async clearAuth() {
        this.authToken = null;
        await storage.clearAuth();
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            // Ensure token is loaded before making request
            await this.loadToken();

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
        return this.request<PaginatedResponse<any>>('/api/flats', {
            method: 'POST',
            body: JSON.stringify({
                page: params.page || 1,
                limit: params.limit || 10,
                searchCriterias: params.searchCriterias || [],
                sortCriterias: params.sortCriterias || [],
            }),
        });
    }

    async createFlat(flatData: any): Promise<ApiResponse<any>> {
        return this.request('/api/flats/mutate', {
            method: 'POST',
            body: JSON.stringify(flatData),
        });
    }

    async updateFlat(flatId: number, flatData: any): Promise<ApiResponse<any>> {
        return this.request('/api/flats/mutate', {
            method: 'PUT',
            body: JSON.stringify({ flatId, ...flatData }),
        });
    }

    async deleteFlat(flatId: number): Promise<ApiResponse<any>> {
        return this.request(`/api/flats/mutate/${flatId}`, {
            method: 'DELETE',
        });
    }

    // Residents API
    async getResidents(params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
        return this.request<PaginatedResponse<any>>('/api/residents', {
            method: 'POST',
            body: JSON.stringify({
                page: params.page || 1,
                limit: params.limit || 10,
                searchCriterias: params.searchCriterias || [],
                sortCriterias: params.sortCriterias || [],
            }),
        });
    }

    async createResident(residentData: any): Promise<ApiResponse<any>> {
        return this.request('/api/residents/mutate', {
            method: 'POST',
            body: JSON.stringify(residentData),
        });
    }

    async updateResident(residentId: number, residentData: any): Promise<ApiResponse<any>> {
        return this.request('/api/residents/mutate', {
            method: 'PUT',
            body: JSON.stringify({ residentId, ...residentData }),
        });
    }

    async deleteResident(residentId: number): Promise<ApiResponse<any>> {
        return this.request(`/api/residents/mutate/${residentId}`, {
            method: 'DELETE',
        });
    }

    // Payments API
    async getPayments(params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
        return this.request<PaginatedResponse<any>>('/api/payments', {
            method: 'POST',
            body: JSON.stringify({
                page: params.page || 1,
                limit: params.limit || 10,
                searchCriterias: params.searchCriterias || [],
                sortCriterias: params.sortCriterias || [],
            }),
        });
    }

    async createPayment(paymentData: any): Promise<ApiResponse<any>> {
        return this.request('/api/payments/mutate', {
            method: 'POST',
            body: JSON.stringify(paymentData),
        });
    }

    async updatePayment(paymentId: number, paymentData: any): Promise<ApiResponse<any>> {
        return this.request('/api/payments/mutate', {
            method: 'PUT',
            body: JSON.stringify({ paymentId, ...paymentData }),
        });
    }

    async deletePayment(paymentId: number): Promise<ApiResponse<any>> {
        return this.request(`/api/payments/mutate/${paymentId}`, {
            method: 'DELETE',
        });
    }

    // Expenses API
    async getExpenses(params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
        return this.request<PaginatedResponse<any>>('/api/expenses', {
            method: 'POST',
            body: JSON.stringify({
                page: params.page || 1,
                limit: params.limit || 10,
                searchCriterias: params.searchCriterias || [],
                sortCriterias: params.sortCriterias || [],
            }),
        });
    }

    // Transaction History API
    async getTransactionHistory(params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
        return this.request<PaginatedResponse<any>>('/api/transaction-history', {
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
    async register(name: string, email: string, password: string): Promise<ApiResponse<any>> {
        return this.request('/api/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
    }

    async login(email: string, password: string): Promise<ApiResponse<any>> {
        return this.request('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }
}

export const apiClient = new ApiClient();
export type { PaginationParams, SearchCriteria, SortCriteria };

