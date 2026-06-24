import type { RegisterPayload, ApiResponse, AuthData } from '../types/auth.types.js';

// SRP: only responsible for HTTP communication with the backend.
export class ApiService {

  constructor(private readonly baseUrl: string) {}

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthData>> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return response.json() as Promise<ApiResponse<AuthData>>;
  }
}
