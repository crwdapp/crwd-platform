import React, { useState } from 'react';
import { ArrowLeft, Lock, Phone, CreditCard, Trash2, ChevronRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';

export const Account: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isPremium = user.subscription?.status === 'premium';

  const accountSections = [
    {
      id: 'subscription',
      title: 'Subscription',
      description: 'Manage your subscription plan',
      icon: Shield,
      action: () => navigate('/account/subscription')
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      description: 'Manage your payment methods',
      icon: CreditCard,
      action: () => navigate('/account/payment')
    },
    {
      id: 'password',
      title: 'Change Password',
      description: 'Update your account password',
      icon: Lock,
      action: () => navigate('/account/password')
    },
    {
      id: 'phone',
      title: 'Phone Number',
      description: 'Update your phone number',
      icon: Phone,
      action: () => navigate('/account/phone')
    }
  ];

  const handleDeleteAccount = () => {
    // Handle account deletion logic
    console.log('Account deleted');
    navigate('/');
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
            <h1 className="text-xl font-bold">Account Settings</h1>
          </div>

          {/* Subscription Status */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Subscription Status</h3>
              {isPremium ? (
                <span className="bg-[#5BC0CE] text-black px-3 py-1 rounded-full text-sm font-medium">
                  Premium
                </span>
              ) : (
                <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Free
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-[#D0D8E0]">Current Plan</span>
                <span className="text-white">{user.subscription?.plan || 'Free Plan'}</span>
              </div>
              {isPremium && user.subscription?.nextBilling && (
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-[#D0D8E0]">Next Billing</span>
                  <span className="text-white">{new Date(user.subscription.nextBilling).toLocaleDateString()}</span>
                </div>
              )}
              {!isPremium && (
                <div className="p-4 bg-[#5BC0CE]/10 rounded-lg border border-[#5BC0CE]/30">
                  <p className="text-sm text-[#D0D8E0] text-center mb-3">
                    Upgrade to Premium to unlock tokens and exclusive features!
                  </p>
                  <button
                    onClick={() => navigate('/account/subscription')}
                    className="w-full bg-[#5BC0CE] hover:bg-[#6FFFE9] text-black rounded-lg py-2 font-medium transition-colors"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Account Sections */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Account Management</h3>
            
            <div className="space-y-3">
              {accountSections.map((section) => (
                <div 
                  key={section.id}
                  onClick={section.action}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#5BC0CE]/20 flex items-center justify-center">
                      <section.icon size={20} className="text-[#5BC0CE]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{section.title}</h4>
                      <p className="text-sm text-[#D0D8E0]">{section.description}</p>
                    </div>
                  </div>
                  
                  <ChevronRight size={20} className="text-[#D0D8E0]" />
                </div>
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Account Information</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-[#D0D8E0]">Email</span>
                <span className="text-white">user@email.com</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-[#D0D8E0]">Phone</span>
                <span className="text-white">+40 123 456 789</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-[#D0D8E0]">Member since</span>
                <span className="text-white">January 2024</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-[#D0D8E0]">Subscription</span>
                <span className={isPremium ? "text-[#5BC0CE]" : "text-gray-400"}>
                  {isPremium ? 'Active' : 'Free'}
                </span>
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="glass-primary rounded-2xl p-6 border border-red-500/30">
            <div className="flex items-center space-x-3 mb-4">
              <Trash2 className="text-red-400" size={20} />
              <h3 className="text-lg font-bold text-red-400">Delete Account</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                <Shield className="text-red-400 mt-1" size={16} />
                <div>
                  <p className="text-red-400 font-medium mb-1">Warning</p>
                  <p className="text-sm text-[#D0D8E0]">
                    This action cannot be undone. All your data, tokens, and account information will be permanently deleted.
                  </p>
                </div>
              </div>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-medium transition-colors"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-[#D0D8E0] text-center">
                    Are you sure you want to delete your account? This action cannot be undone.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-3 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-medium transition-colors"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 