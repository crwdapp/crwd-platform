import React from 'react';
import { ExternalLink, BarChart3, Wine, TrendingUp } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const handleOpenBarDashboard = () => {
    // Open the bar dashboard app in a new tab
    window.open('http://localhost:3003', '_blank');
  };

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 py-12">
        <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
          <BarChart3 size={48} className="text-white" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bar Dashboard</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Your complete bar management dashboard has been moved to a dedicated application for better performance and features.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="white-card p-6 text-center">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Wine className="text-cyan-600" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Token Redemption</h3>
            <p className="text-sm text-gray-600">
              Validate customer tokens with voice input, barcode scanning, and real-time verification
            </p>
          </div>

          <div className="white-card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Analytics & KPIs</h3>
            <p className="text-sm text-gray-600">
              Track revenue, customer insights, peak hours, and operational metrics in real-time
            </p>
          </div>

          <div className="white-card p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Operations Management</h3>
            <p className="text-sm text-gray-600">
              Manage inventory, staff scheduling, queue monitoring, and bar status controls
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-12">
          <button
            onClick={handleOpenBarDashboard}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <BarChart3 size={24} />
            <span>Open Bar Dashboard</span>
            <ExternalLink size={20} />
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Opens in a new tab • Run: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev:bar-dashboard</code>
          </p>
        </div>

        {/* Quick Setup Instructions */}
        <div className="max-w-2xl mx-auto mt-16 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-semibold text-blue-900 mb-3">Quick Setup</h4>
          <div className="text-left space-y-2 text-sm text-blue-800">
            <p><strong>1.</strong> Open terminal in your project root</p>
            <p><strong>2.</strong> Run: <code className="bg-blue-100 px-2 py-1 rounded">npm run dev:bar-dashboard</code></p>
            <p><strong>3.</strong> Dashboard opens at <code className="bg-blue-100 px-2 py-1 rounded">http://localhost:3003</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};