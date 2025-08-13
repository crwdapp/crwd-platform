import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    personalizedEmails: false,
    tokenReminders: true,
    newBarAlerts: true,
    eventUpdates: false,
    promotionalOffers: true
  });

  const handleToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const notificationSettings = [
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Receive instant notifications on your device',
      enabled: notifications.pushNotifications
    },
    {
      key: 'personalizedEmails',
      title: 'Personalized Emails',
      description: 'Get customized email updates about your activity',
      enabled: notifications.personalizedEmails
    },
    {
      key: 'tokenReminders',
      title: 'Token Reminders',
      description: 'Get notified when your tokens are about to expire',
      enabled: notifications.tokenReminders
    },
    {
      key: 'newBarAlerts',
      title: 'New Bar Alerts',
      description: 'Discover new bars added to your area',
      enabled: notifications.newBarAlerts
    },
    {
      key: 'eventUpdates',
      title: 'Event Updates',
      description: 'Stay updated on events at your favorite bars',
      enabled: notifications.eventUpdates
    },
    {
      key: 'promotionalOffers',
      title: 'Promotional Offers',
      description: 'Receive special deals and exclusive offers',
      enabled: notifications.promotionalOffers
    }
  ];

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
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>

          {/* Notification Settings */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Notification Preferences</h3>
            
            <div className="space-y-4">
              {notificationSettings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{setting.title}</h4>
                    <p className="text-sm text-[#D0D8E0]">{setting.description}</p>
                  </div>
                  
                  <button
                    onClick={() => handleToggle(setting.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#5BC0CE] focus:ring-offset-2 focus:ring-offset-black ${
                      setting.enabled 
                        ? 'bg-[#5BC0CE]' 
                        : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ease-in-out ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Info */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">About Notifications</h3>
            
            <div className="space-y-3 text-sm text-[#D0D8E0]">
              <p>
                • <strong>Push Notifications</strong> appear on your device even when the app is closed
              </p>
              <p>
                • <strong>Personalized Emails</strong> are sent to your registered email address
              </p>
              <p>
                • <strong>Token Reminders</strong> help you use your tokens before they expire
              </p>
              <p>
                • <strong>New Bar Alerts</strong> notify you when new bars are added to your area
              </p>
              <p>
                • <strong>Event Updates</strong> keep you informed about events at your favorite bars
              </p>
              <p>
                • <strong>Promotional Offers</strong> include special deals and exclusive discounts
              </p>
            </div>
          </div>

          {/* Save Button */}
          <button className="w-full glass-primary border border-[#5BC0CE]/30 rounded-2xl p-4 text-[#5BC0CE] hover:bg-[#5BC0CE]/10 hover:border-[#5BC0CE]/50 transition-colors flex items-center justify-center space-x-2">
            <span className="font-medium">Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 