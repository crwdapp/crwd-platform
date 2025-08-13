import React, { useState } from 'react';
import { MapPin, BarChart3, Users, TrendingUp, Building, Wine } from 'lucide-react';

export const PerformanceByCityPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('all');

  // Mock data for city performance
  const cityPerformanceData = [
    {
      id: 'bucharest',
      name: 'Bucharest',
      totalBars: 12,
      totalDrinks: 2456,
      uniqueUsers: 1234,
      growth: '+18%',
      topBar: 'Control Club',
      avgRating: 4.7,
      marketShare: 45,
      coordinates: { lat: 44.4268, lng: 26.1025 }
    },
    {
      id: 'constanta',
      name: 'Constanta',
      totalBars: 8,
      totalDrinks: 1567,
      uniqueUsers: 789,
      growth: '+15%',
      topBar: 'Plaja Gaia',
      avgRating: 4.6,
      marketShare: 25,
      coordinates: { lat: 44.1598, lng: 28.6348 }
    },
    {
      id: 'cluj',
      name: 'Cluj-Napoca',
      totalBars: 6,
      totalDrinks: 1234,
      uniqueUsers: 567,
      growth: '+22%',
      topBar: 'Form Space',
      avgRating: 4.8,
      marketShare: 15,
      coordinates: { lat: 46.7712, lng: 23.6236 }
    },
    {
      id: 'timisoara',
      name: 'Timisoara',
      totalBars: 5,
      totalDrinks: 987,
      uniqueUsers: 423,
      growth: '+12%',
      topBar: 'Scart Loc Lejer',
      avgRating: 4.5,
      marketShare: 10,
      coordinates: { lat: 45.7489, lng: 21.2087 }
    },
    {
      id: 'brasov',
      name: 'Brasov',
      totalBars: 4,
      totalDrinks: 756,
      uniqueUsers: 298,
      growth: '+8%',
      topBar: 'Deane\'s Irish Pub',
      avgRating: 4.4,
      marketShare: 5,
      coordinates: { lat: 45.6427, lng: 25.5887 }
    }
  ];

  // Mock data for detailed city breakdown
  const getCityDetails = (cityId: string) => {
    const city = cityPerformanceData.find(c => c.id === cityId);
    if (!city) return null;

    return {
      ...city,
      monthlyTrend: [
        { month: 'Jan', drinks: Math.round(city.totalDrinks * 0.7) },
        { month: 'Feb', drinks: Math.round(city.totalDrinks * 0.8) },
        { month: 'Mar', drinks: Math.round(city.totalDrinks * 0.9) },
        { month: 'Apr', drinks: city.totalDrinks }
      ],
      barBreakdown: [
        { name: city.topBar, drinks: Math.round(city.totalDrinks * 0.3), users: Math.round(city.uniqueUsers * 0.25) },
        { name: 'Bar 2', drinks: Math.round(city.totalDrinks * 0.25), users: Math.round(city.uniqueUsers * 0.2) },
        { name: 'Bar 3', drinks: Math.round(city.totalDrinks * 0.2), users: Math.round(city.uniqueUsers * 0.18) },
        { name: 'Others', drinks: Math.round(city.totalDrinks * 0.25), users: Math.round(city.uniqueUsers * 0.37) }
      ],
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 35 },
          { range: '25-34', percentage: 28 },
          { range: '35-44', percentage: 22 },
          { range: '45+', percentage: 15 }
        ],
        gender: { male: 58, female: 42 }
      }
    };
  };

  const selectedCityData = selectedCity !== 'all' ? getCityDetails(selectedCity) : null;

  // Calculate totals for all cities
  const totalStats = {
    totalBars: cityPerformanceData.reduce((sum, city) => sum + city.totalBars, 0),
    totalDrinks: cityPerformanceData.reduce((sum, city) => sum + city.totalDrinks, 0),
    totalUsers: cityPerformanceData.reduce((sum, city) => sum + city.uniqueUsers, 0),
    avgRating: (cityPerformanceData.reduce((sum, city) => sum + city.avgRating, 0) / cityPerformanceData.length).toFixed(1)
  };

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Performance by City</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Analyze brand performance across different cities</p>
        </div>
        
        {/* City Selector */}
        <div className="flex items-center space-x-2">
          <MapPin className="text-gray-600" size={16} />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-w-[150px]"
          >
            <option value="all">All Cities</option>
            {cityPerformanceData.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="white-card group hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 shadow-lg">
              <Building size={20} className="text-white" />
            </div>
            <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">TOTAL BARS</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg lg:text-2xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
              {selectedCityData ? selectedCityData.totalBars : totalStats.totalBars}
            </h3>
            <p className="text-xs font-medium text-green-600">
              {selectedCityData ? `${selectedCityData.marketShare}% market share` : 'Across 5 cities'}
            </p>
          </div>
        </div>

        <div className="white-card group hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <Wine size={20} className="text-white" />
            </div>
            <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">TOTAL DRINKS</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg lg:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
              {selectedCityData ? selectedCityData.totalDrinks.toLocaleString() : totalStats.totalDrinks.toLocaleString()}
            </h3>
            <p className="text-xs font-medium text-green-600">
              {selectedCityData ? selectedCityData.growth : '+15% overall'}
            </p>
          </div>
        </div>

        <div className="white-card group hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
              <Users size={20} className="text-white" />
            </div>
            <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">UNIQUE USERS</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg lg:text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              {selectedCityData ? selectedCityData.uniqueUsers.toLocaleString() : totalStats.totalUsers.toLocaleString()}
            </h3>
            <p className="text-xs font-medium text-green-600">
              {selectedCityData ? `${Math.round(selectedCityData.uniqueUsers / selectedCityData.totalBars)} avg/bar` : `${Math.round(totalStats.totalUsers / totalStats.totalBars)} avg/bar`}
            </p>
          </div>
        </div>

        <div className="white-card group hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">AVG RATING</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg lg:text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
              {selectedCityData ? selectedCityData.avgRating : totalStats.avgRating}
            </h3>
            <p className="text-xs font-medium text-green-600">
              {selectedCityData ? `Top: ${selectedCityData.topBar}` : 'All locations'}
            </p>
          </div>
        </div>
      </div>

      {/* City Comparison Table */}
      {selectedCity === 'all' && (
        <div className="white-card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">City Performance Comparison</h2>
              <p className="text-gray-600 text-sm">Compare metrics across all cities</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">City</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Bars</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Drinks Offered</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Unique Users</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Avg Rating</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Growth</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Market Share</th>
                </tr>
              </thead>
              <tbody>
                {cityPerformanceData.map((city, index) => (
                  <tr key={city.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCity(city.id)}>
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
                        <span className="font-medium">{city.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">{city.totalBars}</td>
                    <td className="text-center py-3 px-4 font-semibold text-green-600">{city.totalDrinks.toLocaleString()}</td>
                    <td className="text-center py-3 px-4 font-semibold text-purple-600">{city.uniqueUsers.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center space-x-1">
                        <span>⭐</span>
                        <span>{city.avgRating}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 font-medium text-green-600">{city.growth}</td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full"
                            style={{ width: `${city.marketShare}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{city.marketShare}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed City View */}
      {selectedCityData && (
        <>
          {/* City Header */}
          <div className="white-card">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl">
                  <MapPin className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedCityData.name}</h2>
                  <p className="text-gray-600">Detailed performance analysis</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCity('all')}
                className="white-button-secondary px-4 py-2 rounded-lg"
              >
                ← Back to All Cities
              </button>
            </div>
          </div>

          {/* Bar Breakdown */}
          <div className="white-card">
            <h3 className="text-lg font-bold mb-4">Bar Performance Breakdown</h3>
            <div className="space-y-4">
              {selectedCityData.barBreakdown.map((bar, index) => (
                <div key={index} className="white-card-secondary rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="font-medium">{bar.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-cyan-600">{bar.drinks} drinks</p>
                      <p className="text-sm text-gray-600">{bar.users} users</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Age Distribution */}
            <div className="white-card">
              <h3 className="text-lg font-bold mb-4">Age Distribution</h3>
              <div className="space-y-3">
                {selectedCityData.demographics.ageGroups.map((group, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{group.range}</span>
                      <span className="text-sm font-bold text-purple-600">{group.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${group.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Distribution */}
            <div className="white-card">
              <h3 className="text-lg font-bold mb-4">Gender Distribution</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Male</span>
                    <span className="text-lg font-bold text-cyan-600">{selectedCityData.demographics.gender.male}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-3 rounded-full"
                      style={{ width: `${selectedCityData.demographics.gender.male}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Female</span>
                    <span className="text-lg font-bold text-pink-600">{selectedCityData.demographics.gender.female}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-pink-600 h-3 rounded-full"
                      style={{ width: `${selectedCityData.demographics.gender.female}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};