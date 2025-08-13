import React from 'react';
import { ArrowLeft, Clock, MapPin, DollarSign, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecentVisits: React.FC = () => {
  const navigate = useNavigate();

  const allVisits = [
    {
      id: 1,
      barName: 'The Drunken Goat',
      barImage: '/bar1.jpg',
      visitDate: '2 days ago',
      tokensUsed: 2,
      moneySaved: 45,
      location: 'Old Town',
      drinks: ['Craft Beer', 'Cocktail']
    },
    {
      id: 2,
      barName: 'Craft & Draft',
      barImage: '/bar2.jpg',
      visitDate: '1 week ago',
      tokensUsed: 1,
      moneySaved: 25,
      location: 'City Center',
      drinks: ['IPA']
    },
    {
      id: 3,
      barName: 'Beer Garden',
      barImage: '/bar3.jpg',
      visitDate: '2 weeks ago',
      tokensUsed: 3,
      moneySaved: 60,
      location: 'University Area',
      drinks: ['Lager', 'Wheat Beer', 'Cider']
    },
    {
      id: 4,
      barName: 'Hoppy Hour',
      barImage: '/bar4.jpg',
      visitDate: '3 weeks ago',
      tokensUsed: 1,
      moneySaved: 30,
      location: 'Downtown',
      drinks: ['Pale Ale']
    },
    {
      id: 5,
      barName: 'The Pub Corner',
      barImage: '/bar5.jpg',
      visitDate: '1 month ago',
      tokensUsed: 2,
      moneySaved: 40,
      location: 'Suburbs',
      drinks: ['Stout', 'Porter']
    }
  ];

  const totalVisits = allVisits.length;
  const totalMoneySaved = allVisits.reduce((total, visit) => total + visit.moneySaved, 0);
  const totalTokensUsed = allVisits.reduce((total, visit) => total + visit.tokensUsed, 0);

  return (
    <div className="h-full bg-black text-white overflow-auto">
      <div className="pb-24">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Recent Visits</h1>
          </div>

          {/* Stats Summary */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="text-[#5BC0CE]" size={20} />
              <h3 className="text-lg font-bold text-white">Visit Summary</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#5BC0CE]">{totalVisits}</p>
                <p className="text-sm text-[#D0D8E0]">Total Visits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#6FFFE9]">{totalTokensUsed}</p>
                <p className="text-sm text-[#D0D8E0]">Tokens Used</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">${totalMoneySaved}</p>
                <p className="text-sm text-[#D0D8E0]">Money Saved</p>
              </div>
            </div>
          </div>

          {/* Visits List */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Recent Visits</h3>
            
            <div className="space-y-4">
              {allVisits.slice(0, 5).map((visit) => (
                <div key={visit.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
                      <span className="text-lg">🍺</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{visit.barName}</h4>
                        <span className="text-sm text-[#D0D8E0]">{visit.visitDate}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin size={14} className="text-[#D0D8E0]" />
                        <span className="text-sm text-[#D0D8E0]">{visit.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-1">
                          <Gift size={14} className="text-[#5BC0CE]" />
                          <span className="text-xs text-[#5BC0CE]">{visit.tokensUsed} tokens</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign size={14} className="text-[#6FFFE9]" />
                          <span className="text-xs text-[#6FFFE9]">Saved ${visit.moneySaved}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {visit.drinks.map((drink, index) => (
                          <span key={index} className="text-xs bg-gray-700 px-2 py-1 rounded-full text-[#D0D8E0]">
                            {drink}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};