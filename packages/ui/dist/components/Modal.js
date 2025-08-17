import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
export const Modal = ({ isOpen, onClose, title, children, size = 'md', closeOnOverlayClick = true, closeOnEscape = true, showCloseButton = true, }) => {
    const modalRef = useRef(null);
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full mx-4',
    };
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && closeOnEscape) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, closeOnEscape]);
    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget && closeOnOverlayClick) {
            onClose();
        }
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: _jsxs("div", { className: "flex min-h-screen items-center justify-center p-4", children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 transition-opacity", onClick: handleOverlayClick }), _jsxs("div", { ref: modalRef, className: `relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all`, children: [(title || showCloseButton) && (_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [title && (_jsx("h3", { className: "text-lg font-medium text-gray-900", children: title })), showCloseButton && (_jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", "aria-label": "Close modal", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] })), _jsx("div", { className: "p-6", children: children })] })] }) }));
};
//# sourceMappingURL=Modal.js.map