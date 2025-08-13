import React, { useState, useEffect } from 'react';
import { X, Wine, Clock, MapPin, AlertCircle, Copy, Check, RefreshCw, Gift, Calendar, Navigation, AlertTriangle, Crown, Sparkles, Info } from 'lucide-react';
import { allBars } from '../data/barsData';
import { useAppStore } from '../store';
import { tokenService } from '../services/api/tokenService';

interface DrinkSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  barId: number;
  drinkId: number;
}

type ModalStep = 'selection' | 'code' | 'error' | 'subscription-upgrade';

export const DrinkSelectionModal: React.FC<DrinkSelectionModalProps> = ({
  isOpen,
  onClose,
  barId,
  drinkId
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [uniqueCode, setUniqueCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<ModalStep>('selection');

  const { getAvailableTokens, getTokenCount, useToken, generateTokenCode, user, toggleSubscriptionForTesting, initializeTokensForTesting } = useAppStore();
  const tokens = getAvailableTokens();
  const tokenCount = getTokenCount();

  // Find the bar and drink
  const bar = allBars.find(b => b.id === barId);
  const drink = bar?.availableDrinksMenu.find(d => d.id === drinkId);

  // Calculate discounted price for daily tokens
  const calculateDiscountedPrice = (originalPrice: string) => {
    const price = parseFloat(originalPrice.replace(/[^0-9.]/g, ''));
    return isNaN(price) ? 'Free' : `$${(price * 0.5).toFixed(2)}`;
  };

  // Debug panel for testing
  const DebugPanel = () => (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 mb-4">
      <h4 className="text-sm font-semibold text-[#6FFFE9] mb-3">🧪 Debug Panel</h4>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-[#D0D8E0]">Status:</span>
          <span className={user.subscription.status === 'premium' ? 'text-[#6FFFE9]' : 'text-orange-500'}>
            {user.subscription.status.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#D0D8E0]">Daily Tokens:</span>
          <span className="text-[#5BC0CE]">{tokenCount.daily}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#D0D8E0]">Weekly Tokens:</span>
          <span className="text-[#6FFFE9]">{tokenCount.weekly}</span>
        </div>
        <div className="flex space-x-2 mt-3">
          <button
            onClick={toggleSubscriptionForTesting}
            className="bg-[#5BC0CE] hover:bg-[#6FFFE9] text-black px-3 py-1 rounded text-xs font-medium"
          >
            Toggle {user.subscription.status === 'free' ? 'Premium' : 'Free'}
          </button>
          {user.subscription.status === 'premium' && (
            <button
              onClick={initializeTokensForTesting}
              className="bg-[#6FFFE9] hover:bg-[#5BC0CE] text-black px-3 py-1 rounded text-xs font-medium"
            >
              Reset Tokens
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Generate a unique 6-character alphanumeric code (fallback)
  const generateUniqueCode = () => {
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  // Initialize code when moving to code step
  useEffect(() => {
    if (currentStep === 'code' && !uniqueCode) {
      setUniqueCode(generateUniqueCode());
      setTimeLeft(60);
    }
  }, [currentStep, uniqueCode]);

  // Timer countdown
  useEffect(() => {
    if (currentStep === 'code' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      // Regenerate code when timer reaches 0
      setUniqueCode(generateUniqueCode());
      setTimeLeft(60);
    }
  }, [currentStep, timeLeft]);

  const handleTokenSelected = async (tokenId: string) => {
    setSelectedTokenId(tokenId);
    setIsGenerating(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock code directly (6 numbers like authenticator)
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += Math.floor(Math.random() * 10).toString();
      }
      
      setUniqueCode(result);
      setCurrentStep('code');
    } catch (error) {
      console.error('Failed to generate code:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate code');
      setCurrentStep('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('selection');
    setUniqueCode('');
    setSelectedTokenId(null);
    setError(null);
    setTimeLeft(60);
    onClose();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uniqueCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(2, '0');
  };

  if (!isOpen || !bar || !drink) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-primary rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {currentStep === 'selection' && 'Select Token'}
                {currentStep === 'code' && 'Your Drink Code'}
                {currentStep === 'error' && 'Error'}
                {currentStep === 'subscription-upgrade' && 'Upgrade to Premium'}
              </h3>
              <p className="text-sm text-[#D0D8E0]">{bar.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-[#D0D8E0] hover:text-white transition-colors p-2"
            >
              <X size={20} />
            </button>
          </div>

          {/* Error Step */}
          {currentStep === 'error' && (
            <div className="space-y-6">
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="text-red-500" size={24} />
                  <div>
                    <h4 className="font-semibold text-red-500 mb-2">Unable to Generate Code</h4>
                    <p className="text-sm text-[#D0D8E0]">{error}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setCurrentStep('selection')}
                  className="w-full bg-[#5BC0CE] hover:bg-[#6FFFE9] text-black rounded-lg py-3 font-medium transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-3 font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Main Selection Step */}
          {currentStep === 'selection' && (
            <div className="space-y-6">
              {/* Debug Panel */}
              <DebugPanel />
              
              {/* Drink Image */}
              <div className="relative h-48 rounded-xl overflow-hidden">
                <img 
                  src={drink.image || 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                  alt={drink.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-xl font-bold text-white mb-1">{drink.name}</h2>
                  <span className="bg-[#5BC0CE]/20 text-[#5BC0CE] px-3 py-1 rounded-full text-sm">
                    {drink.category}
                  </span>
                </div>
              </div>

              {/* Drink Info */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[#D0D8E0] text-sm">Volume</p>
                    <p className="font-semibold text-white">{drink.volume || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[#D0D8E0] text-sm">Alcohol</p>
                    <p className="font-semibold text-white">{drink.alcoholContent || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[#D0D8E0] text-sm">Price</p>
                    <p className="font-semibold text-[#6FFFE9]">{drink.originalPrice || 'Free'}</p>
                  </div>
                </div>
              </div>

              {/* Token Selection */}
              {user.subscription.status === 'free' ? (
                <div className="space-y-4">
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Info className="text-orange-500" size={20} />
                      <div>
                        <h4 className="font-semibold text-orange-500 mb-1">Upgrade to Premium</h4>
                        <p className="text-sm text-[#D0D8E0]">Get daily and weekly tokens for discounts</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentStep('subscription-upgrade')}
                    className="w-full bg-gradient-to-r from-[#5BC0CE] to-[#6FFFE9] hover:from-[#6FFFE9] hover:to-[#5BC0CE] text-black rounded-lg py-4 font-semibold text-lg transition-all transform hover:scale-105"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Token Buttons Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Weekly Token (Free) */}
                    {tokens.weekly.length > 0 && (
                      <button
                        onClick={() => handleTokenSelected(tokens.weekly[0].id)}
                        disabled={isGenerating}
                        className="w-full p-6 rounded-xl bg-gradient-to-br from-[#6FFFE9] to-[#5BC0CE] hover:from-[#5BC0CE] hover:to-[#6FFFE9] text-black font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        FREE
                      </button>
                    )}

                    {/* Daily Token (Count) */}
                    {tokens.daily.length > 0 && (
                      <button
                        onClick={() => handleTokenSelected(tokens.daily[0].id)}
                        disabled={isGenerating}
                        className="w-full p-6 rounded-xl bg-gradient-to-br from-[#5BC0CE] to-[#6FFFE9] hover:from-[#6FFFE9] hover:to-[#5BC0CE] text-black font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {tokenCount.daily}/{tokenCount.daily}
                      </button>
                    )}
                  </div>

                  {/* No Tokens Available */}
                  {tokens.daily.length === 0 && tokens.weekly.length === 0 && (
                    <div className="bg-[#6FFFE9]/10 border border-[#6FFFE9]/30 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="text-[#6FFFE9]" size={20} />
                        <div>
                          <h4 className="font-semibold text-[#6FFFE9] mb-1">No Tokens Available</h4>
                          <p className="text-sm text-[#D0D8E0]">
                            You've used all your tokens. You can still order without a token.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading State */}
                  {isGenerating && (
                    <div className="flex items-center justify-center space-x-3 py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5BC0CE]"></div>
                      <span className="text-[#D0D8E0]">Generating code...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Subscription Upgrade Step */}
          {currentStep === 'subscription-upgrade' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Upgrade to Premium</h3>
                <p className="text-sm text-[#D0D8E0]">Unlock exclusive drink benefits</p>
              </div>

              {/* Drink Preview */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={drink.image || 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                    alt={drink.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{drink.name}</h3>
                    <p className="text-sm text-[#D0D8E0]">{drink.category}</p>
                    <p className="text-sm text-[#6FFFE9]">{drink.originalPrice}</p>
                  </div>
                </div>
              </div>

              {/* Premium Benefits */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#5BC0CE]/20 to-[#6FFFE9]/20 border border-[#5BC0CE]/30 rounded-lg p-4">
                  <h4 className="font-semibold text-[#6FFFE9] mb-3 flex items-center">
                    <Crown size={20} className="mr-2" />
                    Premium Benefits
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-[#5BC0CE] rounded-full p-1">
                        <Clock size={12} className="text-black" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">4 Daily Tokens</p>
                        <p className="text-xs text-[#D0D8E0]">50% off drinks every day</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-[#6FFFE9] rounded-full p-1">
                        <Calendar size={12} className="text-black" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">1 Weekly Token</p>
                        <p className="text-xs text-[#D0D8E0]">Free drink every week</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-[#5BC0CE] rounded-full p-1">
                        <MapPin size={12} className="text-black" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Partner Bars</p>
                        <p className="text-xs text-[#D0D8E0]">Access to exclusive venues</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Comparison */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h5 className="font-semibold text-white mb-3">Your Savings</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#D0D8E0]">Without Premium</span>
                      <span className="text-sm text-white">{drink.originalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#D0D8E0]">With Daily Token (50% off)</span>
                      <span className="text-sm text-[#5BC0CE] font-medium">
                        {drink.originalPrice ? calculateDiscountedPrice(drink.originalPrice) : 'Free'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#D0D8E0]">With Weekly Token (Free)</span>
                      <span className="text-sm text-[#6FFFE9] font-medium">Free</span>
                    </div>
                  </div>
                </div>

                {/* Subscription Plans */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-white">Choose Your Plan</h5>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border-2 border-[#5BC0CE] bg-[#5BC0CE]/10 cursor-pointer hover:bg-[#5BC0CE]/20 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <h6 className="font-semibold text-[#5BC0CE]">Monthly Premium</h6>
                          <p className="text-sm text-[#D0D8E0]">$9.99/month</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-[#5BC0CE] text-black px-3 py-1 rounded-full text-xs font-medium">
                            POPULAR
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-gray-700 bg-gray-800/50 cursor-pointer hover:border-gray-600 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <h6 className="font-semibold text-white">Annual Premium</h6>
                          <p className="text-sm text-[#D0D8E0]">$99.99/year (Save 17%)</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-[#6FFFE9] text-black px-3 py-1 rounded-full text-xs font-medium">
                            BEST VALUE
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // TODO: Implement subscription upgrade logic
                    console.log('Upgrade to premium clicked');
                    // For now, just proceed to token selection (simulating upgrade)
                    setCurrentStep('selection');
                  }}
                  className="w-full bg-gradient-to-r from-[#5BC0CE] to-[#6FFFE9] hover:from-[#6FFFE9] hover:to-[#5BC0CE] text-black rounded-lg py-4 font-semibold text-lg transition-all transform hover:scale-105"
                >
                  Upgrade to Premium
                </button>
                <button
                  onClick={() => setCurrentStep('selection')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-3 font-medium transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          )}

          {/* Code Step */}
          {currentStep === 'code' && (
            <div className="space-y-6">
              {/* Code Display */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 text-center">
                <div className="text-6xl font-bold font-mono tracking-wider text-[#6FFFE9]">
                  {uniqueCode}
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center space-x-2 text-sm text-[#D0D8E0]">
                <Clock className="text-[#6FFFE9]" size={16} />
                <span>Regenerates in <span className="text-[#6FFFE9] font-medium">{formatTime(timeLeft)}s</span></span>
              </div>

              {/* Instructions */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="font-semibold mb-3 text-white">How to Redeem</h3>
                <div className="space-y-3 text-sm text-[#D0D8E0]">
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#5BC0CE] text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                    <p>Show this code to the bartender</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#5BC0CE] text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                    <p>Bartender will validate the code</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#5BC0CE] text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                    <p>Enjoy your drink!</p>
                  </div>
                </div>
              </div>

              {/* Generate New Code Button */}
              <button 
                onClick={() => {
                  setCurrentStep('selection');
                  setUniqueCode('');
                  setSelectedTokenId(null);
                }}
                disabled={isGenerating}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-3 font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={20} />
                    <span>Generate New Code</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};