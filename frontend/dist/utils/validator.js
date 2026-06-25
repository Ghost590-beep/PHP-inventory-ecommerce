// Validates login and register form data.
// Each rule is a small object with a check function and an error message.
const Rules = {
    required: () => ({
        check: (v) => v.trim().length > 0,
        message: 'This field is required.',
    }),
    minLength: (min) => ({
        check: (v) => v.length >= min,
        message: `Must be at least ${min} characters.`,
    }),
    email: () => ({
        check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Please enter a valid email address.',
    }),
    hasUppercase: () => ({
        check: (v) => /[A-Z]/.test(v),
        message: 'Must contain at least one uppercase letter.',
    }),
    hasNumber: () => ({
        check: (v) => /\d/.test(v),
        message: 'Must contain at least one number.',
    }),
    hasSpecial: () => ({
        check: (v) => /[!@#$%^&*(),.?":{}|<>_\-]/.test(v),
        message: 'Must contain at least one special character.',
    }),
    // Checks that value equals the other field (used for confirm password)
    matches: (other) => ({
        check: (v) => v === other,
        message: 'Passwords do not match.',
    }),
};
// ── Validator class ────────────────────────────────────────────────
export class Validator {
    // Runs rules in order and returns the first error message, or '' if all pass
    runRules(value, rules) {
        for (const rule of rules) {
            if (!rule.check(value))
                return rule.message;
        }
        return '';
    }
    validateLogin(data) {
        const errors = {};
        const emailErr = this.runRules(data.email, [Rules.required(), Rules.email()]);
        const passErr = this.runRules(data.password, [Rules.required(), Rules.minLength(6)]);
        if (emailErr)
            errors['email'] = emailErr;
        if (passErr)
            errors['password'] = passErr;
        return { valid: Object.keys(errors).length === 0, errors };
    }
    validateRegister(data) {
        const errors = {};
        const fields = [
            ['first_name', data.first_name ?? '', [Rules.required(), Rules.minLength(2)]],
            ['last_name', data.last_name ?? '', [Rules.required(), Rules.minLength(2)]],
            ['email', data.email ?? '', [Rules.required(), Rules.email()]],
            ['password', data.password ?? '', [
                    Rules.required(), Rules.minLength(8),
                    Rules.hasUppercase(), Rules.hasNumber(), Rules.hasSpecial(),
                ]],
            ['confirm_password', data.confirm_password ?? '', [
                    Rules.required(), Rules.matches(data.password ?? ''),
                ]],
        ];
        for (const [name, value, rules] of fields) {
            const err = this.runRules(value, rules);
            if (err)
                errors[name] = err;
        }
        if (!data.terms)
            errors['terms'] = 'You must accept the Terms of Service.';
        return { valid: Object.keys(errors).length === 0, errors };
    }
}
