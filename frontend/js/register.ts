// Controls the register page: form validation, live password hints, eye toggle.

import { Validator, type RegisterData } from './utils/validator.js';
import { AuthApi }   from './api/auth.api.js';
import { AuthService } from './services/auth.service.js';

class RegisterController {

  private readonly form:      HTMLFormElement;
  private readonly banner:    HTMLElement;
  private readonly submitBtn: HTMLButtonElement;
  private readonly validator: Validator;
  private readonly service:   AuthService;

  constructor() {
    this.form      = document.getElementById('register-form')   as HTMLFormElement;
    this.banner    = document.getElementById('register-banner') as HTMLElement;
    this.submitBtn = document.getElementById('register-btn')    as HTMLButtonElement;

    this.validator = new Validator();
    this.service   = new AuthService(AuthApi.getInstance());

    this.bindEvents();
  }

  private bindEvents(): void {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Validate each field when the user leaves it (on blur)
    this.form.querySelectorAll<HTMLInputElement>('input[name]').forEach((input) => {
      input.addEventListener('blur', () => this.validateSingleField(input));
    });

    // Update the password strength hints as the user types
    const passwordInput = this.form.querySelector<HTMLInputElement>('[name="password"]');
    passwordInput?.addEventListener('input', () => this.updatePasswordHints(passwordInput.value));

    // Show / hide password when eye icon is clicked
    this.form.querySelectorAll<HTMLButtonElement>('.eye-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.togglePassword(btn));
    });
  }

  private async handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    const data = this.collectFormData();
    const { valid, errors } = this.validator.validateRegister(data);
    if (!valid) { this.showFieldErrors(errors); return; }

    this.setLoading(true);
    this.clearErrors();
    this.hideBanner();

    // NOTE: backend not connected yet — replace this block with the real API call below.
    // const result = await this.service.register({
    //   first_name: data.first_name!,
    //   last_name:  data.last_name!,
    //   email:      data.email!,
    //   password:   data.password!,
    // });
    // if (result.success) {
    //   this.showBanner('Account created! Redirecting to login…', 'success');
    //   setTimeout(() => (window.location.href = 'login.html'), 1800);
    // } else {
    //   if (result.errors) this.showFieldErrors(result.errors);
    //   else this.showBanner(result.message, 'error');
    //   this.setLoading(false);
    // }
    await this.delay(900);
    this.showBanner('Account created! Redirecting to login…', 'success');
    setTimeout(() => (window.location.href = 'login.html'), 1800);

    this.setLoading(false);
  }

  // Turns each hint green when the password meets that rule
  private updatePasswordHints(password: string): void {
    const checks: Record<string, boolean> = {
      length:    password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number:    /\d/.test(password),
      special:   /[!@#$%^&*(),.?":{}|<>_\-]/.test(password),
    };

    Object.entries(checks).forEach(([key, met]) => {
      this.form.querySelector<HTMLElement>(`[data-hint="${key}"]`)?.classList.toggle('met', met);
    });
  }

  private validateSingleField(input: HTMLInputElement): void {
    const { errors } = this.validator.validateRegister(this.collectFormData());

    errors[input.name]
      ? this.setFieldError(input.name, errors[input.name])
      : this.clearFieldError(input.name);
  }

  private togglePassword(btn: HTMLButtonElement): void {
    const input = document.getElementById(btn.dataset['target'] ?? '') as HTMLInputElement | null;
    if (!input) return;

    const hiding = input.type === 'password';
    input.type = hiding ? 'text' : 'password';
    btn.setAttribute('aria-label', hiding ? 'Hide password' : 'Show password');
  }

  private collectFormData(): Partial<RegisterData> {
    const fd = new FormData(this.form);
    return {
      first_name:       (fd.get('first_name')       as string)?.trim(),
      last_name:        (fd.get('last_name')         as string)?.trim(),
      email:            (fd.get('email')             as string)?.trim(),
      password:         fd.get('password')           as string,
      confirm_password: fd.get('confirm_password')   as string,
      terms:            fd.get('terms') === 'on',
    };
  }

  private showBanner(message: string, type: 'success' | 'error'): void {
    this.banner.textContent = message;
    this.banner.className   = `banner banner--${type}`;
  }

  private hideBanner(): void {
    this.banner.className   = 'banner';
    this.banner.textContent = '';
  }

  private showFieldErrors(errors: Record<string, string>): void {
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

  private clearErrors(): void {
    this.form.querySelectorAll('.is-error').forEach((el) => el.classList.remove('is-error'));
    this.form.querySelectorAll<HTMLElement>('[data-error]').forEach((el) => (el.textContent = ''));
  }

  private setLoading(loading: boolean): void {
    this.submitBtn.disabled    = loading;
    this.submitBtn.textContent = loading ? 'Creating account…' : 'Create Account';
  }

  // Temporary until backend is connected
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

document.addEventListener('DOMContentLoaded', () => new RegisterController());
