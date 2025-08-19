import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
export const Input = forwardRef(({ label, error, helperText, leftIcon, rightIcon, variant = 'default', className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const baseClasses = 'block w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0';
    const variantClasses = {
        default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
        filled: 'border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 focus:bg-white',
        outlined: 'border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    };
    const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500';
    const sizeClasses = 'px-3 py-2 text-sm';
    const iconClasses = {
        left: leftIcon ? 'pl-10' : '',
        right: rightIcon ? 'pr-10' : '',
    };
    const classes = [
        baseClasses,
        variantClasses[variant],
        error ? errorClasses : '',
        sizeClasses,
        iconClasses.left,
        iconClasses.right,
        className,
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { htmlFor: inputId, className: "block text-sm font-medium text-gray-700 mb-1", children: label })), _jsxs("div", { className: "relative", children: [leftIcon && (_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("span", { className: "text-gray-400", children: leftIcon }) })), _jsx("input", { ref: ref, id: inputId, className: classes, ...props }), rightIcon && (_jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: _jsx("span", { className: "text-gray-400", children: rightIcon }) }))] }), error && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: error })), helperText && !error && (_jsx("p", { className: "mt-1 text-sm text-gray-500", children: helperText }))] }));
});
Input.displayName = 'Input';
//# sourceMappingURL=Input.js.map