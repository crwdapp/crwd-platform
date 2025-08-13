import React, { useState } from 'react';
import { BarChart3, MapPin, TrendingUp, Filter, Calendar } from 'lucide-react';
import { useAppStore } from '../../store';
import { allBars } from '../../data/barsData';

export const BarsAnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCity, setSelectedCity] = useState('all');
  const { reviews } = useAppStore();

  const periods = [
    { id: 'day', label: 'Daily' },
    { id: 'week', label: 'Weekly' },
    { id: 'month', label: 'Monthly' }
  ];

  const cities = [
    { id: 'all', label: 'All Cities' },
    { id: 'bucharest', label: 'Bucharest' },
    { id: 'constanta', label: 'Constanta' },
    { id: 'cluj', label: 'Cluj-Napoca' },
    { id: 'timisoara', label: 'Timisoara' },
    { id: 'brasov', label: 'Brasov' }
  ];

  // Mock data for total tokens used
  const getTokenData = (period: string, city: string) => {
    const baseData = {
      day: { total: 234, growth: '+12%' },
      week: { total: 1567, growth: '+18%' },
      month: { total: 6789, growth: '+25%' }
    };
    
    const cityMultiplier = city === 'all' ? 1 : 
                          city === 'bucharest' ? 0.45 :
                          city === 'constanta' ? 0.25 :
                          city === 'cluj' ? 0.15 :
                          city === 'timisoara' ? 0.1 : 0.05;
    
    const data = baseData[period as keyof typeof baseData];
    return {
      total: Math.round(data.total * cityMultiplier),
      growth: data.growth
    };
  };

  const currentTokenData = getTokenData(selectedPeriod, selectedCity);

  // Calculate top bars from actual bar data
  const getTopBars = (city: string) => {
    let filteredBars = allBars;
    
    if (city !== 'all') {
      const cityName = cities.find(c => c.id === city)?.label || '';
      filteredBars = allBars.filter(bar => bar.location === cityName);
    }
    
    return filteredBars
      .map(bar => {
        const barReviews = reviews.items.filter(review => review.barId === bar.id);
        const avgRating = barReviews.length > 0 
          ? barReviews.reduce((sum, review) => sum + review.rating, 0) / barReviews.length
          : bar.rating;
        
        return {
          id: bar.id,
          name: bar.name,
          city: bar.location,
          tokens: bar.availableDrinks,
          growth: `+${Math.floor(Math.random() * 20) + 5}%`, // Mock growth
          rating: Number(avgRating.toFixed(1))
        };
      })
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 8);
  };

  const topBars = getTopBars(selectedCity);

  // Calculate city performance from actual bar data
  const cityPerformance = React.useMemo(() => {
    const cityStats = allBars.reduce((acc, bar) => {
      // Skip bars with undefined or invalid location
      if (!bar || !bar.location || typeof bar.location !== 'string') {
        return acc;
      }
      
      const city = bar.location;
      if (!acc[city]) {
        acc[city] = { city, bars: 0, tokens: 0, totalRating: 0, ratingCount: 0 };
      }
      acc[city].bars += 1;
      acc[city].tokens += bar.availableDrinks;
      acc[city].totalRating += bar.rating;
      acc[city].ratingCount += 1;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(cityStats)
      .map((city: any) => ({
        city: city.city,
        bars: city.bars,
        tokens: city.tokens,
        avgTokensPerBar: Number((city.tokens / city.bars).toFixed(1)),
        growth: `+${Math.floor(Math.random() * 15) + 8}%` // Mock growth
      }))
      .sort((a: any, b: any) => b.tokens - a.tokens);
  }, []);

  // Mock data for performance trends
  const performanceTrends = [
    { metric: 'Total Bars', value: 35, change: '+3', period: 'this month' },
    { metric: 'Active Bars', value: 32, change: '+2', period: 'this week' },
    { metric: 'Avg Tokens/Bar', value: 67.3, change: '+5.2', period: 'this week' },
    { metric: 'Top Performer', value: 'Control Club', change: '567 tokens', period: 'this week' }
  ];

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Bars Analytics</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Monitor bar performance and token usage across locations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="white-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Filter className="text-gray-600" size={20} />
            <span className="font-medium text-gray-900">Filters</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Period Selector */}
            <div className="flex items-center space-x-1">
              <Calendar className="text-gray-600" size={16} />
              {periods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedPeriod === period.id
                      ? 'white-active text-cyan-700'
                      : 'white-card-secondary text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
            
            {/* City Selector */}
            <div className="flex items-center space-x-1">
              <MapPin className="text-gray-600" size={16} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Total Tokens Used */}
      <div className="white-card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Total Tokens Used in Bars</h2>
            <p className="text-gray-600 text-sm">
              {selectedCity === 'all' ? 'All locations' : cities.find(c => c.id === selectedCity)?.label} • {periods.find(p => p.id === selectedPeriod)?.label}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="white-card-secondary rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-cyan-600 mb-2">{currentTokenData.total.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mb-1">Total Tokens</p>
            <p className="text-sm font-medium text-green-600">{currentTokenData.growth}</p>
          </div>
          <div className="white-card-secondary rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-purple-600 mb-2">{Math.round(currentTokenData.total * 0.7).toLocaleString()}</p>
            <p className="text-sm text-gray-600 mb-1">50% Off Tokens</p>
            <p className="text-sm font-medium text-green-600">+15%</p>
          </div>
          <div className="white-card-secondary rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-green-600 mb-2">{Math.round(currentTokenData.total * 0.3).toLocaleString()}</p>
            <p className="text-sm text-gray-600 mb-1">Free Tokens</p>
            <p className="text-sm font-medium text-green-600">+22%</p>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="white-card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Performance Trends</h2>
            <p className="text-gray-600 text-sm">Key metrics and changes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceTrends.map((trend, index) => (
            <div key={index} className="white-card-secondary rounded-lg p-4">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 mb-1">{trend.value}</p>
                <p className="text-sm text-gray-600 mb-2">{trend.metric}</p>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-xs font-medium text-green-600">{trend.change}</span>
                  <span className="text-xs text-gray-500">{trend.period}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Bars */}
      <div className="white-card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
            <MapPin className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Top Performing Bars</h2>
            <p className="text-gray-600 text-sm">
              Bars offering your drinks • {selectedCity === 'all' ? 'All cities' : cities.find(c => c.id === selectedCity)?.label}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          {topBars.map((bar, index) => (
            <div key={bar.id} className="white-card-secondary rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800' :
                    'bg-gradient-to-r from-cyan-500 to-cyan-600'
                  } shadow-lg`}>
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{bar.name}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span>{bar.city}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <span>⭐</span>
                        <span>{bar.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-cyan-600">{bar.tokens}</p>
                  <p className="text-sm text-green-600 font-medium">{bar.growth}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* City Performance Comparison */}
      {selectedCity === 'all' && (
        <div className="white-card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <MapPin className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">City Performance Comparison</h2>
              <p className="text-gray-600 text-sm">Compare performance across all cities</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">City</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Total Bars</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Total Tokens</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Avg/Bar</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Growth</th>
                </tr>
              </thead>
              <tbody>
                {cityPerformance.map((city, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-100 text-yellow-600' :
                          index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <span className="font-medium">{city.city}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">{city.bars}</td>
                    <td className="text-center py-3 px-4 font-semibold text-cyan-600">{city.tokens}</td>
                    <td className="text-center py-3 px-4">{city.avgTokensPerBar}</td>
                    <td className="text-center py-3 px-4 font-medium text-green-600">{city.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};