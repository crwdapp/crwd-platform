import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MessageSquare, Wine, ArrowUpRight } from 'lucide-react';
import { Bar } from '../../types/bar';

interface BarDetailHeaderProps {
  bar: Bar;
  isFavorited: boolean;
  setIsFavorited: (favorited: boolean) => void;
  setShowReviewModal: (show: boolean) => void;
  averageRating: number;
  barReviewsCount: number;
  availableDrinks: number;
}

export const BarDetailHeader: React.FC<BarDetailHeaderProps> = ({
  bar,
  isFavorited,
  setIsFavorited,
  setShowReviewModal,
  availableDrinks
}) => {
  return (
    <div className="relative h-64">
      <img 
        src={bar.images[0]} 
        alt={bar.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      {/* Navigation */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Link to="/discover" className="bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `Check out ${bar.name}`,
                text: `Let's meet at ${bar.name}! They have ${availableDrinks} drinks available today.`,
                url: window.location.href
              });
            } else {
              // Fallback for browsers without Web Share API
              navigator.clipboard.writeText(window.location.href);
              // You could show a toast notification here
            }
          }}
          className="bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-2 hover:bg-black/70 transition-colors flex items-center space-x-2"
        >
          <span className="text-white font-medium text-sm">Meet Here</span>
          <ArrowUpRight size={16} className="text-white" />
        </button>
      </div>

      {/* Available Drinks Badge */}
      <div className="absolute bottom-4 right-4 bg-black/70 rounded-lg px-3 py-2 flex items-center space-x-2">
        <Wine size={18} className="text-[#6FFFE9]" />
        <span className="text-[#6FFFE9] font-bold">{availableDrinks} drinks available today</span>
      </div>
    </div>
  );
};