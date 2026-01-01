// Shared types between web and mobile apps

// Add shared types here
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

