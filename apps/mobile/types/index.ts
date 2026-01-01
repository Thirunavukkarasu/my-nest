export type ResidentType = 'owner' | 'tenant';

export interface Flat {
  id: string;
  floor: number;
  flatNumber: string;
  residentId?: string;
  isOccupied: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Resident {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: ResidentType;
  flatId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  residentId: string;
  flatId: string;
  amount: number;
  type: 'maintenance' | 'payout';
  month: string; // Format: YYYY-MM
  status: 'pending' | 'paid' | 'overdue';
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  id: string;
  residentId: string;
  flatId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Complaint {
  id: string;
  residentId: string;
  flatId: string;
  title: string;
  description: string;
  status: 'open' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'owners' | 'tenants' | 'specific-flats';
  targetFlatIds?: string[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

