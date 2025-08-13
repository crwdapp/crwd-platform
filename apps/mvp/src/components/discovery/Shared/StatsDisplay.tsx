import React from 'react';
import { Clock, Zap } from 'lucide-react';
import { useAppStore } from '../../../store';

export const StatsDisplay: React.FC = () => {
  const { bars } = useAppStore();

  const totalDrinks = bars.items.reduce((sum, bar) => sum + bar.availableDrinks, 0);
  const openBars = bars.items.length;

  return (
    <div className="flex items-center space-x-3 text-xs">
      <div className="flex items-center space-x-1">
        <div className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full"></div>
        <span className="text-white/75 font-medium">{totalDrinks}</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
        <span className="text-white/75 font-medium">{openBars}</span>
      </div>
    </div>
  );
};