import React, { useState } from 'react';
import { Search, TrendingUp, Users, MapPin, Clock, X } from 'lucide-react';
import { allBars } from '../../data/barsData';

export const ProductAnalyticsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate trending drinks from actual bar data
  const trendingDrinks = React.useMemo(() => {
    const drinkStats = new Map();
    
    allBars.forEach(bar => {
      bar.availableDrinksMenu.forEach(drink => {
        const key = drink.name;
        if (!drinkStats.has(key)) {
          drinkStats.set(key, {
            id: drink.id,
            name: drink.name,
            category: drink.category,
            sales: 0,
            barCount: 0
          });
        }
        const stat = drinkStats.get(key);
        stat.sales += Math.floor(Math.random() * 200) + 100; // Mock sales based on availability
        stat.barCount += 1;
      });
    });
    
    return Array.from(drinkStats.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map((drink, index) => ({
        ...drink,
        growth: `+${25 - index * 3}%` // Mock growth decreasing by rank
      }));
  }, []);

  // Calculate products by city from actual bar data
  const productsByCity = React.useMemo(() => {
    const cityStats = new Map();
    
    allBars.forEach(bar => {
      const city = bar.location;
      if (!cityStats.has(city)) {
        cityStats.set(city, new Map());
      }
      
      const cityDrinks = cityStats.get(city);
      bar.availableDrinksMenu.forEach(drink => {
        const count = cityDrinks.get(drink.name) || 0;
        cityDrinks.set(drink.name, count + 1);
      });
    });
    
    return Array.from(cityStats.entries()).map(([city, drinks]) => {
      const topDrink = Array.from(drinks.entries())
        .sort(([,a], [,b]) => b - a)[0];
      
      return {
        city,
        topProduct: topDrink?.[0] || 'House Beer',
        sales: Math.floor(Math.random() * 300) + 100 // Mock sales
      };
    });
  }, []);

  // Mock data for consumption heatmap (hour x day)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00'];
  
  // Generate mock heatmap data
  const heatmapData = hours.map(hour => 
    days.map(day => ({
      hour,
      day,
      value: Math.floor(Math.random() * 100) + 10,
      intensity: Math.random()
    }))
  );

  const getIntensityColor = (intensity: number) => {
    if (intensity > 0.8) return 'bg-cyan-600';
    if (intensity > 0.6) return 'bg-cyan-500';
    if (intensity > 0.4) return 'bg-cyan-400';
    if (intensity > 0.2) return 'bg-cyan-300';
    return 'bg-cyan-100';
  };

  const filteredDrinks = trendingDrinks.filter(drink =>
    drink.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Product Analytics</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Analyze drink performance and consumption patterns</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="white-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search drinks by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-10 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Top 5 Trending Drinks */}
      <div className="white-card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold">Top 5 Trending Drinks</h2>
            <p className="text-gray-600 text-sm">Best selling products across all locations</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredDrinks.map((drink, index) => (
            <div key={drink.id} className="white-card-secondary rounded-lg p-4">
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
                    <h3 className="font-semibold text-gray-900">{drink.name}</h3>
                    <p className="text-sm text-gray-600">{drink.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-cyan-600">{drink.sales.toLocaleString()}</p>
                  <p className="text-sm text-green-600 font-medium">{drink.growth}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Analytics Summary */}
      <div className="white-card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold">Who Consumes?</h2>
            <p className="text-gray-600 text-sm">User demographics and behavior insights</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center white-card-secondary rounded-lg p-4">
            <p className="text-2xl font-bold text-purple-600">25.3</p>
            <p className="text-sm text-gray-600">Avg Age</p>
          </div>
          <div className="text-center white-card-secondary rounded-lg p-4">
            <p className="text-2xl font-bold text-cyan-600">58%</p>
            <p className="text-sm text-gray-600">Male Users</p>
          </div>
          <div className="text-center white-card-secondary rounded-lg p-4">
            <p className="text-2xl font-bold text-green-600">3.2</p>
            <p className="text-sm text-gray-600">Avg Visits/Week</p>
          </div>
          <div className="text-center white-card-secondary rounded-lg p-4">
            <p className="text-2xl font-bold text-orange-600">Weekend</p>
            <p className="text-sm text-gray-600">Peak Time</p>
          </div>
        </div>
      </div>

      {/* Top Products by City */}
      <div className="white-card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
            <MapPin className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold">Top Products by City</h2>
            <p className="text-gray-600 text-sm">Most popular drinks in each location</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productsByCity.map((cityData, index) => (
            <div key={index} className="white-card-secondary rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{cityData.city}</h3>
                <span className="text-sm text-cyan-600 font-medium">{cityData.sales} sales</span>
              </div>
              <p className="text-sm text-gray-600">Top Product:</p>
              <p className="font-medium text-gray-900">{cityData.topProduct}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Consumption Heatmap */}
      <div className="white-card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
            <Clock className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold">Consumption by Hour & Day</h2>
            <p className="text-gray-600 text-sm">Peak consumption times throughout the week</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header with days */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="text-sm font-medium text-gray-600 text-center">Hour</div>
              {days.map(day => (
                <div key={day} className="text-sm font-medium text-gray-600 text-center">{day}</div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="space-y-1">
              {heatmapData.map((hourData, hourIndex) => (
                <div key={hourIndex} className="grid grid-cols-8 gap-1">
                  <div className="text-sm text-gray-600 text-center py-2">{hours[hourIndex]}</div>
                  {hourData.map((cell, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`h-8 rounded flex items-center justify-center text-xs font-medium text-white ${getIntensityColor(cell.intensity)}`}
                      title={`${cell.day} ${cell.hour}: ${cell.value} drinks`}
                    >
                      {cell.value}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center space-x-2 mt-4">
              <span className="text-sm text-gray-600">Less</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-cyan-100 rounded"></div>
                <div className="w-3 h-3 bg-cyan-300 rounded"></div>
                <div className="w-3 h-3 bg-cyan-400 rounded"></div>
                <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                <div className="w-3 h-3 bg-cyan-600 rounded"></div>
              </div>
              <span className="text-sm text-gray-600">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};