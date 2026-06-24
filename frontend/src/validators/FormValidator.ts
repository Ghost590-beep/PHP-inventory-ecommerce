import type { RegisterPayload, ValidationResult } from '../types/auth.types.js';

// SRP: only responsible for validating form input.
export class FormValidator {

  validateRegister(data: Partial<RegisterPayload>): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.first_name?.trim()) {
      errors['first_name'] = 'First name is required.';
    }

    if (!data.last_name?.trim()) {
      errors['last_name'] = 'Last name is required.';
    }

    if (!data.email?.trim() || !this.isValidEmail(data.email)) {
      errors['email'] = 'A valid email address is required.';
    }

    if (!data.password || data.password.length < 8) {
      errors['password'] = 'Password must be at least 8 characters.';
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
