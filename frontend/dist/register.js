// Controls the register page: form validation, live password hints, eye toggle.
import { Validator } from './utils/validator.js';
import { AuthApi } from './api/auth.api.js';
import { AuthService } from './services/auth.service.js';
class RegisterController {
    constructor() {
        this.form = document.getElementById('register-form');
        this.banner = document.getElementById('register-banner');
        this.submitBtn = document.getElementById('register-btn');
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
        // Update the password strength hints as the user types
        const passwordInput = this.form.querySelector('[name="password"]');
        passwordInput?.addEventListener('input', () => this.updatePasswordHints(passwordInput.value));
        // Show / hide password when eye icon is clicked
        this.form.querySelectorAll('.eye-btn').forEach((btn) => {
            btn.addEventListener('click', () => this.togglePassword(btn));
        });
    }
    async handleSubmit(e) {
        e.preventDefault();
        const data = this.collectFormData();
        const { valid, errors } = this.validator.validateRegister(data);
        if (!valid) {
            this.showFieldErrors(errors);
            return;
        }
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
    updatePasswordHints(password) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>_\-]/.test(password),
        };
        Object.entries(checks).forEach(([key, met]) => {
            this.form.querySelector(`[data-hint="${key}"]`)?.classList.toggle('met', met);
        });
    }
    validateSingleField(input) {
        const { errors } = this.validator.validateRegister(this.collectFormData());
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
    collectFormData() {
        const fd = new FormData(this.form);
        return {
            first_name: fd.get('first_name')?.trim(),
            last_name: fd.get('last_name')?.trim(),
            email: fd.get('email')?.trim(),
            password: fd.get('password'),
            confirm_password: fd.get('confirm_password'),
            terms: fd.get('terms') === 'on',
        };
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
        this.submitBtn.textContent = loading ? 'Creating account…' : 'Create Account';
    }
    // Temporary until backend is connected
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
document.addEventListener('DOMContentLoaded', () => new RegisterController());
