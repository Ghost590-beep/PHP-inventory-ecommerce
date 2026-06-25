// Controls the login page: form validation, password toggle, error display.

import { Validator } from './utils/validator.js';
import { AuthApi }   from './api/auth.api.js';
import { AuthService } from './services/auth.service.js';

class LoginController {

  private readonly form:      HTMLFormElement;
  private readonly banner:    HTMLElement;
  private readonly submitBtn: HTMLButtonElement;
  private readonly validator: Validator;
  private readonly service:   AuthService;

  constructor() {
    this.form      = document.getElementById('login-form')  as HTMLFormElement;
    this.banner    = document.getElementById('login-banner') as HTMLElement;
    this.submitBtn = document.getElementById('login-btn')   as HTMLButtonElement;

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

    // Show / hide password when eye icon is clicked
    this.form.querySelectorAll<HTMLButtonElement>('.eye-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.togglePassword(btn));
    });
  }

  private async handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    const email    = this.getInputValue('email');
    const password = this.getInputValue('password');

    const { valid, errors } = this.validator.validateLogin({ email, password });
    if (!valid) { this.showFieldErrors(errors); return; }

    this.setLoading(true);
    this.clearErrors();
    this.hideBanner();

    // NOTE: backend not connected yet — replace this block with the real API call below.
    // const result = await this.service.login(email, password);
    // if (result.success) {
    //   this.showBanner('Login successful! Redirecting…', 'success');
    //   setTimeout(() => (window.location.href = '../index.html'), 1500);
    // } else {
    //   if (result.errors) this.showFieldErrors(result.errors);
    //   else this.showBanner(result.message, 'error');
    //   this.setLoading(false);
    // }
    await this.delay(800);
    this.showBanner('Login successful! Redirecting…', 'success');
    setTimeout(() => (window.location.href = '../index.html'), 1500);

    this.setLoading(false);
  }

  private validateSingleField(input: HTMLInputElement): void {
    const email    = this.getInputValue('email');
    const password = this.getInputValue('password');
    const { errors } = this.validator.validateLogin({ email, password });

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
    this.submitBtn.textContent = loading ? 'Signing in…' : 'Sign In';
  }

  private getInputValue(name: string): string {
    return (this.form.querySelector<HTMLInputElement>(`[name="${name}"]`)?.value ?? '').trim();
  }

  // Temporary until backend is connected
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

document.addEventListener('DOMContentLoaded', () => new LoginController());
