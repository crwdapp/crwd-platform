import React from 'react';
export interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
}
export declare const Card: React.FC<CardProps>;
//# sourceMappingURL=Card.d.ts.map