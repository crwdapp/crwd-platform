import React, { useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccountPassword: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePassword = () => {
    // Handle password change logic
    console.log('Password changed');
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
            <h1 className="text-xl font-bold">Change Password</h1>
          </div>

          {/* Change Password Form */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="text-[#5BC0CE]" size={20} />
              <h3 className="text-lg font-bold text-white">Update Your Password</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#D0D8E0] mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-[#D0D8E0] focus:border-[#5BC0CE] focus:outline-none"
                    placeholder="Enter current password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#D0D8E0] hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#D0D8E0] mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-[#D0D8E0] focus:border-[#5BC0CE] focus:outline-none"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#D0D8E0] mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-[#D0D8E0] focus:border-[#5BC0CE] focus:outline-none"
                    placeholder="Confirm new password"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#D0D8E0] hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSavePassword}
                className="w-full bg-[#5BC0CE] hover:bg-[#6FFFE9] text-black rounded-lg py-3 font-medium transition-colors"
              >
                Save Password
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Password Requirements</h3>
            
            <div className="space-y-2 text-sm text-[#D0D8E0]">
              <p>• At least 8 characters long</p>
              <p>• Include uppercase and lowercase letters</p>
              <p>• Include at least one number</p>
              <p>• Include at least one special character</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 