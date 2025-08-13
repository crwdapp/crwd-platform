import React, { useState } from 'react';
import { MapPin, TrendingUp, Users, Target, Calendar, AlertCircle, Zap } from 'lucide-react';

interface CityData {
  id: string;
  name: string;
  tokenUsage: number;
  userDensity: number;
  averageSpend: number;
  demographics: {
    age18_25: number;
    age26_35: number;
    age36_45: number;
    income: 'low' | 'medium' | 'high';
  };
  marketPenetration: number;
  competitorPresence: number;
  expansionScore: number;
  upcomingEvents: string[];
  peakHours: { hour: string; intensity: number }[];
}

interface ExpansionOpportunity {
  city: string;
  score: number;
  reason: string;
  investment: number;
  roi: number;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
}

export const GeographicIntelligence: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('bucharest');
  const [viewMode, setViewMode] = useState<'heatmap' | 'comparison' | 'expansion'>('heatmap');

  const cities: CityData[] = [
    {
      id: 'bucharest',
      name: 'Bucharest',
      tokenUsage: 2847,
      userDensity: 89.2,
      averageSpend: 28.50,
      demographics: { age18_25: 35, age26_35: 42, age36_45: 23, income: 'high' },
      marketPenetration: 23.5,
      competitorPresence: 8,
      expansionScore: 8.2,
      upcomingEvents: ['Electronic Music Festival', 'Food & Wine Week', 'New Year\'s Eve'],
      peakHours: [
        { hour: '18:00', intensity: 45 },
        { hour: '19:00', intensity: 67 },
        { hour: '20:00', intensity: 82 },
        { hour: '21:00', intensity: 95 },
        { hour: '22:00', intensity: 100 },
        { hour: '23:00', intensity: 88 }
      ]
    },
    {
      id: 'constanta',
      name: 'Constanta',
      tokenUsage: 1256,
      userDensity: 67.8,
      averageSpend: 22.30,
      demographics: { age18_25: 42, age26_35: 38, age36_45: 20, income: 'medium' },
      marketPenetration: 18.2,
      competitorPresence: 5,
      expansionScore: 7.8,
      upcomingEvents: ['Summer Beach Party', 'Jazz Festival'],
      peakHours: [
        { hour: '19:00', intensity: 55 },
        { hour: '20:00', intensity: 71 },
        { hour: '21:00', intensity: 89 },
        { hour: '22:00', intensity: 92 },
        { hour: '23:00', intensity: 85 }
      ]
    },
    {
      id: 'cluj',
      name: 'Cluj-Napoca',
      tokenUsage: 1834,
      userDensity: 78.4,
      averageSpend: 25.80,
      demographics: { age18_25: 48, age26_35: 35, age36_45: 17, income: 'high' },
      marketPenetration: 21.7,
      competitorPresence: 6,
      expansionScore: 8.5,
      upcomingEvents: ['Student Festival', 'Tech Conference', 'Halloween Party'],
      peakHours: [
        { hour: '18:00', intensity: 42 },
        { hour: '19:00', intensity: 63 },
        { hour: '20:00', intensity: 78 },
        { hour: '21:00', intensity: 91 },
        { hour: '22:00', intensity: 97 },
        { hour: '23:00', intensity: 100 }
      ]
    },
    {
      id: 'timisoara',
      name: 'Timisoara',
      tokenUsage: 945,
      userDensity: 52.1,
      averageSpend: 21.60,
      demographics: { age18_25: 38, age26_35: 41, age36_45: 21, income: 'medium' },
      marketPenetration: 15.8,
      competitorPresence: 4,
      expansionScore: 7.2,
      upcomingEvents: ['Music Festival', 'Art Gallery Opening'],
      peakHours: [
        { hour: '19:00', intensity: 48 },
        { hour: '20:00', intensity: 65 },
        { hour: '21:00', intensity: 82 },
        { hour: '22:00', intensity: 87 },
        { hour: '23:00', intensity: 79 }
      ]
    }
  ];

  const expansionOpportunities: ExpansionOpportunity[] = [
    {
      city: 'Brasov',
      score: 9.1,
      reason: 'High tourist traffic, low competitor presence, premium demographics',
      investment: 85000,
      roi: 156,
      timeframe: '3-6 months',
      priority: 'high'
    },
    {
      city: 'Iasi',
      score: 8.7,
      reason: 'Large student population, growing tech sector, untapped market',
      investment: 62000,
      roi: 142,
      timeframe: '4-8 months',
      priority: 'high'
    },
    {
      city: 'Sibiu',
      score: 7.9,
      reason: 'Cultural hub, international visitors, premium bar scene',
      investment: 58000,
      roi: 118,
      timeframe: '6-9 months',
      priority: 'medium'
    },
    {
      city: 'Craiova',
      score: 7.3,
      reason: 'Growing economy, young demographics, moderate competition',
      investment: 45000,
      roi: 98,
      timeframe: '6-12 months',
      priority: 'medium'
    }
  ];

  const selectedCityData = cities.find(city => city.id === selectedCity)!;

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 90) return 'bg-red-500';
    if (intensity >= 70) return 'bg-orange-500';
    if (intensity >= 50) return 'bg-yellow-500';
    if (intensity >= 30) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getExpansionScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600 bg-green-100';
    if (score >= 7.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="white-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <MapPin className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Geographic Intelligence</h2>
              <p className="text-gray-600 text-sm">Market analysis and expansion opportunities</p>
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'heatmap', label: 'Heat Map' },
              { id: 'comparison', label: 'Compare' },
              { id: 'expansion', label: 'Expand' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-4 py-2 rounded text-sm transition-all ${
                  viewMode === mode.id ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* City Selector */}
        <div className="flex flex-wrap gap-2">
          {cities.map(city => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCity === city.id
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Based on View Mode */}
      {viewMode === 'heatmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Token Usage Heat Map */}
          <div className="white-card p-6">
            <h3 className="text-lg font-bold mb-4">Token Usage Density - {selectedCityData.name}</h3>
            
            {/* Peak Hours Visualization */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-gray-700">Peak Hours Activity</h4>
              <div className="grid grid-cols-6 gap-2">
                {selectedCityData.peakHours.map(hour => (
                  <div key={hour.hour} className="text-center">
                    <div className={`h-16 rounded-lg ${getIntensityColor(hour.intensity)} mb-2 flex items-end justify-center relative`}>
                      <div 
                        className="w-full bg-white bg-opacity-20 rounded-t-lg"
                        style={{ height: `${hour.intensity}%` }}
                      />
                      <span className="absolute bottom-1 text-white text-xs font-bold">
                        {hour.intensity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{hour.hour}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{selectedCityData.tokenUsage.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Monthly Tokens</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{selectedCityData.userDensity}</p>
                <p className="text-sm text-gray-600">Users per km²</p>
              </div>
            </div>
          </div>

          {/* Demographics & Market Info */}
          <div className="white-card p-6">
            <h3 className="text-lg font-bold mb-4">Market Intelligence - {selectedCityData.name}</h3>
            
            {/* Demographics */}
            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-gray-700">Age Demographics</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">18-25 years</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-cyan-500 h-2 rounded-full" 
                        style={{ width: `${selectedCityData.demographics.age18_25}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{selectedCityData.demographics.age18_25}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">26-35 years</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${selectedCityData.demographics.age26_35}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{selectedCityData.demographics.age26_35}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">36-45 years</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${selectedCityData.demographics.age36_45}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{selectedCityData.demographics.age36_45}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{selectedCityData.marketPenetration}%</p>
                <p className="text-sm text-gray-600">Market Penetration</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">${selectedCityData.averageSpend}</p>
                <p className="text-sm text-gray-600">Avg Spend/User</p>
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Upcoming Events</h4>
              <div className="space-y-2">
                {selectedCityData.upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Calendar className="text-cyan-600" size={16} />
                    <span className="text-sm text-gray-700">{event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'comparison' && (
        <div className="white-card p-6">
          <h3 className="text-lg font-bold mb-6">City Performance Comparison</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">City</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Token Usage</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">User Density</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Avg Spend</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Market Share</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Expansion Score</th>
                </tr>
              </thead>
              <tbody>
                {cities
                  .sort((a, b) => b.tokenUsage - a.tokenUsage)
                  .map((city, index) => (
                  <tr key={city.id} className={`border-b border-gray-100 hover:bg-gray-50 ${
                    city.id === selectedCity ? 'bg-blue-50' : ''
                  }`}>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-100 text-yellow-600' :
                          index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <span className="font-medium">{city.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 font-semibold text-blue-600">
                      {city.tokenUsage.toLocaleString()}
                    </td>
                    <td className="text-center py-4 px-4">{city.userDensity}</td>
                    <td className="text-center py-4 px-4">${city.averageSpend}</td>
                    <td className="text-center py-4 px-4">{city.marketPenetration}%</td>
                    <td className="text-center py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExpansionScoreColor(city.expansionScore)}`}>
                        {city.expansionScore}/10
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'expansion' && (
        <div className="space-y-6">
          {/* Expansion Opportunities */}
          <div className="white-card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <Target className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Expansion Opportunities</h3>
                <p className="text-gray-600 text-sm">Ranked by potential ROI and market conditions</p>
              </div>
            </div>

            <div className="space-y-4">
              {expansionOpportunities.map((opportunity, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  opportunity.priority === 'high' ? 'border-green-500 bg-green-50' :
                  opportunity.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-gray-500 bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        index === 0 ? 'bg-green-100 text-green-700' :
                        index === 1 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        <span className="font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{opportunity.city}</h4>
                        <p className="text-sm text-gray-600">{opportunity.reason}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl font-bold text-green-600">{opportunity.score}</span>
                        <span className="text-sm text-gray-500">/10</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        opportunity.priority === 'high' ? 'bg-green-100 text-green-700' :
                        opportunity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {opportunity.priority} priority
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Investment:</span>
                      <p className="font-semibold">${opportunity.investment.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected ROI:</span>
                      <p className="font-semibold text-green-600">{opportunity.roi}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Timeframe:</span>
                      <p className="font-semibold">{opportunity.timeframe}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Gap Analysis */}
          <div className="white-card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Market Gap Analysis</h3>
                <p className="text-gray-600 text-sm">Identify underserved segments and opportunities</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">High-Potential Segments</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertCircle className="text-green-600" size={16} />
                      <span className="font-medium text-green-800">University Cities</span>
                    </div>
                    <p className="text-sm text-green-700">High student population, low competition, strong nightlife culture</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertCircle className="text-blue-600" size={16} />
                      <span className="font-medium text-blue-800">Tourist Destinations</span>
                    </div>
                    <p className="text-sm text-blue-700">High visitor traffic, premium spending, seasonal opportunities</p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertCircle className="text-purple-600" size={16} />
                      <span className="font-medium text-purple-800">Tech Hubs</span>
                    </div>
                    <p className="text-sm text-purple-700">High disposable income, mobile-first users, early adopters</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Strategic Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="text-green-600 mt-1" size={16} />
                    <div>
                      <p className="font-medium text-sm">Focus on Brasov & Iasi</p>
                      <p className="text-xs text-gray-600">Highest ROI potential with manageable investment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Users className="text-blue-600 mt-1" size={16} />
                    <div>
                      <p className="font-medium text-sm">Target 18-35 Demographics</p>
                      <p className="text-xs text-gray-600">Core user base with highest engagement rates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Calendar className="text-purple-600 mt-1" size={16} />
                    <div>
                      <p className="font-medium text-sm">Leverage Local Events</p>
                      <p className="text-xs text-gray-600">Time launches with festivals and cultural events</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};