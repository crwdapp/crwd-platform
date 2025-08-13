import React, { useState } from 'react';
import { TestTube, DollarSign, TrendingUp, Calendar, Target, Zap, BarChart3, Settings } from 'lucide-react';

interface ABTest {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'draft';
  variants: {
    name: string;
    tokenValue: number;
    redemptionRate: number;
    revenue: number;
    confidence: number;
  }[];
  startDate: string;
  endDate?: string;
  sampleSize: number;
  hypothesis: string;
  winner?: string;
}

interface PricingRule {
  id: string;
  name: string;
  condition: string;
  adjustment: number;
  type: 'percentage' | 'fixed';
  active: boolean;
  performance: {
    redemptions: number;
    revenue: number;
    change: number;
  };
}

interface SeasonalTrend {
  period: string;
  demandMultiplier: number;
  recommendedAdjustment: number;
  historicalPerformance: number;
  confidence: number;
}

export const CampaignOptimization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ab_testing' | 'dynamic_pricing' | 'seasonal'>('ab_testing');
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const abTests: ABTest[] = [
    {
      id: '1',
      name: 'Token Value Impact Study',
      status: 'active',
      variants: [
        { name: 'Control (50% off)', tokenValue: 12.50, redemptionRate: 68.2, revenue: 2840, confidence: 95 },
        { name: 'Higher Value (60% off)', tokenValue: 15.00, redemptionRate: 78.5, revenue: 3210, confidence: 92 },
        { name: 'Premium (Free drink)', tokenValue: 25.00, redemptionRate: 45.8, revenue: 2980, confidence: 89 }
      ],
      startDate: '2025-01-15',
      sampleSize: 2500,
      hypothesis: 'Higher value tokens will increase overall revenue despite lower redemption rates',
      winner: 'Higher Value (60% off)'
    },
    {
      id: '2',
      name: 'Peak Hours Optimization',
      status: 'completed',
      variants: [
        { name: 'Standard Pricing', tokenValue: 12.50, redemptionRate: 64.1, revenue: 1890, confidence: 98 },
        { name: 'Dynamic Pricing', tokenValue: 15.75, redemptionRate: 72.3, revenue: 2450, confidence: 96 }
      ],
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      sampleSize: 1800,
      hypothesis: 'Dynamic pricing during peak hours will increase revenue per redemption',
      winner: 'Dynamic Pricing'
    },
    {
      id: '3',
      name: 'Weekend vs Weekday Strategy',
      status: 'draft',
      variants: [
        { name: 'Uniform Pricing', tokenValue: 12.50, redemptionRate: 0, revenue: 0, confidence: 0 },
        { name: 'Weekend Premium', tokenValue: 18.00, redemptionRate: 0, revenue: 0, confidence: 0 }
      ],
      startDate: '2025-02-01',
      sampleSize: 3000,
      hypothesis: 'Weekend premium pricing will capture higher willingness to pay'
    }
  ];

  const pricingRules: PricingRule[] = [
    {
      id: '1',
      name: 'Peak Hour Premium',
      condition: 'Friday-Saturday 21:00-23:00',
      adjustment: 25,
      type: 'percentage',
      active: true,
      performance: { redemptions: 1240, revenue: 18600, change: 23.5 }
    },
    {
      id: '2',
      name: 'Happy Hour Boost',
      condition: 'Monday-Thursday 17:00-19:00',
      adjustment: -15,
      type: 'percentage',
      active: true,
      performance: { redemptions: 890, revenue: 9450, change: 34.2 }
    },
    {
      id: '3',
      name: 'Low Demand Incentive',
      condition: 'Sunday-Tuesday < 50 users online',
      adjustment: 5.00,
      type: 'fixed',
      active: true,
      performance: { redemptions: 340, revenue: 2890, change: 18.7 }
    },
    {
      id: '4',
      name: 'High Competition Response',
      condition: 'Competitor campaign detected',
      adjustment: 20,
      type: 'percentage',
      active: false,
      performance: { redemptions: 0, revenue: 0, change: 0 }
    }
  ];

  const seasonalTrends: SeasonalTrend[] = [
    {
      period: 'New Year (Dec 28 - Jan 5)',
      demandMultiplier: 2.8,
      recommendedAdjustment: 40,
      historicalPerformance: 156,
      confidence: 94
    },
    {
      period: 'Valentine\'s Day (Feb 10-16)',
      demandMultiplier: 1.6,
      recommendedAdjustment: 20,
      historicalPerformance: 132,
      confidence: 87
    },
    {
      period: 'Summer Peak (June-August)',
      demandMultiplier: 1.4,
      recommendedAdjustment: 15,
      historicalPerformance: 118,
      confidence: 92
    },
    {
      period: 'Back to School (September)',
      demandMultiplier: 0.7,
      recommendedAdjustment: -25,
      historicalPerformance: 78,
      confidence: 89
    },
    {
      period: 'Black Friday Weekend',
      demandMultiplier: 2.2,
      recommendedAdjustment: 35,
      historicalPerformance: 145,
      confidence: 96
    }
  ];

  const togglePricingRule = (ruleId: string) => {
    // In real implementation, this would update the rule status
    console.log(`Toggling pricing rule ${ruleId}`);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600 bg-green-100';
    if (confidence >= 90) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="white-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
              <TestTube className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Campaign Optimization</h2>
              <p className="text-gray-600 text-sm">A/B testing, dynamic pricing, and seasonal predictions</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { id: 'ab_testing', label: 'A/B Testing', icon: TestTube },
            { id: 'dynamic_pricing', label: 'Dynamic Pricing', icon: DollarSign },
            { id: 'seasonal', label: 'Seasonal Trends', icon: Calendar }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded text-sm transition-all ${
                  activeTab === tab.id ? 'bg-white shadow text-orange-600' : 'text-gray-600'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* A/B Testing Tab */}
      {activeTab === 'ab_testing' && (
        <div className="space-y-6">
          {/* Active Tests Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="white-card p-4 text-center">
              <p className="text-2xl font-bold text-green-600">2</p>
              <p className="text-sm text-gray-600">Active Tests</p>
            </div>
            <div className="white-card p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">1</p>
              <p className="text-sm text-gray-600">Completed Tests</p>
            </div>
            <div className="white-card p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">+18.5%</p>
              <p className="text-sm text-gray-600">Avg Revenue Lift</p>
            </div>
          </div>

          {/* Test List */}
          <div className="white-card p-6">
            <h3 className="text-lg font-bold mb-4">A/B Test Results</h3>
            
            <div className="space-y-4">
              {abTests.map(test => (
                <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">{test.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                      {test.winner && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                          Winner: {test.winner}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    >
                      {selectedTest === test.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{test.hypothesis}</p>

                  {/* Variants Performance */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {test.variants.map((variant, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border ${
                          test.winner === variant.name 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">{variant.name}</h5>
                          {test.winner === variant.name && (
                            <Target className="text-green-600" size={16} />
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Token Value:</span>
                            <span className="font-medium">${variant.tokenValue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Redemption:</span>
                            <span className="font-medium">{variant.redemptionRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Revenue:</span>
                            <span className="font-medium">${variant.revenue}</span>
                          </div>
                          {variant.confidence > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Confidence:</span>
                              <span className={`text-xs px-1 py-0.5 rounded font-medium ${getConfidenceColor(variant.confidence)}`}>
                                {variant.confidence}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detailed View */}
                  {selectedTest === test.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Start Date:</span>
                          <p className="font-medium">{test.startDate}</p>
                        </div>
                        {test.endDate && (
                          <div>
                            <span className="text-gray-600">End Date:</span>
                            <p className="font-medium">{test.endDate}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600">Sample Size:</span>
                          <p className="font-medium">{test.sampleSize.toLocaleString()} users</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <p className="font-medium capitalize">{test.status}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Pricing Tab */}
      {activeTab === 'dynamic_pricing' && (
        <div className="space-y-6">
          {/* Pricing Rules Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="white-card p-4 text-center">
              <p className="text-2xl font-bold text-green-600">3</p>
              <p className="text-sm text-gray-600">Active Rules</p>
            </div>
            <div className="white-card p-4 text-center">
              <p className="text-2xl font-bold text-cyan-600">+$31.5K</p>
              <p className="text-sm text-gray-600">Extra Revenue</p>
            </div>
            <div className="white-card p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">2,470</p>
              <p className="text-sm text-gray-600">Optimized Redemptions</p>
            </div>
          </div>

          {/* Pricing Rules */}
          <div className="white-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Dynamic Pricing Rules</h3>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Create New Rule
              </button>
            </div>

            <div className="space-y-4">
              {pricingRules.map(rule => (
                <div key={rule.id} className={`p-4 rounded-lg border-2 ${
                  rule.active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        rule.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rule.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => togglePricingRule(rule.id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          rule.active 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {rule.active ? 'Disable' : 'Enable'}
                      </button>
                      <Settings className="text-gray-500 cursor-pointer hover:text-gray-700" size={16} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Condition:</span>
                      <p className="font-medium text-sm">{rule.condition}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Adjustment:</span>
                      <p className="font-medium text-sm">
                        {rule.adjustment > 0 ? '+' : ''}{rule.adjustment}
                        {rule.type === 'percentage' ? '%' : '$'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Redemptions:</span>
                      <p className="font-medium text-sm">{rule.performance.redemptions.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Revenue Impact:</span>
                      <p className={`font-medium text-sm ${
                        rule.performance.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${rule.performance.revenue.toLocaleString()} ({rule.performance.change > 0 ? '+' : ''}{rule.performance.change}%)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Seasonal Trends Tab */}
      {activeTab === 'seasonal' && (
        <div className="space-y-6">
          {/* Seasonal Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="white-card p-4 text-center">
              <p className="text-2xl font-bold text-red-600">2.8x</p>
              <p className="text-sm text-gray-600">Peak Demand Multiplier</p>
            </div>
            <div className="white-card p-4 text-center">
              <p className="text-2xl font-bold text-green-600">+125%</p>
              <p className="text-sm text-gray-600">Best Period Performance</p>
            </div>
            <div className="white-card p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">92%</p>
              <p className="text-sm text-gray-600">Avg Prediction Accuracy</p>
            </div>
          </div>

          {/* Seasonal Predictions */}
          <div className="white-card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Seasonal Demand Predictions</h3>
                <p className="text-gray-600 text-sm">Historical patterns and recommended pricing adjustments</p>
              </div>
            </div>

            <div className="space-y-4">
              {seasonalTrends.map((trend, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{trend.period}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getConfidenceColor(trend.confidence)}`}>
                      {trend.confidence}% confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Demand Multiplier:</span>
                      <p className={`text-lg font-bold ${
                        trend.demandMultiplier > 1.5 ? 'text-red-600' :
                        trend.demandMultiplier > 1 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {trend.demandMultiplier}x
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Recommended Adjustment:</span>
                      <p className={`text-lg font-bold ${
                        trend.recommendedAdjustment > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trend.recommendedAdjustment > 0 ? '+' : ''}{trend.recommendedAdjustment}%
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Historical Performance:</span>
                      <p className={`text-lg font-bold ${
                        trend.historicalPerformance > 120 ? 'text-green-600' :
                        trend.historicalPerformance > 100 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {trend.historicalPerformance}%
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                        Apply Rule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Recommendations */}
          <div className="white-card p-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="text-orange-600" size={24} />
              <h3 className="text-lg font-bold text-orange-900">Smart Optimization Recommendations</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <TrendingUp className="text-green-600 mt-1" size={16} />
                <div>
                  <p className="font-medium text-sm text-gray-900">Implement New Year Premium Pricing</p>
                  <p className="text-xs text-gray-600">Expected +40% revenue during Dec 28 - Jan 5 period</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Target className="text-blue-600 mt-1" size={16} />
                <div>
                  <p className="font-medium text-sm text-gray-900">Test Weekend Premium Strategy</p>
                  <p className="text-xs text-gray-600">A/B test shows 23% higher willingness to pay on weekends</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Calendar className="text-purple-600 mt-1" size={16} />
                <div>
                  <p className="font-medium text-sm text-gray-900">Schedule Back-to-School Promotions</p>
                  <p className="text-xs text-gray-600">Historical data shows 25% discount needed to maintain volume in September</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};