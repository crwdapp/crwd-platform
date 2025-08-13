import React from 'react';
import { useAppStore } from '../store';

export const useBarData = () => {
  const store = useAppStore();
  const ui = store?.ui || { selectedBarId: null, currentBarIndex: 0 };
  const bars = store?.bars || { items: [] };
  const reviews = (store as any)?.reviews || { items: [] };
  const user = store?.user || { 
    preferences: { 
      selectedLocation: 'NEAR_ME',
      barFilterMode: 'open_now',
      activeFilters: []
    } 
  };

  // Reset currentBarIndex to 0 when bars are reordered (closest bar should be first)
  React.useEffect(() => {
    if (bars.items.length > 0) {
      console.log('🔄 Resetting currentBarIndex to 0 due to bars reordering');
      useAppStore.setState(state => ({
        ui: {
          ...state.ui,
          currentBarIndex: 0,
          selectedBarId: bars.items[0]?.id || null,
        },
      }));
    }
  }, [bars.items.length]);

  const barsItems = bars?.items || [];
  const currentIndex = ui.currentBarIndex || 0;
  const currentBar = barsItems[currentIndex];
  const nextBar = barsItems[(currentIndex + 1) % barsItems.length];
  const prevBar = barsItems[currentIndex > 0 ? currentIndex - 1 : barsItems.length - 1];

  const hasEventsToday = (bar: any): boolean => {
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayDayName = dayNames[today.getDay()];
    
    return bar.events && bar.events.some((event: any) => {
      if (event.date.includes(todayDayName) || event.date.includes('Every')) {
        return true;
      }
      if (event.date && event.date !== 'Every Friday' && event.date.includes(today.toDateString())) {
        return true;
      }
      return false;
    });
  };

  const getTodayOpeningHours = (bar: any): string | null => {
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayDayName = dayNames[today.getDay()];
    return bar.hours && bar.hours[todayDayName] ? bar.hours[todayDayName] : null;
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#9CA3AF';
    }
  };

  const getBarImage = (bar: any) => {
    if (bar.images && bar.images.length > 0) return bar.images[0];
    if (bar.image) return bar.image;
    return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop';
  };

  // Get reviews for current bar and calculate average rating
  const barReviews = reviews.items.filter((review: any) => review.barId === currentBar?.id);
  const averageRating = barReviews.length > 0 
    ? barReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / barReviews.length
    : currentBar?.rating || 0;

  const isOpenNowActive = user.preferences?.barFilterMode === 'open_now';
  const isEventFilterActive = user.preferences?.eventFilterMode === 'events_today';
  const isBarClosed = isOpenNowActive && currentBar && !currentBar.isOpen;
  const hasEvents = currentBar ? hasEventsToday(currentBar) : false;

  return {
    barsItems,
    currentIndex,
    currentBar,
    nextBar,
    prevBar,
    averageRating,
    isOpenNowActive,
    isEventFilterActive,
    isBarClosed,
    hasEvents,
    user,
    hasEventsToday,
    getTodayOpeningHours,
    getCrowdColor,
    getBarImage,
  };
};
