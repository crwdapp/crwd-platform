import React from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';
import { RoleSelectionModal } from './RoleSelectionModal';

interface LayoutProps {
  children: React.ReactNode;
  onSetUserRole?: (role: 'member' | 'bar_owner' | 'brand_owner') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onSetUserRole }) => {
  const location = useLocation();
  const [showRoleSelectionModal, setShowRoleSelectionModal] = React.useState(false);

  // Pages that should not allow scrolling (map view, events, profile, etc.)
  const noScrollPages = ['/discover', '/events', '/profile'];
  const shouldAllowScroll = !noScrollPages.includes(location.pathname) && !location.pathname.startsWith('/dashboard');

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

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <main className={`flex-1 ${shouldAllowScroll ? 'overflow-auto' : 'overflow-hidden'}`}>
        {children}
      </main>
      <BottomNavigation onShowRoleSelection={handleShowRoleSelectionModal} />
      <RoleSelectionModal
        isOpen={showRoleSelectionModal}
        onClose={handleCloseRoleSelectionModal}
        onSelectRole={handleSelectRole}
      />
    </div>
  );
};