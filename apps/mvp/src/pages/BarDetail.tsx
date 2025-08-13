import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Calendar, Clock, Users, Music, Tag } from 'lucide-react';
import { allBars } from '../data/barsData';
import { ReviewModal } from '../components/ReviewModal';
import { DrinkSelectionModal } from '../components/DrinkSelectionModal';
import { useAppStore } from '../store';
import { BarDetailHeader } from '../components/barDetail/BarDetailHeader';
import { BarBasicInfo } from '../components/barDetail/BarBasicInfo';
import { BarDrinksMenu } from '../components/barDetail/BarDrinksMenu';
import { BarOpeningHours } from '../components/barDetail/BarOpeningHours';
import { getEventImage, handleImageError } from '../utils/imageUtils';

export const BarDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [selectedDrinkId, setSelectedDrinkId] = useState<number | null>(null);
  
  const { reviews, user } = useAppStore();

  // Find the bar by ID
  const bar = allBars.find(b => b.id === parseInt(id || '0'));
  
  // Get reviews for this bar
  const barReviews = reviews.items.filter(review => review.barId === bar?.id);
  
  // Calculate average rating from reviews
  const averageRating = barReviews.length > 0 
    ? barReviews.reduce((sum, review) => sum + review.rating, 0) / barReviews.length
    : bar?.rating || 0;

  if (!bar) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Bar not found</h1>
          <Link to="/discover" className="text-[#06B6D4] hover:text-[#0891B2] hover:underline">
            Return to Discover
          </Link>
        </div>
      </div>
    );
  }

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const handleGetDirections = () => {
    // Use geo: protocol to let user choose their preferred map app
    const geoUrl = `geo:${bar.lat},${bar.lng}?q=${bar.lat},${bar.lng}(${encodeURIComponent(bar.name)})`;
    
    // Try geo: protocol first (works on mobile), fallback to Google Maps on desktop
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
      window.location.href = geoUrl;
    } else {
      // Desktop fallback to Google Maps
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${bar.lat},${bar.lng}&destination_place_id=${encodeURIComponent(bar.name)}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const handleSubmitReview = async (reviewData: { rating: number; comment: string; barId: number }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReview = {
      id: Date.now(),
      userId: user.id!,
      userName: user.name!,
      userAvatar: user.avatar,
      barId: reviewData.barId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString(),
      helpful: 0,
      isHelpful: false
    };
    
    // Add review to store
    useAppStore.setState(state => {
      state.reviews.items.unshift(newReview);
    });
  };

  const handleMarkHelpful = (reviewId: number) => {
    useAppStore.setState(state => {
      const review = state.reviews.items.find(r => r.id === reviewId);
      if (review) {
        review.isHelpful = !review.isHelpful;
        review.helpful += review.isHelpful ? 1 : -1;
      }
    });
  };

  const handleDrinkSelect = (drinkId: number) => {
    setSelectedDrinkId(drinkId);
    setShowDrinkModal(true);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <BarDetailHeader
        bar={bar}
        isFavorited={isFavorited}
        setIsFavorited={setIsFavorited}
        setShowReviewModal={setShowReviewModal}
        averageRating={averageRating}
        barReviewsCount={barReviews.length}
        availableDrinks={bar.availableDrinks}
      />

      <div className="p-4 space-y-6">
        {/* Basic Info */}
        <BarBasicInfo
          bar={bar}
          averageRating={averageRating}
          barReviewsCount={barReviews.length}
          setShowReviewModal={setShowReviewModal}
        />

        {/* Available Drinks */}
        <BarDrinksMenu
          availableDrinksMenu={bar.availableDrinksMenu}
          availableDrinksCount={bar.availableDrinks}
          onDrinkSelect={handleDrinkSelect}
        />

        {/* Get Directions - Floating Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleGetDirections}
            className="bg-[#06B6D4] hover:bg-[#0891B2] text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl shadow-[#06B6D4]/40 hover:shadow-2xl hover:shadow-[#06B6D4]/60 transition-all duration-300 hover:scale-105 flex items-center space-x-3 border border-[#06B6D4]/30 hover:border-[#06B6D4]/50"
          >
            <MapPin size={24} className="text-white" />
            <span>Get Directions</span>
          </button>
        </div>

        {/* Hours */}
        <BarOpeningHours hours={bar.hours} />

        {/* Events */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
            <Music className="mr-2 text-[#06B6D4]" size={20} />
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {bar.events.map((event) => (
              <div 
                key={event.id} 
                onClick={() => navigate(`/event/${event.id}`)}
                className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-[#06B6D4]/20 hover:border-[#06B6D4]/30 transition-all duration-300 group relative hover:scale-[1.02] cursor-pointer"
              >
                {/* Blue accent line */}
                <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                
                {/* Event Image */}
                <div className="relative h-32">
                  <img 
                    src={getEventImage(undefined, 'music')}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, getEventImage(undefined, 'music'))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Event Status Badge */}
                  <div className="absolute top-3 left-3 bg-[#06B6D4]/90 backdrop-blur-sm text-white rounded-lg px-2 py-1 shadow-lg">
                    <span className="text-xs font-semibold">UPCOMING</span>
                  </div>
                  
                  {/* Date Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white rounded-lg px-2 py-1 shadow-lg">
                    <span className="text-xs font-semibold">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                
                {/* Event Info */}
                <div className="p-4">
                  <h4 className="font-bold text-white text-lg mb-2 line-clamp-1">{event.name}</h4>
                  
                  {/* Event Details */}
                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm text-white/75">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-[#06B6D4]" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-[#06B6D4]" />
                      <span>8:00 PM</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={14} className="text-[#06B6D4]" />
                      <span>25+ going</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Music size={14} className="text-[#06B6D4]" />
                      <span>DJ {event.dj}</span>
                    </div>
                  </div>
                  
                  {/* Event Description */}
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">
                    Join us for an amazing night with {event.dj}! Experience the best music and atmosphere in the city.
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="bg-[#06B6D4]/20 text-[#06B6D4] px-2 py-1 rounded-full text-xs font-medium border border-[#06B6D4]/30">
                      <Tag size={10} className="inline mr-1" />
                      Music
                    </span>
                    <span className="bg-[#06B6D4]/20 text-[#06B6D4] px-2 py-1 rounded-full text-xs font-medium border border-[#06B6D4]/30">
                      <Tag size={10} className="inline mr-1" />
                      DJ Set
                    </span>
                    <span className="bg-[#06B6D4]/20 text-[#06B6D4] px-2 py-1 rounded-full text-xs font-medium border border-[#06B6D4]/30">
                      <Tag size={10} className="inline mr-1" />
                      Party
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <span className="text-[#06B6D4] font-bold text-lg">FREE</span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle interested action here
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border border-white/20 hover:border-white/40"
                      >
                        Interested
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle going action here
                        }}
                        className="bg-[#06B6D4] hover:bg-[#0891B2] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 shadow-lg shadow-[#06B6D4]/30 hover:shadow-xl hover:shadow-[#06B6D4]/50"
                      >
                        Going
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        barName={bar.name}
        barId={bar.id}
        onSubmitReview={handleSubmitReview}
      />

      {/* Drink Selection Modal */}
      <DrinkSelectionModal
        isOpen={showDrinkModal}
        onClose={() => {
          setShowDrinkModal(false);
          setSelectedDrinkId(null);
        }}
        barId={bar.id}
        drinkId={selectedDrinkId || 0}
      />
    </div>
  );
};