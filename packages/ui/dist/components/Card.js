import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Card = ({ children, title, subtitle, header, footer, variant = 'default', padding = 'md', className = '', }) => {
    const baseClasses = 'bg-white rounded-lg';
    const variantClasses = {
        default: 'shadow-sm border border-gray-200',
        elevated: 'shadow-lg border border-gray-200',
        outlined: 'border border-gray-300',
    };
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };
    const contentPaddingClasses = {
        none: '',
        sm: 'px-4 py-4',
        md: 'px-6 py-6',
        lg: 'px-8 py-8',
    };
    const classes = [
        baseClasses,
        variantClasses[variant],
        className,
    ].filter(Boolean).join(' ');
    const contentClasses = [
        contentPaddingClasses[padding],
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: classes, children: [(header || title) && (_jsx("div", { className: `border-b border-gray-200 ${paddingClasses[padding]}`, children: header || (_jsxs("div", { children: [title && (_jsx("h3", { className: "text-lg font-medium text-gray-900", children: title })), subtitle && (_jsx("p", { className: "mt-1 text-sm text-gray-500", children: subtitle }))] })) })), _jsx("div", { className: contentClasses, children: children }), footer && (_jsx("div", { className: `border-t border-gray-200 ${paddingClasses[padding]}`, children: footer }))] }));
};
//# sourceMappingURL=Card.js.map