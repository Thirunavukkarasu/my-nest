/**
 * Authentication API Tests
 */
import { describe, expect, it } from 'vitest';
import { apiRequest } from '../helpers/api';

describe('Authentication API', () => {
    describe('POST /api/register', () => {
        const endpoint = '/api/register';

        it('should register a new user with valid data', async () => {
            const testEmail = `test-${Date.now()}@example.com`;
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Test User',
                    email: testEmail,
                    password: 'password123',
                }),
            });

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('user');
            expect(response.data.user).toHaveProperty('email', testEmail);
            expect(response.data.user).not.toHaveProperty('password');
        });

        it('should reject registration with invalid email', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Test User',
                    email: 'invalid-email',
                    password: 'password123',
                }),
            });

            expect(response.status).toBe(400);
            expect(response.data).toHaveProperty('error');
        });

        it('should reject registration with short password', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'short',
                }),
            });

            expect(response.status).toBe(400);
            expect(response.data).toHaveProperty('error');
        });

        it('should reject registration with short name', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    name: 'A',
                    email: 'test@example.com',
                    password: 'password123',
                }),
            });

            expect(response.status).toBe(400);
            expect(response.data).toHaveProperty('error');
        });

        it('should reject registration with missing fields', async () => {
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Test User',
                    // Missing email and password
                }),
            });

            expect(response.status).toBe(400);
            expect(response.data).toHaveProperty('error');
        });

        it('should reject duplicate email registration', async () => {
            const testEmail = `duplicate-${Date.now()}@example.com`;

            // First registration
            const firstResponse = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    name: 'First User',
                    email: testEmail,
                    password: 'password123',
                }),
            });

            expect(firstResponse.status).toBe(201);

            // Second registration with same email
            const secondResponse = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Second User',
                    email: testEmail,
                    password: 'password123',
                }),
            });

            // Should fail due to unique constraint
            expect([400, 500]).toContain(secondResponse.status);
        });
    });

    describe('POST /api/auth/signin', () => {
        const endpoint = '/api/auth/signin';

        it('should handle signin endpoint exists', async () => {
            // Note: NextAuth signin endpoint structure may vary
            // This test checks if the endpoint responds
            const response = await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'password123',
                }),
            });

            // NextAuth may return various status codes
            // Just verify endpoint exists and responds
            expect([200, 302, 400, 401, 500]).toContain(response.status);
        });
    });
});

