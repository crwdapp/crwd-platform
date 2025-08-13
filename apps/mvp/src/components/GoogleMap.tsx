import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useAppStore } from '../store';

interface Bar {
  id: number;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  lat: number;
  lng: number;
  image: string;
  location: string;
  availableDrinks: number;
  isOpen: boolean;
  tags: string[];
  openUntil: string;
  crowdLevel: string;
  distance: string;
}

interface GoogleMapProps {
  bars: Bar[];
  selectedBar: number | null;
  onMarkerClick: (barId: number) => void;
  onBarClick: (barId: number) => void;
  userLocation?: { lat: number; lng: number } | null;
  isMenuExpanded: boolean;
  mapCenter: { lat: number; lng: number };
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  bars,
  selectedBar,
  onMarkerClick,
  onBarClick,
  userLocation,
  isMenuExpanded,
  mapCenter
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<Map<number, google.maps.Marker>>(new Map());
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastBarsRef = useRef<Bar[]>([]);
  const lastMapCenterRef = useRef<{ lat: number; lng: number } | null>(null);
  const isInitializedRef = useRef(false);

  // Subscribe to current bar index changes from store
  const { ui } = useAppStore();

  // Helper function to calculate proper map center accounting for BottomPanel
  const calculateVisibleMapCenter = useCallback((targetLat: number, targetLng: number) => {
    if (!mapRef.current) return { lat: targetLat, lng: targetLng };
    
    // Get map container dimensions
    const mapContainer = mapRef.current;
    const containerHeight = mapContainer.offsetHeight;
    
    // Calculate the exact visible map area boundaries:
    // Top boundary: 0 (top of screen)
    // Bottom boundary: where BottomPanel starts
    
    // Get the actual panel element to measure its real position
    let panelTopPosition = containerHeight * 0.7; // fallback estimate
    
    // Try to find the actual BottomPanel element and measure its position
    const panelElement = document.querySelector('.fixed.bottom-16') as HTMLElement;
    if (panelElement) {
      const panelRect = panelElement.getBoundingClientRect();
      const containerRect = mapContainer.getBoundingClientRect();
      panelTopPosition = panelRect.top - containerRect.top;
    }
    
    // Mathematical center of the visible area:
    // visibleAreaTop = 0
    // visibleAreaBottom = panelTopPosition  
    // exactCenter = (visibleAreaTop + visibleAreaBottom) / 2 = panelTopPosition / 2
    const visibleAreaHeight = panelTopPosition;
    const exactCenterFromTop = visibleAreaHeight / 2;
    
    const bounds = map?.getBounds();
    if (bounds) {
      const latSpan = bounds.getNorthEast().lat() - bounds.getSouthWest().lat();
      
      // Calculate offset needed to move from current center to exact visible center
      const currentCenterFromTop = containerHeight / 2;
      const offsetPixels = currentCenterFromTop - exactCenterFromTop;
      
      // Convert pixel offset to latitude offset
      const offsetRatio = offsetPixels / containerHeight;
      const offsetLat = latSpan * offsetRatio;
      
      return {
        lat: targetLat - offsetLat, // Subtract to move UP
        lng: targetLng
      };
    }
    
    return { lat: targetLat, lng: targetLng };
  }, [map]);

