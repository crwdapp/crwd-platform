import React, { useState } from 'react';
import { Users, Calendar, MapPin, TrendingUp, Clock } from 'lucide-react';
import { useAppStore } from '../../store';
import { allBars } from '../../data/barsData';

export const UserAnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const { reviews } = useAppStore();

  const periods = [
    { id: 'day', label: 'Daily' },
    { id: 'week', label: 'Weekly' },
    { id: 'month', label: 'Monthly' }
  ];

  // Mock age distribution data
  const ageDistribution = [
    { range: '13-17', percentage: 8, count: 234 },
    { range: '18-24', percentage: 35, count: 1023 },
    { range: '25-34', percentage: 28, count: 819 },
    { range: '35-44', percentage: 18, count: 526 },
    { range: '45-54', percentage: 8, count: 234 },
    { range: '55+', percentage: 3, count: 88 }
  ];

  // Mock gender distribution
  const genderDistribution = {
    male: 58,
    female: 42
  };

  // Mock audience data by period
  const getAudienceData = (period: string) => {
    const data = {
      day: {
        tokens50: 156,
        tokensFree: 89,
        totalUsers: 245
      },
      week: {
        tokens50: 892,
        tokensFree: 423,
        totalUsers: 1315
      },
      month: {
        tokens50: 3456,
        tokensFree: 1834,
        totalUsers: 5290
      }
    };
    return data[period as keyof typeof data];
  };

  const currentAudienceData = getAudienceData(selectedPeriod);

  // Mock consumption by day data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00'];
  
  const consumptionHeatmap = hours.map(hour => 
    days.map(day => ({
      hour,
      day,
      value: Math.floor(Math.random() * 80) + 20,
      intensity: Math.random()
    }))
  );

  // Calculate top cities from actual bar data
  const topCities = React.useMemo(() => {
    const cityStats: Record<string, any> = {};
    
    allBars.forEach(bar => {
      // Add defensive checks
      if (!bar || !bar.location) return;
      
      const city = bar.location;
      const reviews = typeof bar.reviews === 'number' ? bar.reviews : 0;
      
      if (!cityStats[city]) {
        cityStats[city] = { city, users: 0, barCount: 0 };
      }
      cityStats[city].users += reviews * 10; // Estimate users from reviews
      cityStats[city].barCount += 1;
    });
    
    const cities = Object.values(cityStats).sort((a: any, b: any) => b.users - a.users);
    const totalUsers = cities.reduce((sum: number, city: any) => sum + city.users, 0);
    
    return cities.map((city: any) => ({
      ...city,
      percentage: Math.round((city.users / totalUsers) * 100)
    }));
  }, []);

  // Calculate top products from actual bar data
  const topProducts = React.useMemo(() => {
    const productStats = new Map();
    
    allBars.forEach(bar => {
      bar.availableDrinksMenu.forEach(drink => {
        const key = drink.name;
        if (!productStats.has(key)) {
          productStats.set(key, {
            name: drink.name,
            consumption: 0
          });
        }
        const stat = productStats.get(key);
        stat.consumption += Math.floor(Math.random() * 200) + 100;
      });
    });
    
    return Array.from(productStats.values())
      .sort((a, b) => b.consumption - a.consumption)
      .slice(0, 5)
      .map((product, index) => ({
        ...product,
        growth: `+${25 - index * 3}%`
      }));
  }, []);

  const getIntensityColor = (intensity: number) => {
    if (intensity > 0.8) return 'bg-purple-600';
    if (intensity > 0.6) return 'bg-purple-500';
    if (intensity > 0.4) return 'bg-purple-400';
    if (intensity > 0.2) return 'bg-purple-300';
    return 'bg-purple-100';
  };

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">User Analytics</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Understand your audience demographics and behavior</p>
        </div>
      </div>

      {/* Age and Gender Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Age Distribution */}
        <div className="white-card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Age Distribution</h2>
              <p className="text-gray-600 text-sm">User age demographics</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {ageDistribution.map((age, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{age.range} years</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{age.count} users</span>
                    <span className="text-sm font-bold text-purple-600">{age.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${age.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="white-card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Gender Distribution</h2>
              <p className="text-gray-600 text-sm">User gender demographics</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Male */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Male</span>
                <span className="text-lg font-bold text-cyan-600">{genderDistribution.male}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${genderDistribution.male}%` }}
                ></div>
              </div>
            </div>
            
            {/* Female */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Female</span>
                <span className="text-lg font-bold text-pink-600">{genderDistribution.female}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-pink-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${genderDistribution.female}%` }}
                ></div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center white-card-secondary rounded-lg p-4">
                <p className="text-xl font-bold text-cyan-600">{Math.round(currentAudienceData.totalUsers * genderDistribution.male / 100)}</p>
                <p className="text-xs text-gray-600">Male Users</p>
              </div>
              <div className="text-center white-card-secondary rounded-lg p-4">
                <p className="text-xl font-bold text-pink-600">{Math.round(currentAudienceData.totalUsers * genderDistribution.female / 100)}</p>
                <p className="text-xs text-gray-600">Female Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audience by Period */}
      <div className="white-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Audience by Period</h2>
              <p className="text-gray-600 text-sm">Token consumption patterns</p>
            </div>
          </div>
          
          {/* Period Selector */}
          <div className="flex items-center space-x-1">
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="white-card-secondary rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-cyan-600">{currentAudienceData.tokens50.toLocaleString()}</p>
            <p className="text-sm text-gray-600">50% Off Tokens</p>
          </div>
          <div className="white-card-secondary rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{currentAudienceData.tokensFree.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Free Tokens</p>
          </div>
          <div className="white-card-secondary rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{currentAudienceData.totalUsers.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
        </div>
      </div>

      {/* Consumption by Day Heatmap */}
      <div className="white-card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
            <Clock className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold">User Consumption Patterns</h2>
            <p className="text-gray-600 text-sm">When users are most active</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="text-sm font-medium text-gray-600 text-center">Hour</div>
              {days.map(day => (
                <div key={day} className="text-sm font-medium text-gray-600 text-center">{day}</div>
              ))}
            </div>
            
            {/* Heatmap */}
            <div className="space-y-1">
              {consumptionHeatmap.map((hourData, hourIndex) => (
                <div key={hourIndex} className="grid grid-cols-8 gap-1">
                  <div className="text-sm text-gray-600 text-center py-2">{hours[hourIndex]}</div>
                  {hourData.map((cell, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`h-8 rounded flex items-center justify-center text-xs font-medium text-white ${getIntensityColor(cell.intensity)}`}
                      title={`${cell.day} ${cell.hour}: ${cell.value} users`}
                    >
                      {cell.value}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Cities and Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Top Cities */}
        <div className="white-card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <MapPin className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Top Cities</h2>
              <p className="text-gray-600 text-sm">User distribution by location</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {topCities.map((city, index) => (
              <div key={index} className="white-card-secondary rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
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
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{city.users.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">{city.percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${city.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products Consumption */}
        <div className="white-card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Top Products</h2>
              <p className="text-gray-600 text-sm">Most consumed drinks</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="white-card-secondary rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{product.consumption.toLocaleString()}</p>
                    <p className="text-xs text-green-600">{product.growth}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};