import type { RegisterPayload } from '../types/auth.types.js';
import { FormValidator } from '../validators/FormValidator.js';
import { ApiService } from '../services/ApiService.js';

// SRP: orchestrates the registration form — binds events, delegates validation and API calls.
// OCP: validator and api are injected — swap implementations without touching this class.
export class RegisterForm {

  private readonly form: HTMLFormElement;

  constructor(
    formId: string,
    private readonly validator: FormValidator,
    private readonly api: ApiService,
  ) {
    this.form = document.getElementById(formId) as HTMLFormElement;
    this.bindEvents();
  }

  private bindEvents(): void {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Validate each field on blur for real-time feedback.
    this.form.querySelectorAll<HTMLInputElement>('input').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input.name));
    });

    // Toggle password visibility.
    document.getElementById('toggle-password')?.addEventListener('click', () => {
      this.togglePasswordVisibility();
    });
  }

  private async handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    const payload = this.collectFormData();
    const { valid, errors } = this.validator.validateRegister(payload);

    if (!valid) {
      this.showErrors(errors);
      return;
    }

    this.setLoading(true);
    this.clearAllErrors();

    try {
      const result = await this.api.register(payload as RegisterPayload);

      if (result.status === 'success' && result.data) {
        localStorage.setItem('token', result.data.token);
        this.showBanner('Account created! Redirecting...', 'success');
        setTimeout(() => (window.location.href = 'login.html'), 1500);
      } else {
        this.showErrors(result.errors ?? { general: result.message });
      }
    } catch {
      this.showErrors({ general: 'Network error. Please try again.' });
    } finally {
      this.setLoading(false);
    }
  }

  private validateField(name: string): void {
    const { errors } = this.validator.validateRegister(this.collectFormData());
    errors[name] ? this.setFieldError(name, errors[name]) : this.clearFieldError(name);
  }

  private collectFormData(): Partial<RegisterPayload> {
    const fd = new FormData(this.form);
    return {
      first_name:     (fd.get('first_name') as string)?.trim(),
      last_name:      (fd.get('last_name') as string)?.trim(),
      email:          (fd.get('email') as string)?.trim(),
      password:       fd.get('password') as string,
      contact_number: (fd.get('contact_number') as string)?.trim() || undefined,
    };
  }

  private showErrors(errors: Record<string, string>): void {
    Object.entries(errors).forEach(([field, msg]) => this.setFieldError(field, msg));
  }

  private setFieldError(field: string, message: string): void {
    this.form.querySelector<HTMLElement>(`[name="${field}"]`)?.classList.add('is-error');
    const el = this.form.querySelector<HTMLElement>(`[data-error="${field}"]`);
    if (el) el.textContent = message;
  }

  private clearFieldError(field: string): void {
    this.form.querySelector<HTMLElement>(`[name="${field}"]`)?.classList.remove('is-error');
    const el = this.form.querySelector<HTMLElement>(`[data-error="${field}"]`);
    if (el) el.textContent = '';
  }

  private clearAllErrors(): void {
    this.form.querySelectorAll<HTMLElement>('[data-error]').forEach(el => (el.textContent = ''));
    this.form.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));
  }

  private showBanner(message: string, type: 'success' | 'error'): void {
    const banner = document.getElementById('form-banner') as HTMLElement;
    banner.textContent = message;
    banner.className = `banner banner--${type}`;
    banner.style.display = 'block';
  }

  private setLoading(loading: boolean): void {
    const btn = this.form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    btn.disabled = loading;
    btn.textContent = loading ? 'Creating account…' : 'Create Account';
  }

  private togglePasswordVisibility(): void {
    const input = this.form.querySelector<HTMLInputElement>('[name="password"]')!;
    const icon  = document.getElementById('toggle-password') as HTMLElement;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    icon.textContent  = isHidden ? '🙈' : '👁';
  }
}
