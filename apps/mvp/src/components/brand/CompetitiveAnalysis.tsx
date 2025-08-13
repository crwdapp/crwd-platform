import React, { useState } from 'react';
import { Target, TrendingUp, TrendingDown, Users, MapPin, BarChart3, AlertCircle } from 'lucide-react';

interface CompetitorData {
  id: string;
  name: string;
  marketShare: number;
  tokenOfferings: string[];
  avgDiscountValue: number;
  userRating: number;
  activeLocations: number;
  growthRate: number;
  strengths: string[];
  weaknesses: string[];
}

interface MarketInsight {
  category: string;
  insight: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export const CompetitiveAnalysis: React.FC = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'market_share' | 'growth' | 'ratings'>('market_share');

  const competitors: CompetitorData[] = [
    {
      id: '1',
      name: 'NightLife Pro',
      marketShare: 28.5,
      tokenOfferings: ['25% Off', '30% Off', 'Free Drink', 'Happy Hour'],
      avgDiscountValue: 8.50,
      userRating: 4.2,
      activeLocations: 245,
      growthRate: 12.3,
      strengths: ['Wide bar network', 'Strong app ratings', 'Established brand'],
      weaknesses: ['Higher token costs', 'Limited premium offerings', 'Slow feature updates']
    },
    {
      id: '2',
      name: 'DrinkDeals',
      marketShare: 22.1,
      tokenOfferings: ['20% Off', 'Buy 1 Get 1', 'Free Appetizer'],
      avgDiscountValue: 6.25,
      userRating: 3.8,
      activeLocations: 189,
      growthRate: 8.7,
      strengths: ['Competitive pricing', 'Food + drink combos', 'Fast redemption'],
      weaknesses: ['Lower-quality bars', 'Poor customer service', 'Limited geographic coverage']
    },
    {
      id: '3',
      name: 'CRWD',
      marketShare: 15.8,
      tokenOfferings: ['50% Off', 'Free Drink', 'Premium Access'],
      avgDiscountValue: 12.75,
      userRating: 4.6,
      activeLocations: 156,
      growthRate: 34.2,
      strengths: ['Highest value tokens', 'Premium bar partnerships', 'Innovative features'],
      weaknesses: ['Smaller network', 'Higher customer acquisition cost', 'New brand awareness']
    },
    {
      id: '4',
      name: 'BarHopper',
      marketShare: 18.9,
      tokenOfferings: ['15% Off', '25% Off', 'Social Discounts'],
      avgDiscountValue: 4.80,
      userRating: 3.9,
      activeLocations: 312,
      growthRate: -2.1,
      strengths: ['Largest bar network', 'Social features', 'Group discounts'],
      weaknesses: ['Declining user base', 'Low discount values', 'Technical issues']
    }
  ];

  const marketInsights: MarketInsight[] = [
    {
      category: 'Pricing Strategy',
      insight: 'CRWD offers highest value tokens but has 23% higher acquisition costs than competitors',
      impact: 'high',
      actionable: true
    },
    {
      category: 'Market Growth',
      insight: 'CRWD has 2.8x faster growth rate than nearest competitor, indicating strong product-market fit',
      impact: 'high',
      actionable: false
    },
    {
      category: 'Geographic Coverage',
      insight: 'Main competitors have 50-100% more locations, representing expansion opportunity',
      impact: 'medium',
      actionable: true
    },
    {
      category: 'User Experience',
      insight: 'CRWD has highest user ratings (4.6) suggesting quality over quantity strategy is working',
      impact: 'medium',
      actionable: false
    },
    {
      category: 'Market Share',
      insight: 'Total addressable market is $1.2B with room for 2-3 dominant players',
      impact: 'high',
      actionable: true
    }
  ];

  const getMetricValue = (competitor: CompetitorData) => {
    switch (selectedMetric) {
      case 'market_share': return competitor.marketShare;
      case 'growth': return competitor.growthRate;
      case 'ratings': return competitor.userRating;
      default: return competitor.marketShare;
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'market_share': return 'Market Share (%)';
      case 'growth': return 'Growth Rate (%)';
      case 'ratings': return 'User Rating';
      default: return 'Market Share (%)';
    }
  };

