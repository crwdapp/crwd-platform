import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Calendar, Home, LogOut, Settings, User, Menu, X, PartyPopper } from 'lucide-react';
import { RoleSelectionModal } from './RoleSelectionModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onSetUserRole?: (role: 'member' | 'bar_owner' | 'brand_owner') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onSetUserRole }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showRoleSelectionModal, setShowRoleSelectionModal] = React.useState(false);

  const handleShowRoleSelectionModal = () => {
    setShowRoleSelectionModal(true);
  };

  const handleCloseRoleSelectionModal = () => {
    setShowRoleSelectionModal(false);
  };

  const handleSelectRole = (role: 'member' | 'bar_owner' | 'brand_owner') => {
    if (onSetUserRole) {
      onSetUserRole(role);
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Overview' },
    { path: '/dashboard/campaigns', icon: Calendar, label: 'Campaigns' },
    { path: '/dashboard/events', icon: PartyPopper, label: 'Events' },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 safe-area-inset-top shadow-sm">
        <div className="px-4 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden white-secondary white-hover rounded-lg p-2 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CRWD</span>
              </div>
              <div className="hidden sm:block lg:block">
                <h1 className="text-base lg:text-lg font-bold">CRWD-logo Dashboard</h1>
                <p className="text-xs text-gray-500 hidden lg:block">Bar Management Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 lg:space-x-2">
              {/* Role selection button */}
              {onSetUserRole && (
                <button
                  onClick={handleShowRoleSelectionModal}
                  className="white-secondary white-hover rounded-lg p-2 transition-all duration-300"
                  title="Switch Dashboard"
                >
                  <User size={16} className="lg:w-[18px] lg:h-[18px]" />
                </button>
              )}
              
              <button className="white-secondary white-hover rounded-lg p-2 transition-all duration-300 hidden sm:flex">
                <Settings size={16} className="lg:w-[18px] lg:h-[18px]" />
              </button>
              
              <button className="white-secondary white-hover rounded-lg p-2 transition-all duration-300 text-red-500">
                <LogOut size={16} className="lg:w-[18px] lg:h-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 z-40 shadow-lg">
            <nav className="p-4 space-y-2">
              {navItems.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'white-active text-cyan-700'
                        : 'white-secondary white-hover text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                      {label}
                    </span>
                  </Link>
                );
              })}
              
              {/* Mobile-only actions */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {onSetUserRole && (
                  <button
                    onClick={() => {
                      handleShowRoleSelectionModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 white-secondary white-hover rounded-xl transition-all duration-300"
                  >
                    <User size={20} />
                    <span className="font-medium">Switch Dashboard</span>
                  </button>
                )}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center space-x-3 px-4 py-3 white-secondary white-hover rounded-xl transition-all duration-300 sm:hidden"
                >
                  <Settings size={20} />
                  <span className="font-medium">Settings</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar Navigation */}
        <nav className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex-col shadow-sm">
          <div className="space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'white-active text-cyan-700'
                      : 'white-secondary white-hover text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Bar Info Card */}
          <div className="mt-8 white-card-secondary rounded-xl p-4 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-3">
              <img 
                src="https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Bar"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold">Control Club</h3>
                <p className="text-xs text-gray-500">Electronic Music Club</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Today's Tokens</span>
                <span className="text-gray-900 font-medium">47</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleSelectionModal}
        onClose={handleCloseRoleSelectionModal}
        onSelectRole={handleSelectRole}
      />

      {/* Mobile Bottom Navigation - Alternative approach */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50 shadow-lg">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 min-w-0 flex-1 ${
                  isActive
                    ? 'text-cyan-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-xs mt-1 font-medium truncate ${
                  isActive ? 'font-semibold' : ''
                }`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};