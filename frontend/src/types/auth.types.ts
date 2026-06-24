export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  contact_number?: string;
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export interface AuthData {
  token: string;
  user: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
