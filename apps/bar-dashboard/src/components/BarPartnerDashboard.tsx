import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Clock, Users, TrendingUp, RefreshCw, X, Crown, Sparkles, Gift, MapPin, DollarSign } from 'lucide-react';
import { tokenService } from '../services/tokenService';

interface TokenRedemption {
  id: string;
  code: string;
  userInfo: string;
  drinkName: string;
  originalPrice: number;
  discountedPrice: number;
  tokenType: 'daily' | 'weekly';
  redeemedAt: string;
  status: 'pending' | 'redeemed' | 'expired';
}

interface BarPartnerDashboardProps {
  barId: string;
  barName: string;
  bartenderId: string;
}

export const BarPartnerDashboard: React.FC<BarPartnerDashboardProps> = ({
  barId,
  barName,
  bartenderId
}) => {
  const [tokenCode, setTokenCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentRedemptions, setRecentRedemptions] = useState<TokenRedemption[]>([]);
  const [dailyStats, setDailyStats] = useState({
    tokensRedeemed: 0,
    revenue: 0,
    uniqueCustomers: 0
  });

  // Validate token code
  const validateTokenCode = async (code: string) => {
    if (!code || code.length < 5) return;

    setIsValidating(true);
    setError(null);
    setValidationResult(null);

    try {
      const result = await tokenService.redeemTokenCode(code, bartenderId);
      setValidationResult(result);
      
      // Add to recent redemptions
      const redemption: TokenRedemption = {
        id: Date.now().toString(),
        code,
        userInfo: 'Customer',
        drinkName: result.drink_name,
        originalPrice: result.original_price,
        discountedPrice: result.discounted_price,
        tokenType: result.token_type,
        redeemedAt: new Date().toISOString(),
        status: 'redeemed'
      };
      
      setRecentRedemptions(prev => [redemption, ...prev.slice(0, 9)]);
      updateDailyStats();
      
      // Clear input after successful redemption
      setTokenCode('');
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to validate token');
    } finally {
      setIsValidating(false);
    }
  };

  // Update daily statistics
  const updateDailyStats = () => {
    setDailyStats(prev => ({
      tokensRedeemed: prev.tokensRedeemed + 1,
      revenue: prev.revenue + (validationResult?.discounted_price || 0),
      uniqueCustomers: prev.uniqueCustomers + 1
    }));
  };

  // Handle token code submission
  const handleTokenSubmit = () => {
    if (tokenCode.length >= 5) {
      validateTokenCode(tokenCode);
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      const codeMatch = result.match(/([A-Z0-9]{5,8})/i);
      if (codeMatch) {
        const extractedCode = codeMatch[0].toUpperCase();
        setTokenCode(extractedCode);
        validateTokenCode(extractedCode);
      }
    };

    recognition.start();
  };

  // Auto-clear validation result after 5 seconds
  useEffect(() => {
    if (validationResult) {
      const timer = setTimeout(() => {
        setValidationResult(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [validationResult]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-primary rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-[#5BC0CE] to-[#6FFFE9] p-3 rounded-xl">
                <Crown className="text-black" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{barName}</h1>
                <p className="text-[#D0D8E0]">Bartender Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Gift className="text-[#5BC0CE]" size={16} />
                  <span className="text-sm text-[#D0D8E0]">Today's Redemptions</span>
                </div>
                <p className="text-2xl font-bold text-[#5BC0CE]">{dailyStats.tokensRedeemed}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <DollarSign className="text-[#6FFFE9]" size={16} />
                  <span className="text-sm text-[#D0D8E0]">Revenue</span>
                </div>
                <p className="text-2xl font-bold text-[#6FFFE9]">€{dailyStats.revenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Token Validation Panel */}
          <div className="lg:col-span-2">
            <div className="glass-primary rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-[#5BC0CE] to-[#6FFFE9] p-2 rounded-lg">
                  <CheckCircle className="text-black" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-white">Token Validation</h2>
              </div>

              {/* Token Code Input */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#D0D8E0] mb-3">
                    Enter Customer Token Code
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={tokenCode}
                      onChange={(e) => setTokenCode(e.target.value.toUpperCase())}
                      placeholder="e.g., 123456"
                      className="flex-1 bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:border-[#5BC0CE] focus:ring-1 focus:ring-[#5BC0CE] transition-all font-mono text-lg text-center"
                      maxLength={6}
                      disabled={isValidating}
                    />
                    <button
                      onClick={handleVoiceInput}
                      className="px-4 py-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-xl transition-all hover:border-[#5BC0CE]"
                      title="Voice input"
                    >
                      <Users size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-[#D0D8E0] mt-2 text-center">
                    {tokenCode.length}/6 characters
                  </p>
                </div>

                {/* Validation Button */}
                <button
                  onClick={handleTokenSubmit}
                  disabled={tokenCode.length < 5 || isValidating}
                  className="w-full bg-gradient-to-r from-[#5BC0CE] to-[#6FFFE9] hover:from-[#6FFFE9] hover:to-[#5BC0CE] text-black py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {isValidating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      <span>Validating...</span>
                    </div>
                  ) : (
                    'Validate Token'
                  )}
                </button>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="text-red-500" size={20} />
                      <div>
                        <h4 className="font-semibold text-red-500 mb-1">Validation Failed</h4>
                        <p className="text-sm text-[#D0D8E0]">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Display */}
                {validationResult && (
                  <div className="bg-[#6FFFE9]/20 border border-[#6FFFE9]/30 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="text-[#6FFFE9]" size={20} />
                      <div>
                        <h4 className="font-semibold text-[#6FFFE9] mb-1">Token Validated!</h4>
                        <div className="space-y-2 text-sm text-[#D0D8E0]">
                          <p><span className="font-medium">Drink:</span> {validationResult.drink_name}</p>
                          <p><span className="font-medium">Original Price:</span> €{validationResult.original_price}</p>
                          <p><span className="font-medium">Discounted Price:</span> €{validationResult.discounted_price}</p>
                          <p><span className="font-medium">Token Type:</span> {validationResult.token_type}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="glass-primary rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 text-[#6FFFE9]" size={20} />
                Today's Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#D0D8E0]">Tokens Redeemed</span>
                  <span className="font-bold text-[#5BC0CE]">{dailyStats.tokensRedeemed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#D0D8E0]">Revenue</span>
                  <span className="font-bold text-[#6FFFE9]">€{dailyStats.revenue.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#D0D8E0]">Unique Customers</span>
                  <span className="font-bold text-[#5BC0CE]">{dailyStats.uniqueCustomers}</span>
                </div>
              </div>
            </div>

            {/* Recent Redemptions */}
            <div className="glass-primary rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Clock className="mr-2 text-[#6FFFE9]" size={20} />
                Recent Redemptions
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentRedemptions.length === 0 ? (
                  <p className="text-[#D0D8E0] text-sm text-center py-4">No recent redemptions</p>
                ) : (
                  recentRedemptions.map((redemption) => (
                    <div key={redemption.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-[#5BC0CE]">{redemption.code}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          redemption.tokenType === 'daily' 
                            ? 'bg-[#5BC0CE]/20 text-[#5BC0CE]' 
                            : 'bg-[#6FFFE9]/20 text-[#6FFFE9]'
                        }`}>
                          {redemption.tokenType}
                        </span>
                      </div>
                      <div className="text-xs text-[#D0D8E0] space-y-1">
                        <p>{redemption.drinkName}</p>
                        <p>€{redemption.originalPrice} → €{redemption.discountedPrice}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};