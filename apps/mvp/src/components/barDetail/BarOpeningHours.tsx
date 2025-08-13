import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface BarOpeningHoursProps {
  hours: Record<string, string>;
}

export const BarOpeningHours: React.FC<BarOpeningHoursProps> = ({ hours }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getCurrentDayHours = () => {
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = dayNames[today.getDay()];
    return hours[currentDay] || 'Closed';
  };

  const isCurrentlyOpen = () => {
    const todayHours = getCurrentDayHours();
    if (todayHours === 'Closed') return false;

    // Parse hours like "11:00 AM - 2:00 AM" or "11:00 AM - 12:00 AM"
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes

    try {
      const [openTime, closeTime] = todayHours.split(' - ');
      
      const parseTime = (timeStr: string) => {
        const [time, period] = timeStr.trim().split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let totalMinutes = hours * 60 + (minutes || 0);
        
        if (period === 'PM' && hours !== 12) {
          totalMinutes += 12 * 60;
        } else if (period === 'AM' && hours === 12) {
          totalMinutes = minutes || 0;
        }
        
        return totalMinutes;
      };

      const openMinutes = parseTime(openTime);
      let closeMinutes = parseTime(closeTime);

      // Handle overnight hours (close time is next day)
      if (closeMinutes <= openMinutes) {
        closeMinutes += 24 * 60; // Add 24 hours
        // If current time is before noon, add 24 hours to check if we're still open from previous day
        if (currentTime < 12 * 60) {
          return currentTime + 24 * 60 >= openMinutes && currentTime + 24 * 60 <= closeMinutes;
        }
      }

      return currentTime >= openMinutes && currentTime <= closeMinutes;
    } catch (error) {
      console.error('Error parsing hours:', error);
      return false;
    }
  };

  const isOpen = isCurrentlyOpen();
  const todayHours = getCurrentDayHours();

  return (
    <div className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-[#06B6D4]/20 transition-all duration-300 group relative">
      {/* Blue accent line */}
      <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock size={20} className="text-white/75" />
          <h3 className="font-semibold text-white">Opening Hours</h3>
          <span className={`text-sm font-medium ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
            {isOpen ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
        
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
          aria-label="Toggle hours dropdown"
        >
          {isDropdownOpen ? (
            <ChevronUp size={16} className="text-white/75" />
          ) : (
            <ChevronDown size={16} className="text-white/75" />
          )}
        </button>
      </div>

      {/* Dropdown with full week schedule */}
      {isDropdownOpen && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm animate-in fade-in duration-200">
          {Object.entries(hours).map(([day, dayHours]) => {
            const today = new Date();
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDay = dayNames[today.getDay()];
            const isToday = day === currentDay;
            
            return (
              <div key={day} className={`flex justify-between ${isToday ? 'text-[#06B6D4]' : 'text-white/75'}`}>
                <span className={isToday ? 'font-medium' : ''}>{day}</span>
                <span className={dayHours === 'Closed' ? 'text-white/50' : isToday ? 'text-[#06B6D4]' : 'text-white/90'}>
                  {dayHours}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};