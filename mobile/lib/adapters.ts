/**
 * Type Adapters
 * Convert API response types to mobile app types
 */

import { Flat, Payment, Resident } from '@/types';

// API Response Types (matching database schema)
interface ApiFlat {
    flatId: number;
    flatNumber: string;
    floorNumber: number;
    bedrooms?: number;
    bathrooms?: number;
    totalArea?: string;
    balcony?: boolean;
    status?: string;
    monthlyRent?: string;
    monthlyMaintenanceCharge?: string;
    createdAt: string;
    updatedAt: string;
    residents?: ApiResident[];
    payments?: ApiPayment[];
}

interface ApiResident {
    residentId: number;
    flatId: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    leaseStartDate: string;
    leaseEndDate?: string;
    isPrimaryTenant?: boolean;
    createdAt: string;
    updatedAt: string;
    flat?: ApiFlat;
}

interface ApiPayment {
    paymentId: number;
    flatId: number;
    residentId: number;
    paymentType?: string;
    amount: string;
    paymentDate: string;
    dueDate?: string;
    status?: string;
    paymentMethod?: string;
    referenceNumber?: string;
    receiptUrl?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    flat?: ApiFlat;
    resident?: ApiResident;
}

/**
 * Convert API Flat to Mobile Flat
 */
export function adaptFlat(apiFlat: ApiFlat): Flat {
    return {
        id: apiFlat.flatId.toString(),
        floor: apiFlat.floorNumber,
        flatNumber: apiFlat.flatNumber,
        isOccupied: apiFlat.status === 'occupied' || !!(apiFlat.residents && apiFlat.residents.length > 0),
        createdAt: apiFlat.createdAt,
        updatedAt: apiFlat.updatedAt,
    };
}

/**
 * Convert API Resident to Mobile Resident
 */
export function adaptResident(apiResident: ApiResident): Resident {
    return {
        id: apiResident.residentId.toString(),
        name: `${apiResident.firstName} ${apiResident.lastName}`,
        phone: apiResident.phone || '',
        email: apiResident.email,
        type: apiResident.isPrimaryTenant ? 'owner' : 'tenant',
        flatId: apiResident.flatId.toString(),
        createdAt: apiResident.createdAt,
        updatedAt: apiResident.updatedAt,
    };
}

/**
 * Convert API Payment to Mobile Payment
 */
export function adaptPayment(apiPayment: ApiPayment): Payment {
    // Extract month from paymentDate (YYYY-MM-DD format)
    const paymentDate = new Date(apiPayment.paymentDate);
    const month = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;

    // Map paymentType to mobile payment type
    const type = apiPayment.paymentType === 'payout' ? 'payout' : 'maintenance';

    // Map status
    const status = apiPayment.status === 'paid' ? 'paid' :
        apiPayment.status === 'overdue' ? 'overdue' :
            'pending';

    return {
        id: apiPayment.paymentId.toString(),
        residentId: apiPayment.residentId.toString(),
        flatId: apiPayment.flatId.toString(),
        amount: parseFloat(apiPayment.amount),
        type,
        month,
        status,
        paidAt: apiPayment.status === 'paid' ? apiPayment.paymentDate : undefined,
        createdAt: apiPayment.createdAt,
        updatedAt: apiPayment.updatedAt,
    };
}

/**
 * Convert array of API Flats to Mobile Flats
 */
export function adaptFlats(apiFlats: ApiFlat[]): Flat[] {
    return apiFlats.map(adaptFlat);
}

/**
 * Convert array of API Residents to Mobile Residents
 */
export function adaptResidents(apiResidents: ApiResident[]): Resident[] {
    return apiResidents.map(adaptResident);
}

/**
 * Convert array of API Payments to Mobile Payments
 */
export function adaptPayments(apiPayments: ApiPayment[]): Payment[] {
    return apiPayments.map(adaptPayment);
}

