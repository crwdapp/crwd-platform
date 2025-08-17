import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Loading = ({ size = 'md', variant = 'spinner', text, className = '', }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };
    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };
    const renderSpinner = () => (_jsxs("svg", { className: `animate-spin ${sizeClasses[size]}`, fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }));
    const renderDots = () => (_jsxs("div", { className: "flex space-x-1", children: [_jsx("div", { className: `${sizeClasses[size]} bg-current rounded-full animate-bounce`, style: { animationDelay: '0ms' } }), _jsx("div", { className: `${sizeClasses[size]} bg-current rounded-full animate-bounce`, style: { animationDelay: '150ms' } }), _jsx("div", { className: `${sizeClasses[size]} bg-current rounded-full animate-bounce`, style: { animationDelay: '300ms' } })] }));
    const renderPulse = () => (_jsx("div", { className: `${sizeClasses[size]} bg-current rounded-full animate-pulse` }));
    const renderLoader = () => {
        switch (variant) {
            case 'dots':
                return renderDots();
            case 'pulse':
                return renderPulse();
            default:
                return renderSpinner();
        }
    };
    return (_jsxs("div", { className: `flex flex-col items-center justify-center ${className}`, children: [_jsx("div", { className: "text-blue-600", children: renderLoader() }), text && (_jsx("p", { className: `mt-2 text-gray-600 ${textSizeClasses[size]}`, children: text }))] }));
};
export const LoadingSpinner = (props) => (_jsx(Loading, { ...props, variant: "spinner" }));
export const LoadingDots = (props) => (_jsx(Loading, { ...props, variant: "dots" }));
export const LoadingPulse = (props) => (_jsx(Loading, { ...props, variant: "pulse" }));
//# sourceMappingURL=Loading.js.map