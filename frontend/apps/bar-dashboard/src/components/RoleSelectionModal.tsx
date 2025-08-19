import React from 'react';
import { X, BarChart3, Building, User } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'member' | 'bar_owner' | 'brand_owner') => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectRole
}) => {
  if (!isOpen) return null;

  const handleRoleSelect = (role: 'member' | 'bar_owner' | 'brand_owner') => {
    onSelectRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-primary rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Switch Dashboard</h3>
              <p className="text-sm text-[#D0D8E0]">Choose your dashboard type</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#D0D8E0] hover:text-white transition-colors p-2"
            >
              <X size={20} />
            </button>
          </div>

          {/* Role Options */}
          <div className="space-y-4">
            {/* User App */}
            <button
              onClick={() => handleRoleSelect('member')}
              className="w-full bg-gradient-to-r from-[#5BC0CE]/20 to-[#6FFFE9]/20 backdrop-blur-sm border border-[#5BC0CE]/30 rounded-xl p-4 hover:from-[#5BC0CE]/30 hover:to-[#6FFFE9]/30 transition-all duration-300 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#6FFFE9] to-[#5BC0CE] rounded-xl flex items-center justify-center">
                  <User size={24} className="text-black" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">User App</h4>
                  <p className="text-sm text-[#D0D8E0]">Discover bars and redeem drinks</p>
                </div>
              </div>
            </button>

            {/* Bar Dashboard */}
            <button
              onClick={() => handleRoleSelect('bar_owner')}
              className="w-full bg-gradient-to-r from-[#5BC0CE]/20 to-[#6FFFE9]/20 backdrop-blur-sm border border-[#5BC0CE]/30 rounded-xl p-4 hover:from-[#5BC0CE]/30 hover:to-[#6FFFE9]/30 transition-all duration-300 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#5BC0CE] to-[#6FFFE9] rounded-xl flex items-center justify-center">
                  <BarChart3 size={24} className="text-black" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Bar Dashboard</h4>
                  <p className="text-sm text-[#D0D8E0]">Manage campaigns and analytics</p>
                </div>
              </div>
            </button>

            {/* Brand Dashboard */}
            <button
              onClick={() => handleRoleSelect('brand_owner')}
              className="w-full bg-gradient-to-r from-[#5BC0CE]/20 to-[#6FFFE9]/20 backdrop-blur-sm border border-[#5BC0CE]/30 rounded-xl p-4 hover:from-[#5BC0CE]/30 hover:to-[#6FFFE9]/30 transition-all duration-300 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#6FFFE9] to-[#5BC0CE] rounded-xl flex items-center justify-center">
                  <Building size={24} className="text-black" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Brand Dashboard</h4>
                  <p className="text-sm text-[#D0D8E0]">Monitor brand performance</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};