import React, { useState } from 'react';
import { User, Settings, Bell, CreditCard, Share2, LogOut, MapPin, Trophy, Crown, ChevronDown, ChevronUp, HelpCircle, Clock, Shield, FileText } from 'lucide-react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, getTokenCount } = useAppStore();
  const tokenCount = getTokenCount();
  
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const recentVisits = [
    {
      id: 1,
      barName: 'The Drunken Goat',
      barImage: '/bar1.jpg',
      visitDate: '2 days ago',
      tokensUsed: 2,
      moneySaved: 45,
      location: 'Old Town'
    },
    {
      id: 2,
      barName: 'Craft & Draft',
      barImage: '/bar2.jpg',
      visitDate: '1 week ago',
      tokensUsed: 1,
      moneySaved: 25,
      location: 'City Center'
    },
    {
      id: 3,
      barName: 'Beer Garden',
      barImage: '/bar3.jpg',
      visitDate: '2 weeks ago',
      tokensUsed: 3,
      moneySaved: 60,
      location: 'University Area'
    },
    {
      id: 4,
      barName: 'Hoppy Hour',
      barImage: '/bar4.jpg',
      visitDate: '3 weeks ago',
      tokensUsed: 1,
      moneySaved: 30,
      location: 'Downtown'
    }
  ];

  const userProfile = {
    name: user.name || 'John Doe',
    username: '@johndoe',
    location: user.preferences?.selectedLocation === 'NEAR_ME' ? 'Bucharest' : (user.preferences?.selectedLocation || 'Bucharest'),
    joinDate: 'January 2024',
    avatar: user.avatar || '/default-avatar.png',
    subscriptionStatus: 'Active',
    subscriptionPrice: '49 RON/month',
  };

  const menuItems = [
    { icon: Settings, label: 'Account Settings', action: () => navigate('/account') },
    { icon: Share2, label: 'Invite Friends', badge: 'Earn bonus tokens' },
    { icon: Bell, label: 'Notifications', action: () => navigate('/notifications') },
  ];

  const faqItems = [
    {
      question: 'How do tokens work?',
      answer: 'Daily tokens give you 50% off drinks and reset every day at midday. Weekly tokens give you a free drink and reset every Monday.'
    },
    {
      question: 'Can I use multiple tokens at once?',
      answer: 'No, you can only use one token per drink order. Choose wisely between daily and weekly tokens.'
    },
    {
      question: 'What happens if I don\'t use my tokens?',
      answer: 'Unused tokens expire and are replaced with new ones. Daily tokens expire at midday, weekly tokens expire on Monday.'
    },
    {
      question: 'How do I invite friends?',
      answer: 'Share your referral code with friends. When they sign up and make their first purchase, you both get bonus tokens.'
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel your subscription at any time in the Account settings. You\'ll keep your tokens until the end of your billing period.'
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleMenuItemClick = (item: any) => {
    if (item.action) {
      item.action();
    }
  };

  return (
    <div className="h-full bg-black text-white overflow-auto">
      <div className="pb-24">
        <div className="p-4 space-y-6">
          {/* Profile Header */}
          <div className="glass-primary rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#5BC0CE]"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#5BC0CE] rounded-full p-1">
                  <Crown size={16} className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white mb-1">{userProfile.name}</h1>
                <p className="text-[#5BC0CE] font-medium">CRWD Premium Member</p>
                <p className="text-[#D0D8E0] text-sm">{userProfile.username}</p>
                <div className="flex items-center space-x-1 text-sm text-[#D0D8E0] mt-1">
                  <MapPin size={14} />
                  <span>{userProfile.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Token Cards Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Free Token */}
            <div className="glass-primary rounded-2xl p-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-2">
                  <span className="text-lg">🍺</span>
                </div>
                <h3 className="text-sm font-bold text-green-500 mb-2">Free Token</h3>
                <p className="text-2xl font-bold text-green-500">1/1</p>
              </div>
            </div>

            {/* Daily Tokens */}
            <div className="glass-primary rounded-2xl p-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#5BC0CE]/20 border-2 border-[#5BC0CE] flex items-center justify-center mb-2">
                  <span className="text-lg">🎫</span>
                </div>
                <h3 className="text-sm font-bold text-[#5BC0CE] mb-2">50% Tokens</h3>
                <p className="text-2xl font-bold text-[#5BC0CE]">4/4</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-primary rounded-2xl p-6">
            <div className="space-y-3">
              {menuItems.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => handleMenuItemClick(item)}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#5BC0CE]/20 flex items-center justify-center">
                      <item.icon size={20} className="text-[#5BC0CE]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{item.label}</h4>
                      {item.badge && (
                        <p className="text-sm text-[#D0D8E0]">{item.badge}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span className="bg-[#5BC0CE] text-black text-xs px-2 py-1 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-xs text-white">→</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* FAQ Button with Dropdown */}
              <div>
                <div 
                  onClick={() => setExpandedFaq(expandedFaq === -1 ? null : -1)}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#5BC0CE]/20 flex items-center justify-center">
                      <HelpCircle size={20} className="text-[#5BC0CE]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">FAQ</h4>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                      {expandedFaq === -1 ? (
                        <ChevronDown className="text-[#D0D8E0]" size={16} />
                      ) : (
                        <ChevronUp className="text-[#5BC0CE]" size={16} />
                      )}
                    </div>
                  </div>
                </div>

                {/* FAQ Dropdown Content */}
                {expandedFaq === -1 && (
                  <div className="mt-2 ml-14 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="p-4 space-y-3">
                      {faqItems.map((item, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg">
                          <button
                            onClick={() => toggleFaq(index)}
                            className="w-full p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                          >
                            <span className="font-medium text-white text-left text-sm">{item.question}</span>
                            {expandedFaq === index ? (
                              <ChevronUp className="text-[#5BC0CE]" size={16} />
                            ) : (
                              <ChevronDown className="text-[#D0D8E0]" size={16} />
                            )}
                          </button>
                          
                          {expandedFaq === index && (
                            <div className="px-3 pb-3">
                              <p className="text-sm text-[#D0D8E0]">{item.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Visits Button */}
              <div 
                onClick={() => navigate('/recent-visits')}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#5BC0CE]/20 flex items-center justify-center">
                    <Clock size={20} className="text-[#5BC0CE]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Recent Visits</h4>
                    <p className="text-sm text-[#D0D8E0]">View your bar visits</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-xs text-white">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Section */}
          <div className="glass-primary rounded-2xl p-6">
            <div className="space-y-3">
              <div 
                onClick={() => console.log('Privacy & Policy clicked')}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#5BC0CE]/20 flex items-center justify-center">
                    <Shield size={20} className="text-[#5BC0CE]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Privacy & Policy</h4>
                    <p className="text-sm text-[#D0D8E0]">Read our privacy policy</p>
                  </div>
                </div>
                
                <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-xs text-white">→</span>
                </div>
              </div>

              <div 
                onClick={() => console.log('Terms & Conditions clicked')}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#5BC0CE]/20 flex items-center justify-center">
                    <FileText size={20} className="text-[#5BC0CE]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Terms & Conditions</h4>
                    <p className="text-sm text-[#D0D8E0]">Read our terms of service</p>
                  </div>
                </div>
                
                <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-xs text-white">→</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <button className="w-full glass-primary rounded-2xl p-4 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center space-x-2">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};