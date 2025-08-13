import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

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
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <View style={styles.headerLeft}>
          <Icon name="clock" size={20} color="rgba(255, 255, 255, 0.75)" />
          <Text style={styles.title}>Opening Hours</Text>
          <Text style={[styles.status, { color: isOpen ? '#10B981' : '#EF4444' }]}>
            {isOpen ? 'OPEN' : 'CLOSED'}
          </Text>
        </View>
        
        <Icon 
          name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="rgba(255, 255, 255, 0.75)" 
        />
      </TouchableOpacity>

      {/* Dropdown with full week schedule */}
      {isDropdownOpen && (
        <View style={styles.dropdown}>
          {Object.entries(hours).map(([day, dayHours]) => {
            const today = new Date();
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDay = dayNames[today.getDay()];
            const isToday = day === currentDay;
            
            return (
              <View key={day} style={styles.hourRow}>
                <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
                <Text style={[
                  styles.hourText, 
                  dayHours === 'Closed' && styles.closedText,
                  isToday && styles.todayText
                ]}>
                  {dayHours}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  dropdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  dayText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
  },
  hourText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  closedText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  todayText: {
    color: '#5bc0be',
    fontWeight: '600',
  },
});