  const crwdData = competitors.find(c => c.name === 'CRWD')!;
  const otherCompetitors = competitors.filter(c => c.name !== 'CRWD');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="white-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
            <Target className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Competitive Analysis</h2>
            <p className="text-gray-600 text-sm">Monitor competitor performance and market positioning</p>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex space-x-2 mb-6">
          {[
            { id: 'market_share', label: 'Market Share' },
            { id: 'growth', label: 'Growth Rate' },
            { id: 'ratings', label: 'User Ratings' }
          ].map(metric => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedMetric === metric.id
                  ? 'bg-red-100 text-red-700 border-2 border-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>

        {/* Competitive Positioning Chart */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {competitors
            .sort((a, b) => getMetricValue(b) - getMetricValue(a))
            .map((competitor, index) => (
            <div
              key={competitor.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                competitor.name === 'CRWD'
                  ? 'bg-cyan-50 border-cyan-200 shadow-lg'
                  : 'bg-gray-50 border-gray-200 hover:shadow-md'
              }`}
              onClick={() => setSelectedCompetitor(selectedCompetitor === competitor.id ? null : competitor.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold ${competitor.name === 'CRWD' ? 'text-cyan-700' : 'text-gray-900'}`}>
                  {competitor.name}
                </h3>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-yellow-100 text-yellow-600' :
                  index === 1 ? 'bg-gray-100 text-gray-600' :
                  index === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <span className="text-sm font-bold">#{index + 1}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">{getMetricLabel()}</p>
                  <p className={`text-2xl font-bold ${
                    selectedMetric === 'growth' && getMetricValue(competitor) < 0 
                      ? 'text-red-600' 
                      : competitor.name === 'CRWD' ? 'text-cyan-600' : 'text-gray-900'
                  }`}>
                    {getMetricValue(competitor).toFixed(1)}
                    {selectedMetric !== 'ratings' ? '%' : ''}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <MapPin size={14} />
                  <span>{competitor.activeLocations} locations</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Competitor Analysis */}
      {selectedCompetitor && (
        <div className="white-card p-6">
          {(() => {
            const competitor = competitors.find(c => c.id === selectedCompetitor)!;
            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Detailed Analysis: {competitor.name}</h3>
                  <button
                    onClick={() => setSelectedCompetitor(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Key Metrics */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Key Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Share</span>
                        <span className="font-medium">{competitor.marketShare}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Growth Rate</span>
                        <span className={`font-medium ${competitor.growthRate < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {competitor.growthRate > 0 ? '+' : ''}{competitor.growthRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">User Rating</span>
                        <span className="font-medium">{competitor.userRating}/5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Token Value</span>
                        <span className="font-medium">${competitor.avgDiscountValue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Strengths</h4>
                    <div className="space-y-2">
                      {competitor.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <TrendingUp className="text-green-600 mt-0.5" size={14} />
                          <span className="text-sm text-gray-700">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weaknesses */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Weaknesses</h4>
                    <div className="space-y-2">
                      {competitor.weaknesses.map((weakness, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <TrendingDown className="text-red-600 mt-0.5" size={14} />
                          <span className="text-sm text-gray-700">{weakness}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Token Offerings */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Token Offerings</h4>
                  <div className="flex flex-wrap gap-2">
                    {competitor.tokenOfferings.map((offering, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {offering}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Market Insights */}
      <div className="white-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Strategic Market Insights</h3>
            <p className="text-gray-600 text-sm">Actionable intelligence for competitive advantage</p>
          </div>
        </div>

        <div className="space-y-4">
          {marketInsights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                insight.impact === 'high' ? 'border-red-500 bg-red-50' :
                insight.impact === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{insight.category}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                      insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {insight.impact} impact
                    </span>
                    {insight.actionable && (
                      <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded">
                        Actionable
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm">{insight.insight}</p>
                </div>
                <AlertCircle className={`ml-4 ${
                  insight.impact === 'high' ? 'text-red-500' :
                  insight.impact === 'medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`} size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CRWD Position Summary */}
      <div className="white-card p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200">
        <h3 className="text-lg font-bold text-cyan-900 mb-4">CRWD Competitive Position</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-600 mb-2">#{
              competitors
                .sort((a, b) => b.marketShare - a.marketShare)
                .findIndex(c => c.name === 'CRWD') + 1
            }</div>
            <p className="text-sm text-gray-600">Market Position</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">+{crwdData.growthRate}%</div>
            <p className="text-sm text-gray-600">Growth Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">${crwdData.avgDiscountValue}</div>
            <p className="text-sm text-gray-600">Avg Token Value</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-cyan-100 rounded-lg">
          <p className="text-sm text-cyan-800">
            <strong>Strategic Advantage:</strong> Highest token values and user satisfaction, with fastest growth rate in the market. 
            Focus on scaling premium bar partnerships while maintaining quality standards.
          </p>
        </div>
      </div>
    </div>
  );
};