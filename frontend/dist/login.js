// Controls the login page: form validation, password toggle, error display.
import { Validator } from './utils/validator.js';
import { AuthApi } from './api/auth.api.js';
import { AuthService } from './services/auth.service.js';
class LoginController {
    constructor() {
        this.form = document.getElementById('login-form');
        this.banner = document.getElementById('login-banner');
        this.submitBtn = document.getElementById('login-btn');
        this.validator = new Validator();
        this.service = new AuthService(AuthApi.getInstance());
        this.bindEvents();
    }
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        // Validate each field when the user leaves it (on blur)
        this.form.querySelectorAll('input[name]').forEach((input) => {
            input.addEventListener('blur', () => this.validateSingleField(input));
        });
        // Show / hide password when eye icon is clicked
        this.form.querySelectorAll('.eye-btn').forEach((btn) => {
            btn.addEventListener('click', () => this.togglePassword(btn));
        });
    }
    async handleSubmit(e) {
        e.preventDefault();
        const email = this.getInputValue('email');
        const password = this.getInputValue('password');
        const { valid, errors } = this.validator.validateLogin({ email, password });
        if (!valid) {
            this.showFieldErrors(errors);
            return;
        }
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
    validateSingleField(input) {
        const email = this.getInputValue('email');
        const password = this.getInputValue('password');
        const { errors } = this.validator.validateLogin({ email, password });
        errors[input.name]
            ? this.setFieldError(input.name, errors[input.name])
            : this.clearFieldError(input.name);
    }
    togglePassword(btn) {
        const input = document.getElementById(btn.dataset['target'] ?? '');
        if (!input)
            return;
        const hiding = input.type === 'password';
        input.type = hiding ? 'text' : 'password';
        btn.setAttribute('aria-label', hiding ? 'Hide password' : 'Show password');
    }
    showBanner(message, type) {
        this.banner.textContent = message;
        this.banner.className = `banner banner--${type}`;
    }
    hideBanner() {
        this.banner.className = 'banner';
        this.banner.textContent = '';
    }
    showFieldErrors(errors) {
        Object.entries(errors).forEach(([field, msg]) => this.setFieldError(field, msg));
    }
    setFieldError(field, message) {
        this.form.querySelector(`[name="${field}"]`)?.classList.add('is-error');
        const el = this.form.querySelector(`[data-error="${field}"]`);
        if (el)
            el.textContent = message;
    }
    clearFieldError(field) {
        this.form.querySelector(`[name="${field}"]`)?.classList.remove('is-error');
        const el = this.form.querySelector(`[data-error="${field}"]`);
        if (el)
            el.textContent = '';
    }
    clearErrors() {
        this.form.querySelectorAll('.is-error').forEach((el) => el.classList.remove('is-error'));
        this.form.querySelectorAll('[data-error]').forEach((el) => (el.textContent = ''));
    }
    setLoading(loading) {
        this.submitBtn.disabled = loading;
        this.submitBtn.textContent = loading ? 'Signing in…' : 'Sign In';
    }
    getInputValue(name) {
        return (this.form.querySelector(`[name="${name}"]`)?.value ?? '').trim();
    }
    // Temporary until backend is connected
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
document.addEventListener('DOMContentLoaded', () => new LoginController());
