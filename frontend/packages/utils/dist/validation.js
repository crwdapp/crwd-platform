export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
export const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
export const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};
export const validateRequired = (value) => {
    if (value === null || value === undefined)
        return false;
    if (typeof value === 'string')
        return value.trim().length > 0;
    if (Array.isArray(value))
        return value.length > 0;
    return true;
};
export const validateMinLength = (value, minLength) => {
    return value.length >= minLength;
};
export const validateMaxLength = (value, maxLength) => {
    return value.length <= maxLength;
};
export const validatePattern = (value, pattern) => {
    return pattern.test(value);
};
export const validateField = (value, rules) => {
    const errors = [];
    for (const rule of rules) {
        let isValid = true;
        switch (rule.type) {
            case 'required':
                isValid = validateRequired(value);
                break;
            case 'email':
                isValid = validateEmail(value);
                break;
            case 'minLength':
                isValid = validateMinLength(value, rule.value);
                break;
            case 'maxLength':
                isValid = validateMaxLength(value, rule.value);
                break;
            case 'pattern':
                isValid = validatePattern(value, rule.value);
                break;
            case 'custom':
                // Custom validation function should be provided in rule.value
                if (typeof rule.value === 'function') {
                    isValid = rule.value(value);
                }
                break;
        }
        if (!isValid) {
            errors.push(rule.message);
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
export const validateForm = (data, fields) => {
    const errors = {};
    let isValid = true;
    for (const [fieldName, rules] of Object.entries(fields)) {
        const fieldValue = data[fieldName];
        const validation = validateField(fieldValue, rules);
        if (!validation.isValid) {
            errors[fieldName] = validation.errors;
            isValid = false;
        }
    }
    return { isValid, errors };
};
//# sourceMappingURL=validation.js.map