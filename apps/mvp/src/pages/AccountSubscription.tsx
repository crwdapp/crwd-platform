import React, { useState } from 'react';
import { ArrowLeft, Shield, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccountSubscription: React.FC = () => {
  const navigate = useNavigate();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const currentPlan = {
    name: 'Premium Plan',
    price: '$9.99',
    period: 'monthly',
    status: 'Active',
    nextBilling: 'March 15, 2024',
    features: [
      'Unlimited token usage',
      'Priority customer support',
      'Exclusive bar access',
      'Advanced analytics',
      'No ads'
    ]
  };

  const availablePlans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$4.99',
      period: 'monthly',
      features: [
        '4 daily tokens',
        '1 weekly token',
        'Standard support',
        'Basic analytics'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '$9.99',
      period: 'monthly',
      current: true,
      features: [
        'Unlimited tokens',
        'Priority support',
        'Exclusive access',
        'Advanced analytics',
        'No ads'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$19.99',
      period: 'monthly',
      features: [
        'Everything in Premium',
        'VIP bar access',
        'Personal concierge',
        'Custom features',
        'Early access to new features'
      ]
    }
  ];

  const handleCancelSubscription = () => {
    // Handle subscription cancellation logic
    console.log('Subscription cancelled');
    setShowCancelConfirm(false);
  };

  const handleUpgradePlan = (planId: string) => {
    // Handle plan upgrade logic
    console.log('Plan upgraded to:', planId);
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
            <h1 className="text-xl font-bold">Subscription</h1>
          </div>

          {/* Current Plan */}
          <div className="glass-primary rounded-2xl p-6 border border-[#5BC0CE]/30">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-[#5BC0CE]" size={20} />
              <h3 className="text-lg font-bold text-white">Current Plan</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#5BC0CE]/10 rounded-lg border border-[#5BC0CE]/30">
                <div>
                  <h4 className="font-semibold text-white">{currentPlan.name}</h4>
                  <p className="text-sm text-[#D0D8E0]">{currentPlan.price}/{currentPlan.period}</p>
                  <p className="text-xs text-[#5BC0CE] mt-1">Next billing: {currentPlan.nextBilling}</p>
                </div>
                <span className="bg-[#5BC0CE] text-black px-3 py-1 rounded-full text-sm font-medium">
                  {currentPlan.status}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Plan Features:</p>
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="text-[#5BC0CE]" size={16} />
                    <span className="text-sm text-[#D0D8E0]">{feature}</span>
                  </div>
                ))}
              </div>

              {!showCancelConfirm ? (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-medium transition-colors"
                >
                  Cancel Subscription
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                    <p className="text-sm text-[#D0D8E0] text-center">
                      Are you sure you want to cancel your subscription? You'll lose access to premium features.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-3 font-medium transition-colors"
                    >
                      Keep Subscription
                    </button>
                    <button
                      onClick={handleCancelSubscription}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-medium transition-colors"
                    >
                      Confirm Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Available Plans */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Available Plans</h3>
            
            <div className="space-y-4">
              {availablePlans.map((plan) => (
                <div key={plan.id} className={`p-4 rounded-lg border ${
                  plan.current 
                    ? 'bg-[#5BC0CE]/10 border-[#5BC0CE]/30' 
                    : 'bg-gray-800/50 border-gray-700'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{plan.name}</h4>
                      <p className="text-sm text-[#D0D8E0]">{plan.price}/{plan.period}</p>
                    </div>
                    {plan.current ? (
                      <span className="bg-[#5BC0CE] text-black px-3 py-1 rounded-full text-sm font-medium">
                        Current
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUpgradePlan(plan.id)}
                        className="bg-[#5BC0CE] hover:bg-[#6FFFE9] text-black px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="text-[#5BC0CE]" size={14} />
                        <span className="text-sm text-[#D0D8E0]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Information */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Billing Information</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-[#D0D8E0]">Payment Method</span>
                <span className="text-white">Visa ending in 1234</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-[#D0D8E0]">Billing Cycle</span>
                <span className="text-white">Monthly</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-[#D0D8E0]">Next Billing Date</span>
                <span className="text-white">{currentPlan.nextBilling}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 