  // Custom dark map style with blue accents matching the app theme
  // Cleaned to show only street names and hide POIs (metro stations, shops, etc.)
  const customDarkMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1a1a1a"
        }
      ]
    },
    {
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca3af"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1a1a1a"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#374151"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d1d5db"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d1d5db"
        }
      ]
    },
    // Hide all POIs (Points of Interest) - metro stations, shops, restaurants, etc.
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.school",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.medical",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.sports_complex",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.government",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.place_of_worship",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#374151"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca3af"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#374151"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1e293b"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#06b6d4"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#374151"
        }
      ]
    },
    // Hide all transit features (metro, bus, train stations)
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit.station.airport",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit.station.bus",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit.station.rail",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#155e75"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#e5e7eb"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#155e75"
        }
      ]
    }
  ];

  // Helper function to check if bar has events today
  const hasEventsToday = (bar: any): boolean => {
    if (!bar.events || bar.events.length === 0) return false;
    
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today.getDay()];
    
    // Check if bar has events today - either specific date or recurring events
    return bar.events.some((event: any) => {
      // Check for specific date match
      if (event.date === todayDate) return true;
      
      // Check for recurring events (e.g., "Every Friday", "Every Saturday")
      if (event.date === `Every ${todayName}`) return true;
      
      // Check for other recurring patterns
      if (event.date.includes('Every') && event.date.toLowerCase().includes(todayName.toLowerCase())) {
        return true;
      }
      
      return false;
    });
  };

  // Create modern pin design with brand colors
  const createCustomPin = useCallback((bar: any, isSelected: boolean = false) => {
    const scale = isSelected ? 1.8 : 1; // Increased from 1.3 to 1.8 for better visibility
    const width = 36 * scale;
    const height = 45 * scale;
    
    // Check if this bar has events today
    const hasEvents = hasEventsToday(bar);
    
    console.log(`🎯 Pin for ${bar.name}: hasEvents=${hasEvents}, isOpen=${bar.isOpen}, isSelected=${isSelected}`);
    
    // Simple, clear pin color logic:
    let strokeColor, centerColor, centerAccent, backgroundColor;
    
    if (hasEvents) {
      // Yellow pins for bars with events today
      strokeColor = '#FFD700';        // Yellow border
      centerColor = '#FFD700';        // Yellow center
      centerAccent = '#FFA500';       // Orange accent
      backgroundColor = '#ffffff';    // White background
    } else if (!bar.isOpen) {
      // Gray pins for closed bars
      strokeColor = '#888888';        // Gray border
      centerColor = '#888888';        // Gray center  
      centerAccent = '#666666';       // Darker gray accent
      backgroundColor = '#CCCCCC';    // Light gray background
    } else {
      // Blue pins for normal open bars
      strokeColor = '#06B6D4';        // Blue border
      centerColor = '#06B6D4';        // Blue center
      centerAccent = '#0891B2';       // Darker blue accent
      backgroundColor = '#ffffff';    // White background
    }
    
    // Selected pins get highlighted background
    if (isSelected) {
      backgroundColor = strokeColor;   // Use the main color as background
      centerColor = '#ffffff';        // White center when selected
      centerAccent = 'rgba(255,255,255,0.8)'; // Light white accent
    }
    
    const strokeWidth = 2;
    
    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 36 45" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow${isSelected ? 'Selected' : ''}" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
          <linearGradient id="pinGradient${isSelected ? 'Selected' : ''}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${backgroundColor}" />
            <stop offset="100%" stop-color="${backgroundColor}dd" />
          </linearGradient>
          <radialGradient id="innerGlow${isSelected ? 'Selected' : ''}" cx="0.3" cy="0.3">
            <stop offset="0%" stop-color="rgba(255,255,255,0.4)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0.1)" />
          </radialGradient>
        </defs>
        
        <!-- Pin body -->
        <path d="M18 3C11.4 3 6 8.4 6 15c0 10.5 12 25 12 25s12-14.5 12-25c0-6.6-5.4-12-12-12z" 
              fill="url(#pinGradient${isSelected ? 'Selected' : ''})" 
              stroke="${strokeColor}" 
              stroke-width="${strokeWidth}"
              filter="url(#shadow${isSelected ? 'Selected' : ''})"/>
        
        <!-- Inner circle -->
        <circle cx="18" cy="15" r="8" fill="url(#innerGlow${isSelected ? 'Selected' : ''})" opacity="0.9"/>
        
        <!-- Center dot -->
        <circle cx="18" cy="15" r="3" fill="${centerColor}"/>
        <circle cx="18" cy="15" r="1.5" fill="${centerAccent}"/>
      </svg>
    `;
    
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }, []);

  // Initialize Google Maps only once
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    const initMap = async () => {
      try {
        console.log('Initializing Google Maps...');
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBDyU3qJiAwuKiDNhgAmdMbBDJ-jaOkqPc',
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        if (mapRef.current && window.google && !isInitializedRef.current) {
          console.log('Creating map instance with center:', mapCenter);
          
          // Calculate adjusted center right from the start
          const adjustedCenter = calculateVisibleMapCenter(mapCenter.lat, mapCenter.lng);
          console.log('🎯 Using adjusted center for startup:', adjustedCenter);
          
          // Determine initial zoom based on location type
          const { user } = useAppStore.getState();
          const isNearMe = user.preferences.selectedLocation === 'NEAR_ME';
          const initialZoom = isNearMe ? 14 : 11; // City view (11) vs Personal view (14)
          
          console.log(`🏙️ Initial zoom: ${initialZoom} (${isNearMe ? 'Personal' : 'City'} view)`);
          
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: adjustedCenter, // Use adjusted center from startup
            zoom: initialZoom, // Dynamic zoom based on location type
            disableDefaultUI: true,
            zoomControl: false, // Explicitly disable zoom controls
            gestureHandling: 'greedy',
            styles: customDarkMapStyle
          });

          setMap(mapInstance);
          lastMapCenterRef.current = mapCenter;
          isInitializedRef.current = true;
          
          console.log('✅ Map initialized with adjusted center');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps');
        setIsLoading(false);
      }
    };

    initMap();
  }, []); // Only run once

  // Update map center with smooth animations when mapCenter prop changes
  useEffect(() => {
    if (map && mapCenter && isInitializedRef.current) {
      // Check if the center has actually changed to avoid unnecessary updates
      const lastCenter = lastMapCenterRef.current;
      const hasChanged = !lastCenter || 
        Math.abs(lastCenter.lat - mapCenter.lat) > 0.001 ||
        Math.abs(lastCenter.lng - mapCenter.lng) > 0.001;

      if (hasChanged) {
        console.log('🎬 GoogleMap - Animating from', lastCenter, 'to:', mapCenter);
        
        // Calculate proper center accounting for BottomPanel
        const adjustedCenter = calculateVisibleMapCenter(mapCenter.lat, mapCenter.lng);
        
        // Get current state to determine if we should animate
        const { ui } = useAppStore.getState();
        const shouldAnimate = ui.isMapAnimating;
        
        if (shouldAnimate) {
          console.log('✨ Performing smooth animation to new location');
          
          // Get current state to determine zoom level
          const { user } = useAppStore.getState();
          const isNearMe = user.preferences.selectedLocation === 'NEAR_ME';
          
          // Cinematic animation: zoom out -> pan -> zoom in
          const currentZoom = map.getZoom() || 12;
          const targetZoom = isNearMe ? 14 : 11; // City view (11) vs Personal view (14)
          
          console.log(`🎯 Target zoom: ${targetZoom} (${isNearMe ? 'Personal' : 'City'} view)`);
          
          // Step 1: Zoom out for better perspective
          map.setZoom(Math.max(currentZoom - 2, 8));
          
          setTimeout(() => {
            // Step 2: Pan to new location
            map.panTo(adjustedCenter);
            
            setTimeout(() => {
              // Step 3: Zoom in to target level
              map.setZoom(targetZoom);
            }, 800); // Wait for pan to complete
          }, 300); // Wait for zoom out
          
        } else {
          console.log('📍 Direct positioning (no animation)');
          
          // Get current state to determine zoom level for startup
          const { user } = useAppStore.getState();
          const isNearMe = user.preferences.selectedLocation === 'NEAR_ME';
          const startupZoom = isNearMe ? 14 : 11; // City view (11) vs Personal view (14)
          
          console.log(`🏙️ Startup zoom: ${startupZoom} (${isNearMe ? 'Personal' : 'City'} view)`);
          
          // Direct positioning for startup
          map.setCenter(adjustedCenter);
          map.setZoom(startupZoom);
        }
        
        lastMapCenterRef.current = mapCenter;
      } else {
        console.log('GoogleMap - Map center unchanged, skipping update');
      }
    } else {
      console.log('GoogleMap - Cannot update map center:', { 
        hasMap: !!map, 
        hasMapCenter: !!mapCenter, 
        isInitialized: isInitializedRef.current 
      });
    }
  }, [map, mapCenter, calculateVisibleMapCenter]);

  // Center map on current bar when swiping (only when menu is collapsed)
  useEffect(() => {
    if (map && bars.length > 0 && !isMenuExpanded && isInitializedRef.current) {
      const currentBar = bars[ui.currentBarIndex];
      if (currentBar) {
        // Calculate proper center accounting for BottomPanel - same as user location
        const adjustedCenter = calculateVisibleMapCenter(currentBar.lat, currentBar.lng);
        
        console.log('🎯 Centering map on bar:', currentBar.name, 'at visual center:', adjustedCenter);
        map.panTo(adjustedCenter);
        
        // Optionally adjust zoom to show the bar clearly
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom < 14) {
          map.setZoom(14);
        }
      }
    }
  }, [map, ui.currentBarIndex, bars, isMenuExpanded]);

  // Optimized marker management - only update when bars actually change
  useEffect(() => {
    if (!map || !window.google || !isInitializedRef.current) return;

    // Check if bars have actually changed
    const barsChanged = JSON.stringify(bars) !== JSON.stringify(lastBarsRef.current);
    if (!barsChanged) return;

    console.log('Updating markers for', bars.length, 'bars');
    lastBarsRef.current = [...bars]; // Create a copy to avoid reference issues

    // Get current markers
    const currentMarkers = markersRef.current;
    const currentBarIds = new Set(Array.from(currentMarkers.keys()));
    const newBarIds = new Set(bars.map(bar => bar.id));

    // Remove markers that are no longer needed
    currentBarIds.forEach(barId => {
      if (!newBarIds.has(barId)) {
        const marker = currentMarkers.get(barId);
        if (marker) {
          marker.setMap(null);
          currentMarkers.delete(barId);
        }
      }
    });

    // Add or update markers
    bars.forEach((bar) => {
      let marker = currentMarkers.get(bar.id);
      
      if (!marker) {
        // Create new marker with color-coded pin
        marker = new google.maps.Marker({
          position: { lat: bar.lat, lng: bar.lng },
          map,
          title: bar.name,
          icon: {
            url: createCustomPin(bar),
            scaledSize: new google.maps.Size(36, 45),
            anchor: new google.maps.Point(18, 40)
          }
        });

                 // Add click listener that updates the bar card (NO INFO WINDOW)
         marker.addListener('click', () => {
           console.log('Pin clicked for bar:', bar.name, 'ID:', bar.id);
           
           // Find the index of this bar in the bars array
           const barIndex = bars.findIndex(b => b.id === bar.id);
           
           if (barIndex !== -1) {
             console.log('Found bar at index:', barIndex, 'out of', bars.length, 'bars');
             
             // Update the store to show this bar in the bottom panel
             useAppStore.setState(state => {
               state.ui.selectedBarId = bar.id;
               state.ui.currentBarIndex = barIndex;
               // Ensure the bottom panel shows the selected bar
               state.ui.mapExpanded = false; // Keep panel collapsed to show bar details
             });
             
             console.log('Updated store - selectedBarId:', bar.id, 'currentBarIndex:', barIndex);
           } else {
             console.error('Bar not found in bars array:', bar.id);
           }
           
           // Also call the original onMarkerClick if needed
           onMarkerClick(bar.id);
         });

        currentMarkers.set(bar.id, marker);
      } else {
        // Update existing marker if needed
        const currentPosition = marker.getPosition();
        if (!currentPosition || 
            currentPosition.lat() !== bar.lat || 
            currentPosition.lng() !== bar.lng) {
          marker.setPosition({ lat: bar.lat, lng: bar.lng });
        }
        
                 // Always update icon to reflect current selection state
         const isSelected = selectedBar === bar.id;
         const width = isSelected ? 65 : 36; // Increased from 43 to 65 (36 * 1.8)
         const height = isSelected ? 81 : 45; // Increased from 54 to 81 (45 * 1.8)
         marker.setIcon({
           url: createCustomPin(bar, isSelected),
           scaledSize: new google.maps.Size(width, height),
           anchor: new google.maps.Point(width / 2, height - 5)
         });
      }
    });

    console.log('Markers updated. Total markers:', currentMarkers.size);
  }, [map, bars, createCustomPin, onMarkerClick, selectedBar]);

  // Update marker appearance when selected bar changes
  useEffect(() => {
    if (!map || !isInitializedRef.current) return;

    const currentMarkers = markersRef.current;
    
         // Update all markers to reflect selection state
     bars.forEach((bar) => {
       const marker = currentMarkers.get(bar.id);
       if (marker) {
         const isSelected = selectedBar === bar.id;
         const width = isSelected ? 65 : 36; // Increased from 43 to 65 (36 * 1.8)
         const height = isSelected ? 81 : 45; // Increased from 54 to 81 (45 * 1.8)
         marker.setIcon({
           url: createCustomPin(bar, isSelected),
           scaledSize: new google.maps.Size(width, height),
           anchor: new google.maps.Point(width / 2, height - 5)
         });
       }
     });
  }, [selectedBar, bars, createCustomPin]);

  // User location marker
  useEffect(() => {
    if (!map || !userLocation || !window.google || !isInitializedRef.current) {
      if (userMarker) {
        userMarker.setMap(null);
        setUserMarker(null);
      }
      return;
    }

    if (userMarker) {
      userMarker.setPosition(userLocation);
    } else {
      const newUserMarker = new google.maps.Marker({
        position: userLocation,
        map,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
              <circle cx="10" cy="10" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(20, 20),
          anchor: new google.maps.Point(10, 10)
        }
      });

      setUserMarker(newUserMarker);
    }
  }, [map, userLocation]);


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current.clear();
      
      if (userMarker) {
        userMarker.setMap(null);
      }
    };
  }, []);

  if (error) {
    return (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-[120%] -mb-[20%]"
        style={{ 
          opacity: isMenuExpanded ? 0.7 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
};