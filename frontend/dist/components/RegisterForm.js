// SRP: orchestrates the registration form — binds events, delegates validation and API calls.
// OCP: validator and api are injected — swap implementations without touching this class.
export class RegisterForm {
    constructor(formId, validator, api) {
        this.validator = validator;
        this.api = api;
        this.form = document.getElementById(formId);
        this.bindEvents();
    }
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        // Validate each field on blur for real-time feedback.
        this.form.querySelectorAll('input').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input.name));
        });
        // Toggle password visibility.
        document.getElementById('toggle-password')?.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
    }
    async handleSubmit(e) {
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
            const result = await this.api.register(payload);
            if (result.status === 'success' && result.data) {
                localStorage.setItem('token', result.data.token);
                this.showBanner('Account created! Redirecting...', 'success');
                setTimeout(() => (window.location.href = 'login.html'), 1500);
            }
            else {
                this.showErrors(result.errors ?? { general: result.message });
            }
        }
        catch {
            this.showErrors({ general: 'Network error. Please try again.' });
        }
        finally {
            this.setLoading(false);
        }
    }
    validateField(name) {
        const { errors } = this.validator.validateRegister(this.collectFormData());
        errors[name] ? this.setFieldError(name, errors[name]) : this.clearFieldError(name);
    }
    collectFormData() {
        const fd = new FormData(this.form);
        return {
            first_name: fd.get('first_name')?.trim(),
            last_name: fd.get('last_name')?.trim(),
            email: fd.get('email')?.trim(),
            password: fd.get('password'),
            contact_number: fd.get('contact_number')?.trim() || undefined,
        };
    }
    showErrors(errors) {
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
    clearAllErrors() {
        this.form.querySelectorAll('[data-error]').forEach(el => (el.textContent = ''));
        this.form.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));
    }
    showBanner(message, type) {
        const banner = document.getElementById('form-banner');
        banner.textContent = message;
        banner.className = `banner banner--${type}`;
        banner.style.display = 'block';
    }
    setLoading(loading) {
        const btn = this.form.querySelector('button[type="submit"]');
        btn.disabled = loading;
        btn.textContent = loading ? 'Creating account…' : 'Create Account';
    }
    togglePasswordVisibility() {
        const input = this.form.querySelector('[name="password"]');
        const icon = document.getElementById('toggle-password');
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        icon.textContent = isHidden ? '🙈' : '👁';
    }
}
