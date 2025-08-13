import React from 'react';
import { Star, MapPin, Clock, Users } from 'lucide-react';
import { Bar } from '../../types/bar';

interface BarBasicInfoProps {
  bar: Bar;
  averageRating: number;
  barReviewsCount: number;
  setShowReviewModal: (show: boolean) => void;
}

export const BarBasicInfo: React.FC<BarBasicInfoProps> = ({
  bar,
  averageRating,
  barReviewsCount,
  setShowReviewModal
}) => {
  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white">{bar.name}</h1>
          <p className="text-white/75">{bar.type} • {bar.priceRange}</p>
        </div>
        <div className="text-right">
          <button 
            onClick={() => setShowReviewModal(true)}
            className="flex items-center space-x-1 hover:bg-white/10 rounded-lg p-2 transition-colors"
            title="Tap to write a review"
          >
            <Star size={16} className="text-[#06B6D4]" />
            <span className="font-semibold text-white">{averageRating.toFixed(1)}</span>
            <span className="text-white/75 text-sm">({barReviewsCount + bar.reviews})</span>
          </button>
        </div>
      </div>

      <p className="text-white/75 text-sm mb-4">{bar.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {bar.tags.map((tag) => (
          <span key={tag} className="bg-[#06B6D4]/20 text-[#06B6D4] px-3 py-1 rounded-full text-sm border border-[#06B6D4]/20">
            {tag}
          </span>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2 text-white/75">
          <MapPin size={16} />
          <span>{bar.distance || '0.5km'}</span>
        </div>
        <div className="flex items-center space-x-2 text-white/75">
          <Clock size={16} />
          <span>Open until {bar.openUntil}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users size={16} className={getCrowdColor(bar.crowdLevel)} />
          <span className={getCrowdColor(bar.crowdLevel)}>{bar.crowdLevel} crowd</span>
        </div>
      </div>
    </div>
  );
};