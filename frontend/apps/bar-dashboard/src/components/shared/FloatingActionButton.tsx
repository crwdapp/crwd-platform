import React, { useState } from 'react';
import { Plus, X, Mic, CheckCircle, AlertTriangle } from 'lucide-react';

interface FloatingActionButtonProps {
  onTokenRedeem: (code: string) => void;
  isValidating?: boolean;
  validationStatus?: 'idle' | 'success' | 'error';
  validationMessage?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onTokenRedeem,
  isValidating = false,
  validationStatus = 'idle',
  validationMessage = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tokenCode, setTokenCode] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleTokenSubmit = () => {
    if (tokenCode.length >= 5) {
      onTokenRedeem(tokenCode);
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  const handleVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      // Extract code from phrases like "redeem code Alpha 5 7 2 9" or "code Alpha-5-7-2-9"
      const codeMatch = result.match(/([A-Z0-9]{5,8}|[A-Z0-9]-[A-Z0-9]-[A-Z0-9]-[A-Z0-9]-[A-Z0-9])/i);
      if (codeMatch) {
        const extractedCode = codeMatch[0].replace(/-/g, '').toUpperCase();
        setTokenCode(extractedCode);
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleTokenCodeChange = (value: string) => {
    const cleanValue = value.replace(/[^A-Z0-9]/g, '').toUpperCase().slice(0, 8);
    setTokenCode(cleanValue);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setTokenCode('');
  };

  const getStatusColor = () => {
    switch (validationStatus) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <AlertTriangle size={20} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          {isExpanded ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>

      {/* Expanded Token Input */}
      {isExpanded && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Token Redemption</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Token Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter Token Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tokenCode}
                  onChange={(e) => handleTokenCodeChange(e.target.value)}
                  placeholder="e.g., A1B2C3D4"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  maxLength={8}
                />
                <button
                  onClick={handleVoiceCommand}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                >
                  <Mic size={16} className={isListening ? 'text-cyan-500 animate-pulse' : ''} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {tokenCode.length}/8 characters
                {isListening && ' • Listening...'}
              </p>
            </div>

            {/* Validation Status */}
            {validationStatus !== 'idle' && (
              <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                validationStatus === 'success' 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                {getStatusIcon()}
                <span className={`text-sm ${getStatusColor()}`}>
                  {validationMessage || (validationStatus === 'success' ? 'Token redeemed successfully!' : 'Invalid token code')}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleTokenSubmit}
              disabled={tokenCode.length < 5 || isValidating || validationStatus === 'success'}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
            >
              {isValidating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Validating...</span>
                </div>
              ) : validationStatus === 'success' ? (
                'Redeemed!'
              ) : (
                'Redeem Token'
              )}
            </button>

            {/* Quick Tips */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 Quick tip: Say "Hey CRWD, redeem code Alpha-5-7-2-9"</p>
              <p>📱 Tap for haptic feedback on successful redemptions</p>
              <p>🔒 Codes are time-sensitive and location-verified</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};