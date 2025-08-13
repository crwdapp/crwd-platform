import React, { useState } from 'react';
import { Calculator, TrendingUp, Users, DollarSign, Target, BarChart3 } from 'lucide-react';

interface ROIMetrics {
  tokenCost: number;
  acquisitionValue: number;
  retentionRate: number;
  averageSpend: number;
  campaignBudget: number;
  timeframe: number; // months
}

export const ROICalculator: React.FC = () => {
  const [metrics, setMetrics] = useState<ROIMetrics>({
    tokenCost: 2.50,
    acquisitionValue: 15.00,
    retentionRate: 65,
    averageSpend: 25.00,
    campaignBudget: 5000,
    timeframe: 6
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const calculateROI = () => {
    const tokensDistributed = Math.floor(metrics.campaignBudget / metrics.tokenCost);
    const customersAcquired = Math.floor(tokensDistributed * 0.7); // 70% redemption rate
    const retainedCustomers = Math.floor(customersAcquired * (metrics.retentionRate / 100));
    
    // Revenue calculation
    const initialRevenue = customersAcquired * metrics.acquisitionValue;
    const ongoingRevenue = retainedCustomers * metrics.averageSpend * metrics.timeframe;
    const totalRevenue = initialRevenue + ongoingRevenue;
    
    // ROI calculation
    const roi = ((totalRevenue - metrics.campaignBudget) / metrics.campaignBudget) * 100;
    const customerLifetimeValue = totalRevenue / customersAcquired;
    const costPerAcquisition = metrics.campaignBudget / customersAcquired;
    
    return {
      tokensDistributed,
      customersAcquired,
      retainedCustomers,
      totalRevenue,
      roi,
      customerLifetimeValue,
      costPerAcquisition,
      breakEvenTime: Math.ceil(metrics.campaignBudget / (retainedCustomers * metrics.averageSpend || 1))
    };
  };

  const results = calculateROI();

  const handleInputChange = (field: keyof ROIMetrics, value: number) => {
    setIsCalculating(true);
    setMetrics(prev => ({ ...prev, [field]: value }));
    
    // Simulate calculation delay
    setTimeout(() => setIsCalculating(false), 300);
  };

  return (
    <div className="white-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
          <Calculator className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold">ROI Calculator</h2>
          <p className="text-gray-600 text-sm">Calculate token campaign return on investment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Parameters */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={metrics.tokenCost}
                onChange={(e) => handleInputChange('tokenCost', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Acquisition Value ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={metrics.acquisitionValue}
                onChange={(e) => handleInputChange('acquisitionValue', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Retention Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={metrics.retentionRate}
                onChange={(e) => handleInputChange('retentionRate', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Monthly Spend ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={metrics.averageSpend}
                onChange={(e) => handleInputChange('averageSpend', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Budget ($)
              </label>
              <input
                type="number"
                value={metrics.campaignBudget}
                onChange={(e) => handleInputChange('campaignBudget', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeframe (months)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={metrics.timeframe}
                onChange={(e) => handleInputChange('timeframe', parseInt(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projected Results</h3>
          
          {isCalculating ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="white-card-secondary rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="text-green-600" size={20} />
                  <span className="font-medium text-gray-900">ROI</span>
                </div>
                <p className={`text-2xl font-bold ${results.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.roi.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">
                  {results.roi >= 0 ? 'Profitable campaign' : 'Needs optimization'}
                </p>
              </div>
              
              <div className="white-card-secondary rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="text-cyan-600" size={20} />
                  <span className="font-medium text-gray-900">Customers Acquired</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{results.customersAcquired.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  From {results.tokensDistributed.toLocaleString()} tokens distributed
                </p>
              </div>
              
              <div className="white-card-secondary rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <DollarSign className="text-purple-600" size={20} />
                  <span className="font-medium text-gray-900">Total Revenue</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">${results.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  Over {metrics.timeframe} months
                </p>
              </div>
              
              <div className="white-card-secondary rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="text-orange-600" size={20} />
                  <span className="font-medium text-gray-900">Customer LTV</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">${results.customerLifetimeValue.toFixed(2)}</p>
                <p className="text-sm text-gray-600">
                  Average lifetime value per customer
                </p>
              </div>
              
              <div className="white-card-secondary rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <BarChart3 className="text-blue-600" size={20} />
                  <span className="font-medium text-gray-900">Cost Per Acquisition</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">${results.costPerAcquisition.toFixed(2)}</p>
                <p className="text-sm text-gray-600">
                  Break-even in ~{results.breakEvenTime} months
                </p>
              </div>
              
              <div className="white-card-secondary rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="text-indigo-600" size={20} />
                  <span className="font-medium text-gray-900">Retained Customers</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{results.retainedCustomers.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  {metrics.retentionRate}% retention rate applied
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Optimization Recommendations</h4>
        <div className="space-y-1 text-sm text-blue-800">
          {results.roi < 50 && (
            <p>• Consider increasing customer retention through loyalty programs</p>
          )}
          {results.costPerAcquisition > 20 && (
            <p>• High acquisition cost - optimize token distribution strategy</p>
          )}
          {results.roi > 100 && (
            <p>• Strong ROI - consider increasing campaign budget for scale</p>
          )}
          <p>• Test different token values to optimize redemption rates</p>
          <p>• Focus on peak hours and high-traffic locations for better conversion</p>
        </div>
      </div>
    </div>
  );
};