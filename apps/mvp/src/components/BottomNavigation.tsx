import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Compass, User, Settings, Calendar } from 'lucide-react';
import { useAppStore } from '../store';

interface BottomNavigationProps {
  onShowRoleSelection: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ onShowRoleSelection }) => {
  const location = useLocation();
  const { ui } = useAppStore();
  
  // Only show bottom navigation when NOT in expanded list view on discover page
  const isDiscoverPage = location.pathname === '/discover' || location.pathname === '/';
  const showNavigation = !isDiscoverPage || !ui.mapExpanded;

  const navItems = [
    { path: '/discover', icon: Compass, label: 'Discover' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 safe-area-inset-bottom">
      {/* Floating buttons without background container */}
      <div className="flex items-center justify-center space-x-3">
        {/* Navigation buttons - individual floating glassmorphism */}
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path === '/discover' && location.pathname === '/');
          return (
            <Link
              key={path}
              to={path}
              className={`relative flex flex-col items-center px-4 py-3 rounded-2xl backdrop-blur-2xl border transition-all duration-200 min-w-[60px] shadow-lg active:scale-95 ${
                isActive
                  ? 'bg-[#06B6D4] text-white border-[#06B6D4]/50 shadow-[#06B6D4]/25'
                  : 'bg-black/20 text-white/75 border-white/10 hover:text-[#06B6D4] hover:border-[#06B6D4]/30 shadow-black/20'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Icon */}
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2}
                className="mb-1"
              />
              
              {/* Label */}
              <span className={`text-xs font-medium leading-none ${
                isActive ? 'font-semibold' : 'font-normal'
              }`}>
                {label}
              </span>
              
            </Link>
          );
        })}
        
        {/* Settings button - individual floating glassmorphism */}
        <button
          onClick={onShowRoleSelection}
          className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-2xl border border-white/10 text-white/75 hover:text-[#06B6D4] hover:border-[#06B6D4]/30 transition-all duration-200 group shadow-lg shadow-black/20 active:scale-95"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          title="Switch Role"
        >
          <Settings 
            size={20} 
            strokeWidth={2}
            className="relative z-10"
          />
          
          {/* Hover glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#06B6D4]/0 to-[#06B6D4]/0 group-hover:from-[#06B6D4]/10 group-hover:to-[#06B6D4]/10 transition-all duration-200"></div>
        </button>
      </div>
    </nav>
  );
};