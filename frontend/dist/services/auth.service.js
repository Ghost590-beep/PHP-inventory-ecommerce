// Sits between the UI and the API. Saves the token and returns a simple result object.
import { Storage } from '../utils/storage.js';
export class AuthService {
    constructor(api) {
        this.api = api;
    }
    async login(email, password) {
        try {
            const result = await this.api.login(email, password);
            if (result.status === 'success' && result.data) {
                Storage.set('auth_token', result.data.token);
                Storage.set('auth_user', result.data.user);
                return { success: true, message: 'Login successful!' };
            }
            return { success: false, message: result.message || 'Login failed.', errors: result.errors };
        }
        catch {
            return { success: false, message: 'Network error. Please check your connection.' };
        }
    }
    async register(payload) {
        try {
            const result = await this.api.register(payload);
            if (result.status === 'success' && result.data) {
                Storage.set('auth_token', result.data.token);
                Storage.set('auth_user', result.data.user);
                return { success: true, message: 'Account created successfully!' };
            }
            return { success: false, message: result.message || 'Registration failed.', errors: result.errors };
        }
        catch {
            return { success: false, message: 'Network error. Please check your connection.' };
        }
    }
    logout() {
        Storage.remove('auth_token');
        Storage.remove('auth_user');
    }
    isLoggedIn() {
        return Storage.get('auth_token') !== null;
    }
}
