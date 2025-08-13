import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, Zap } from 'lucide-react';

interface RevenueKPICardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: 'revenue' | 'peak' | 'customers' | 'upsell';
  subtitle?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export const RevenueKPICard: React.FC<RevenueKPICardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon = 'revenue',
  subtitle,
  isLoading = false,
  onClick
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'revenue':
        return <DollarSign size={24} className="text-green-600" />;
      case 'peak':
        return <Clock size={24} className="text-cyan-600" />;
      case 'customers':
        return <Users size={24} className="text-purple-600" />;
      case 'upsell':
        return <Zap size={24} className="text-yellow-600" />;
      default:
        return <DollarSign size={24} className="text-green-600" />;
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} className="text-green-600" />;
    if (trend === 'down') return <TrendingDown size={16} className="text-red-600" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div 
      className={`white-card p-4 lg:p-6 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-lg transform hover:scale-105' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : (
          <>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change && (
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {change}
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};