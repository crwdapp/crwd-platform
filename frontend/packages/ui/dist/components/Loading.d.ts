import React from 'react';
export interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'spinner' | 'dots' | 'pulse';
    text?: string;
    className?: string;
}
export declare const Loading: React.FC<LoadingProps>;
export declare const LoadingSpinner: React.FC<Omit<LoadingProps, 'variant'>>;
export declare const LoadingDots: React.FC<Omit<LoadingProps, 'variant'>>;
export declare const LoadingPulse: React.FC<Omit<LoadingProps, 'variant'>>;
//# sourceMappingURL=Loading.d.ts.map