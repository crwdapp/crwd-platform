import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle, RefreshCw, Copy, Check } from 'lucide-react';
import { allBars } from '../data/barsData';

export const QRCode: React.FC = () => {
  const { drinkId } = useParams();
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [isExpired, setIsExpired] = useState(false);
  const [isUsed, setIsUsed] = useState(false);
  const [uniqueCode, setUniqueCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Generate a unique 8-character alphanumeric code
  const generateUniqueCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Find the drink and bar
  const findDrinkAndBar = () => {
    for (const bar of allBars) {
      const drink = bar.availableDrinksMenu.find(d => d.id === parseInt(drinkId || '0'));
      if (drink) {
        return { drink, bar };
      }
    }
    return { drink: null, bar: null };
  };

  const { drink, bar } = findDrinkAndBar();

  // Initialize code on component mount
  useEffect(() => {
    setUniqueCode(generateUniqueCode());
  }, []);

  // Timer effect for countdown and code regeneration
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Regenerate code and reset timer
          if (!isUsed) {
            setUniqueCode(generateUniqueCode());
            return 60; // Reset to 60 seconds
          } else {
            setIsExpired(true);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs.toString().padStart(2, '0');
  };

  const generateNewQR = () => {
    setTimeLeft(60);
    setIsExpired(false);
    setIsUsed(false);
    setUniqueCode(generateUniqueCode());
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uniqueCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (!drink || !bar) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Drink not found</h1>
          <Link to="/discover" className="text-purple-400 hover:underline">
            Return to Discover
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Link to="/discover" className="flex items-center space-x-2 text-[#D0D8E0] hover:text-white">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <h1 className="text-lg font-semibold">Your Drink Code</h1>
        <div className="w-16"></div>
      </div>

      <div className="p-4 space-y-6">
        {/* Status */}
        {!isExpired && !isUsed && (
          <div className="bg-[#6FFFE9]/20 border border-[#6FFFE9]/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-[#6FFFE9]" size={24} />
              <div>
                <h3 className="font-semibold text-[#6FFFE9]">Code Active</h3>
                <p className="text-sm text-[#D0D8E0]">Show this code to the bartender</p>
              </div>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-[#D0D8E0]" size={24} />
              <div>
                <h3 className="font-semibold text-[#D0D8E0]">Code Expired</h3>
                <p className="text-sm text-[#D0D8E0]">Generate a new code to redeem your drink</p>
              </div>
            </div>
          </div>
        )}

        {isUsed && (
          <div className="bg-[#5BC0CE]/20 border border-[#5BC0CE]/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-[#5BC0CE]" size={24} />
              <div>
                <h3 className="font-semibold text-[#5BC0CE]">Drink Redeemed</h3>
                <p className="text-sm text-[#D0D8E0]">Enjoy your {drink.name}!</p>
              </div>
            </div>
          </div>
        )}

        {/* Unique Code Display */}
        <div className="bg-gradient-to-br from-white to-gray-100 rounded-xl p-8 mx-8 shadow-2xl">
          <div className="text-center">
            <div className="bg-gradient-to-r from-[#5BC0CE] to-[#6FFFE9] bg-clip-text text-transparent text-6xl font-bold font-mono tracking-wider mb-4">
              {uniqueCode}
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center space-x-2 mx-auto bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isCopied ? (
                <>
                  <Check size={16} className="text-[#6FFFE9]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Drink Info */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">{drink.name}</h2>
          <p className="text-[#D0D8E0]">at {bar.name}</p>
        </div>

        {/* Timer */}
        {!isExpired && !isUsed && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-center space-x-3">
              <Clock className="text-[#6FFFE9]" size={24} />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#6FFFE9]">{formatTime(timeLeft)}s</p>
                <p className="text-sm text-[#D0D8E0]">Code regenerates in</p>
              </div>
            </div>
            <div className="mt-3 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#6FFFE9] to-[#5BC0CE] h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="font-semibold mb-3">How to Redeem</h3>
          <div className="space-y-3 text-sm text-[#D0D8E0]">
            <div className="flex items-start space-x-3">
              <div className="bg-[#5BC0CE] text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
              <p>Show this code to the bartender or tell them the code</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-[#5BC0CE] text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
              <p>Bartender will enter the code in their dashboard</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-[#5BC0CE] text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
              <p>Enjoy your complimentary drink!</p>
            </div>
            <div className="mt-4 p-3 bg-[#6FFFE9]/10 border border-[#6FFFE9]/30 rounded-lg">
              <p className="text-xs text-[#6FFFE9]">
                💡 Your code automatically regenerates every 60 seconds for security
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isExpired && (
          <button 
            onClick={generateNewQR}
            className="w-full bg-[#5BC0CE] hover:bg-[#6FFFE9] text-black rounded-lg py-4 font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw size={20} />
            <span>Generate New Code</span>
          </button>
        )}

        {!isExpired && !isUsed && (
          <div className="text-center">
            <p className="text-sm text-[#D0D8E0] mb-2">Having trouble?</p>
            <button className="text-[#5BC0CE] text-sm font-medium hover:underline">
              Contact Support
            </button>
          </div>
        )}
      </div>
    </div>
  );
};