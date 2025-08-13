import React from 'react';
import { Star, User, ThumbsUp } from 'lucide-react';

interface Review {
  id: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  isHelpful?: boolean;
}

interface ReviewsListProps {
  reviews: Review[];
  onMarkHelpful?: (reviewId: number) => void;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ 
  reviews, 
  onMarkHelpful 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`${
              star <= rating
                ? 'text-[#6FFFE9] fill-current'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="mx-auto mb-4 text-[#D0D8E0]" size={36} />
        <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
        <p className="text-[#D0D8E0] text-sm">
          Be the first to share your experience at this bar!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="glass-secondary rounded-lg p-4">
          {/* Review Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#5BC0CE] to-[#6FFFE9] rounded-full flex items-center justify-center">
                {review.userAvatar ? (
                  <img 
                    src={review.userAvatar} 
                    alt={review.userName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-black" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-white">{review.userName}</h4>
                <div className="flex items-center space-x-2">
                  {renderStars(review.rating)}
                  <span className="text-xs text-[#D0D8E0]">
                    {formatDate(review.date)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Comment */}
          {review.comment && (
            <p className="text-[#D0D8E0] text-sm mb-3 leading-relaxed">
              {review.comment}
            </p>
          )}

          {/* Review Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onMarkHelpful && (
                <button
                  onClick={() => onMarkHelpful(review.id)}
                  className={`flex items-center space-x-1 text-xs transition-colors ${
                    review.isHelpful
                      ? 'text-[#6FFFE9]'
                      : 'text-[#D0D8E0] hover:text-[#5BC0CE]'
                  }`}
                >
                  <ThumbsUp size={12} className={review.isHelpful ? 'fill-current' : ''} />
                  <span>Helpful ({review.helpful})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};