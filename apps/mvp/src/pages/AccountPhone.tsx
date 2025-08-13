import React, { useState } from 'react';
import { ArrowLeft, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccountPhone: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPhone: '+40 123 456 789',
    newPhone: '',
    confirmPhone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePhone = () => {
    // Handle phone number change logic
    console.log('Phone number changed');
    navigate('/account');
  };

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
            <h1 className="text-xl font-bold">Change Phone Number</h1>
          </div>

          {/* Current Phone Display */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <Phone className="text-[#5BC0CE]" size={20} />
              <h3 className="text-lg font-bold text-white">Current Phone Number</h3>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-[#D0D8E0] mb-1">Current Number</p>
              <p className="text-lg font-semibold text-white">{formData.currentPhone}</p>
            </div>
          </div>

          {/* Change Phone Form */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <Phone className="text-[#5BC0CE]" size={20} />
              <h3 className="text-lg font-bold text-white">Update Your Phone Number</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#D0D8E0] mb-2">New Phone Number</label>
                <input
                  type="tel"
                  value={formData.newPhone}
                  onChange={(e) => handleInputChange('newPhone', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-[#D0D8E0] focus:border-[#5BC0CE] focus:outline-none"
                  placeholder="Enter new phone number"
                />
              </div>

              <div>
                <label className="block text-sm text-[#D0D8E0] mb-2">Confirm New Phone Number</label>
                <input
                  type="tel"
                  value={formData.confirmPhone}
                  onChange={(e) => handleInputChange('confirmPhone', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-[#D0D8E0] focus:border-[#5BC0CE] focus:outline-none"
                  placeholder="Confirm new phone number"
                />
              </div>

              <button
                onClick={handleSavePhone}
                className="w-full bg-[#5BC0CE] hover:bg-[#6FFFE9] text-black rounded-lg py-3 font-medium transition-colors"
              >
                Save Phone Number
              </button>
            </div>
          </div>

          {/* Phone Number Info */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Phone Number Information</h3>
            
            <div className="space-y-3 text-sm text-[#D0D8E0]">
              <p>• Your phone number is used for account verification</p>
              <p>• You'll receive a verification code via SMS</p>
              <p>• Make sure to enter a valid phone number</p>
              <p>• The number should include country code (e.g., +40)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 