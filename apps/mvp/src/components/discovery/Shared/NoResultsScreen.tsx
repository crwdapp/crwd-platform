import React from 'react';
import { MapPin, Filter, Radius, TrendingUp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store';

interface NoResultsScreenProps {
  type: 'no_nearby_bars' | 'no_filtered_results' | 'no_search_results';
  searchQuery?: string;
}

export const NoResultsScreen: React.FC<NoResultsScreenProps> = ({ type, searchQuery }) => {
  const navigate = useNavigate();
  const { user } = useAppStore();

  const getContent = () => {
    switch (type) {
      case 'no_nearby_bars':
        return {
          title: 'No bars nearby',
          subtitle: 'We couldn\'t find any bars in your area',
          suggestions: [
            {
              icon: <Filter size={20} />,
              title: 'Explore Popular Cities',
              description: 'Check out bars in Bucharest, Constanta, or Cluj',
              action: () => navigate('/location'),
              primary: true
            },
            {
              icon: <Radius size={20} />,
              title: 'Expand Search Area',
              description: 'Try different filters or search criteria',
              action: () => navigate('/filter')
            }
          ]
        };
      
      case 'no_filtered_results':
        return {
          title: 'No matches found',
          subtitle: `No bars match your current filters in ${user.preferences.selectedLocation}`,
          suggestions: [
            {
              icon: <Filter size={20} />,
              title: 'Adjust Filters',
              description: 'Try removing some filters or change your preferences',
              action: () => navigate('/filter'),
              primary: true
            },
            {
              icon: <MapPin size={20} />,
              title: 'Try Different Location',
              description: 'Explore bars in other cities',
              action: () => navigate('/location')
            }
          ]
        };
      
      case 'no_search_results':
        return {
          title: 'No search results',
          subtitle: `No bars found for "${searchQuery}"`,
          suggestions: [
            {
              icon: <TrendingUp size={20} />,
              title: 'Browse Popular Bars',
              description: 'Check out what\'s trending in your area',
              action: () => {
                useAppStore.setState(state => {
                  state.ui.searchQuery = '';
                });
              },
              primary: true
            },
            {
              icon: <MapPin size={20} />,
              title: 'Try Different Location',
              description: 'Search in other cities',
              action: () => navigate('/location')
            }
          ]
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-sm mx-auto">

        {/* Title & Subtitle */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">{content.title}</h3>
          <p className="text-white/70 text-sm leading-relaxed">{content.subtitle}</p>
        </div>

        {/* Action Suggestions */}
        <div className="space-y-3">
          {content.suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={suggestion.action}
              className={`w-full p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                suggestion.primary
                  ? 'bg-[#06B6D4] hover:bg-[#0891B2] border-[#06B6D4] text-white shadow-lg shadow-[#06B6D4]/25'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${
                  suggestion.primary ? 'bg-white/20' : 'bg-[#06B6D4]/20'
                }`}>
                  {suggestion.icon}
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                  <p className={`text-xs mt-1 ${
                    suggestion.primary ? 'text-white/80' : 'text-white/60'
                  }`}>
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Subtle decoration */}
        <div className="mt-8 flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 bg-white/20 rounded-full"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};