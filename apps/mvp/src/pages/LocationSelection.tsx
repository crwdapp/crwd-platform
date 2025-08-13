import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, CheckCircle, Loader2, Zap } from 'lucide-react';
import { useAppStore } from '../store';
import { locationService } from '../services/location/locationService';

export const LocationSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user, ui } = useAppStore();
  const selectedLocation = user.preferences.selectedLocation;
  const [isTransitioning, setIsTransitioning] = useState(false);

  const locations = [
    {
      id: 'NEAR_ME',
      name: 'Near me',
      description: 'Bars around your location',
      icon: Navigation,
      isGPS: true
    },
    {
      id: 'BUCHAREST',
      name: 'Bucharest',
      description: 'Capital city nightlife',
      icon: MapPin,
      isGPS: false
    },
    {
      id: 'DUBLIN',
      name: 'Dublin',
      description: 'Irish pub culture',
      icon: MapPin,
      isGPS: false
    },
    {
      id: 'CONSTANTA',
      name: 'Constanta',
      description: 'Coastal beach bars',
      icon: MapPin,
      isGPS: false
    },
    {
      id: 'CLUJ',
      name: 'Cluj-Napoca',
      description: 'Student city vibes',
      icon: MapPin,
      isGPS: false
    },
    {
      id: 'TIMISOARA',
      name: 'Timisoara',
      description: 'Cultural nightlife',
      icon: MapPin,
      isGPS: false
    },
    {
      id: 'BRASOV',
      name: 'Brasov',
      description: 'Mountain town bars',
      icon: MapPin,
      isGPS: false
    }
  ];

  const handleLocationSelect = async (locationId: string) => {
    console.log('🎯 Location selected:', locationId);
    
    // Only update if the location actually changed
    if (locationId !== selectedLocation && !isTransitioning) {
      setIsTransitioning(true);
      
      try {
        // Set map animation state
        useAppStore.setState(state => {
          state.ui.isMapAnimating = true;
        });

        // Get coordinates for smooth animation
        let targetCoordinates;
        
        if (locationId === 'NEAR_ME') {
          console.log('🔍 Getting GPS location...');
          try {
            targetCoordinates = await locationService.getCurrentLocation();
            console.log('📍 GPS coordinates:', targetCoordinates);
            
            // Update user location in store
            useAppStore.setState(state => {
              state.user.location = targetCoordinates;
            });
          } catch (error) {
            console.log('⚠️ GPS failed, using current map center');
            targetCoordinates = ui.mapCenter || { lat: 44.4268, lng: 26.1025 };
          }
        } else {
          console.log(`🏙️ Getting coordinates for city: ${locationId}`);
          targetCoordinates = locationService.getCityCoordinates(locationId) || { lat: 44.4268, lng: 26.1025 };
        }

        // Update store with new location and coordinates
        useAppStore.setState(state => {
          state.user.preferences.selectedLocation = locationId;
          state.ui.mapCenter = targetCoordinates;
        });
        
        console.log('✅ Location updated, animating to:', targetCoordinates);
        
        // Navigate with smooth transition
        navigate('/discover');
        
        // Reset animation state after delay to allow map animation
        setTimeout(() => {
          useAppStore.setState(state => {
            state.ui.isMapAnimating = false;
          });
          setIsTransitioning(false);
        }, 1500); // 1.5s for smooth animation
        
      } catch (error) {
        console.error('❌ Location selection failed:', error);
        setIsTransitioning(false);
        
        useAppStore.setState(state => {
          state.ui.isMapAnimating = false;
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header with BarDetail styling */}
      <div className="relative h-20 bg-gradient-to-b from-black/60 to-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button 
            onClick={() => navigate('/discover')}
            className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Choose Location</h1>
          <div className="w-10"></div>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {/* GPS Location Option */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
            <Navigation className="mr-2 text-[#06B6D4]" size={20} />
            GPS Location
          </h3>
          
          <button
            onClick={() => handleLocationSelect('NEAR_ME')}
            disabled={isTransitioning}
            className={`w-full bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-[#06B6D4]/20 hover:border-[#06B6D4]/30 transition-all duration-300 group relative hover:scale-[1.02] ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {/* Blue accent line */}
            <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full transition-all duration-300 ${
                  selectedLocation === 'NEAR_ME' ? 'bg-[#06B6D4]' : 'bg-white/10'
                }`}>
                  {isTransitioning && selectedLocation === 'NEAR_ME' ? (
                    <Loader2 size={20} className="text-white animate-spin" />
                  ) : (
                    <Navigation size={20} className={
                      selectedLocation === 'NEAR_ME' ? 'text-white' : 'text-[#06B6D4]'
                    } />
                  )}
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white text-lg">Near me</h4>
                  <p className="text-white/75 text-sm">Bars around your location</p>
                </div>
              </div>
              {selectedLocation === 'NEAR_ME' && (
                <CheckCircle size={20} className="text-[#06B6D4]" />
              )}
            </div>
          </button>
        </div>

        {/* City Locations */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
            <MapPin className="mr-2 text-[#06B6D4]" size={20} />
            Select City
          </h3>
          
          <div className="space-y-4">
            {locations.filter(loc => !loc.isGPS).map((location) => {
              const IconComponent = location.icon;
              const isSelected = selectedLocation === location.id;
              
              return (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location.id)}
                  disabled={isTransitioning}
                  className={`w-full bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-[#06B6D4]/20 hover:border-[#06B6D4]/30 transition-all duration-300 group relative hover:scale-[1.02] ${
                    isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {/* Blue accent line */}
                  <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-full transition-all duration-300 ${
                        isSelected ? 'bg-[#06B6D4]' : 'bg-white/10'
                      }`}>
                        {isTransitioning && isSelected ? (
                          <Loader2 size={20} className="text-white animate-spin" />
                        ) : (
                          <IconComponent size={20} className={isSelected ? 'text-white' : 'text-[#06B6D4]'} />
                        )}
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-white text-lg">{location.name}</h4>
                        <p className="text-white/75 text-sm">{location.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle size={20} className="text-[#06B6D4]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 