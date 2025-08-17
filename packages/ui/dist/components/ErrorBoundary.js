import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "max-w-md w-full bg-white shadow-lg rounded-lg p-6", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full", children: _jsx("svg", { className: "w-6 h-6 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), _jsxs("div", { className: "mt-4 text-center", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Something went wrong" }), _jsx("p", { className: "mt-2 text-sm text-gray-500", children: "We're sorry, but something unexpected happened. Please try refreshing the page." }), this.state.error && process.env.NODE_ENV === 'development' && (_jsxs("details", { className: "mt-4 text-left", children: [_jsx("summary", { className: "cursor-pointer text-sm font-medium text-gray-700", children: "Error Details (Development)" }), _jsx("pre", { className: "mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto", children: this.state.error.stack })] })), _jsx("div", { className: "mt-6", children: _jsx("button", { onClick: () => window.location.reload(), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: "Refresh Page" }) })] })] }) }));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map