import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

/**
 * Reusable StatCard Component
 * Implements Single Responsibility Principle
 * Follows DRY principle by eliminating repeated stat card patterns
 */
interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  iconBgColor?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'compact';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  iconBgColor = 'from-cyan-500 to-cyan-600',
  size = 'medium',
  variant = 'default',
  onClick
}) => {
  const sizeClasses = {
    small: {
      container: 'p-3',
      icon: 'p-2',
      iconSize: 16,
      value: 'text-lg',
      label: 'text-xs'
    },
    medium: {
      container: 'p-4 lg:p-6',
      icon: 'p-2 lg:p-3',
      iconSize: 20,
      value: 'text-lg lg:text-2xl',
      label: 'text-xs'
    },
    large: {
      container: 'p-6',
      icon: 'p-3',
      iconSize: 24,
      value: 'text-2xl lg:text-3xl',
      label: 'text-sm'
    }
  };

  const currentSize = sizeClasses[size];

  const containerClasses = variant === 'compact' 
    ? `white-card-secondary rounded-lg ${currentSize.container} text-center`
    : `white-card group hover:scale-105 transition-all duration-300 ${currentSize.container}`;

  return (
    <div 
      className={`${containerClasses} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {variant === 'default' && (
        <div className="flex items-center space-x-3 mb-3">
          <div className={`${currentSize.icon} rounded-xl bg-gradient-to-r ${iconBgColor} shadow-lg`}>
            <Icon size={currentSize.iconSize} className="text-white" />
          </div>
          <span className={`${currentSize.label} text-gray-600 uppercase tracking-wider font-medium hidden lg:block`}>
            {label}
          </span>
        </div>
      )}
      
      <div className="space-y-1">
        <h3 className={`${currentSize.value} font-bold text-gray-900 group-hover:text-cyan-600 transition-colors`}>
          {value}
        </h3>
        
        {variant === 'default' && (
          <p className={`${currentSize.label} text-gray-600 uppercase tracking-wider font-medium lg:hidden`}>
            {label}
          </p>
        )}
        
        {variant === 'compact' && (
          <p className={`${currentSize.label} text-gray-600`}>
            {label}
          </p>
        )}
        
        {change && (
          <p className={`${currentSize.label} font-medium ${
            change.includes('+') ? 'text-green-600' : 'text-blue-600'
          }`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
};