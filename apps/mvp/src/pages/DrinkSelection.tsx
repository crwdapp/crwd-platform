import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Wine, Clock, MapPin, AlertCircle } from 'lucide-react';
import { allBars } from '../data/barsData';

export const DrinkSelection: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const drinkId = searchParams.get('drink');
  const [isConfirming, setIsConfirming] = useState(false);

  // Find the bar and drink
  const bar = allBars.find(b => b.id === parseInt(id || '0'));
  const drink = bar?.availableDrinksMenu.find(d => d.id === parseInt(drinkId || '0'));

  if (!bar || !drink) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Drink not found</h1>
          <Link to="/discover" className="text-[#5BC0CE] hover:text-[#6FFFE9] hover:underline">
            Return to Discover
          </Link>
        </div>
      </div>
    );
  }

  const handleConfirmSelection = () => {
    setIsConfirming(true);
  };

  const handleGenerateQR = () => {
    // Navigate to QR code page
    window.location.href = `/qr/${drink.id}`;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Link to={`/bar/${id}`} className="flex items-center space-x-2 text-[#D0D8E0] hover:text-white">
          <ArrowLeft size={20} />
          <span>Back to {bar.name}</span>
        </Link>
      </div>

      <div className="p-4 space-y-6">
        {/* Drink Details */}
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <img 
            src={drink.image || 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400'} 
            alt={drink.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold">{drink.name}</h1>
                <p className="text-[#D0D8E0]">{drink.description}</p>
              </div>
              <span className="bg-[#5BC0CE]/20 text-[#5BC0CE] px-3 py-1 rounded-full text-sm">
                {drink.category}
              </span>
            </div>

            {/* Drink Info */}
            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
              <div className="text-center">
                <p className="text-[#D0D8E0]">Volume</p>
                <p className="font-semibold">{drink.volume || 'N/A'}</p>
              </div>
              <div className="text-center">
                <p className="text-[#D0D8E0]">Alcohol</p>
                <p className="font-semibold">{drink.alcoholContent || 'N/A'}</p>
              </div>
              <div className="text-center">
                <p className="text-[#D0D8E0]">Value</p>
                <p className="font-semibold text-[#6FFFE9]">{drink.originalPrice || 'Free'}</p>
              </div>
            </div>

            {/* Bar Info */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <MapPin size={16} className="mr-2 text-[#5BC0CE]" />
                Redeem at {bar.name}
              </h3>
              <p className="text-sm text-[#D0D8E0]">{bar.address}</p>
            </div>

            {/* Important Notice */}
            <div className="bg-[#6FFFE9]/10 border border-[#6FFFE9]/30 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle size={20} className="text-[#6FFFE9] mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#6FFFE9] mb-1">Important</h4>
                  <ul className="text-sm text-[#D0D8E0] space-y-1">
                    <li>• Code is valid for a limited time only</li>
                    <li>• Must be present at the bar to redeem</li>
                    <li>• Show code to bartender</li>
                    <li>• One drink per code</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Confirmation Step */}
            {!isConfirming ? (
              <button 
                onClick={handleConfirmSelection}
                className="w-full bg-[#5BC0CE] hover:bg-[#6FFFE9] text-black rounded-lg py-4 font-semibold text-lg transition-colors"
              >
                Confirm Selection
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#5BC0CE]/20 border border-[#5BC0CE]/30 rounded-lg p-4">
                  <h3 className="font-semibold text-[#5BC0CE] mb-2">Ready to generate your code?</h3>
                  <p className="text-sm text-[#D0D8E0] mb-3">
                    Make sure you're near the bartender before generating your code. 
                    The code will be valid for a limited time.
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-[#D0D8E0]">
                    <Clock size={16} />
                    <span>Code valid for limited time</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setIsConfirming(false)}
                    className="bg-gray-700 hover:bg-gray-600 rounded-lg py-3 font-medium transition-colors"
                  >
                    Not Yet
                  </button>
                  <button 
                    onClick={handleGenerateQR}
                    className="bg-[#6FFFE9] hover:bg-[#6FFFE9]/80 text-black rounded-lg py-3 font-medium transition-colors"
                  >
                    Generate Code
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

              <p>Show your code to the bartender or tell them the code</p>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="font-semibold mb-3 flex items-center">
            <Wine className="mr-2 text-[#6FFFE9]" size={20} />
            Your Daily Drinks
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-[#D0D8E0]">Remaining today</p>
              <p className="text-2xl font-bold text-[#6FFFE9]">1</p>
            </div>
            <div className="text-right">
                💡 Your code will be generated when you're ready to redeem
              <p className="font-semibold">6h 23m</p>
            </div>
          </div>
          <div className="mt-3 bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-[#5BC0CE] to-[#6FFFE9] h-2 rounded-full w-1/2"></div>
          </div>
          <p className="text-xs text-[#D0D8E0] mt-1">1 of 2 drinks used today</p>
        </div>
      </div>
    </div>
  );
};