// Sits between the UI and the API. Saves the token and returns a simple result object.

import { AuthApi, type ApiResponse, type AuthTokenData } from '../api/auth.api.js';
import { Storage } from '../utils/storage.js';

export interface ServiceResult {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export class AuthService {

  constructor(private readonly api: AuthApi) {}

  async login(email: string, password: string): Promise<ServiceResult> {
    try {
      const result: ApiResponse<AuthTokenData> = await this.api.login(email, password);

      if (result.status === 'success' && result.data) {
        Storage.set('auth_token', result.data.token);
        Storage.set('auth_user',  result.data.user);
        return { success: true, message: 'Login successful!' };
      }

      return { success: false, message: result.message || 'Login failed.', errors: result.errors };
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  }

  async register(payload: {
    first_name: string;
    last_name:  string;
    email:      string;
    password:   string;
  }): Promise<ServiceResult> {
    try {
      const result: ApiResponse<AuthTokenData> = await this.api.register(payload);

      if (result.status === 'success' && result.data) {
        Storage.set('auth_token', result.data.token);
        Storage.set('auth_user',  result.data.user);
        return { success: true, message: 'Account created successfully!' };
      }

      return { success: false, message: result.message || 'Registration failed.', errors: result.errors };
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  }

  logout(): void {
    Storage.remove('auth_token');
    Storage.remove('auth_user');
  }

  isLoggedIn(): boolean {
    return Storage.get<string>('auth_token') !== null;
  }
}
