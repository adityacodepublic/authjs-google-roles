"use client"
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { FormLabel } from './ui/form';

interface LocationPickerProps {
  onValueChange: (location: { lat: number; lng: number }) => void;
}

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '10px',
};

const LocationPicker: React.FC<LocationPickerProps> = ({ onValueChange }) => {
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({ lat: latitude, lng: longitude });
      onValueChange({ lat: latitude, lng: longitude });
    });
  }, [onValueChange]);

  const onSearch = useCallback(() => {
    if (!map) return;

    const service = new google.maps.places.PlacesService(map);
    const request = {
      query: searchTerm,
      fields: ['geometry'],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0].geometry && results[0].geometry.location) {
        const location = results[0].geometry.location;
        setCurrentPosition({ lat: location.lat(), lng: location.lng() });
        onValueChange({ lat: location.lat(), lng: location.lng() });
        map.panTo(location);
      }
    });
  }, [map, searchTerm, onValueChange]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    const location = { lat: e.latLng!.lat(), lng: e.latLng!.lng() };
    setCurrentPosition(location);
    onValueChange(location);
  }, [onValueChange]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  // const handleFocusCurrentLocation = useCallback(() => {
  //   if (map && currentPosition) {
  //     map.panTo(currentPosition);
  //   }
  // }, [map, currentPosition]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className='space-y-5'>
      <FormLabel className='mt-10'>Select Incident location<span className="text-red-600">*</span></FormLabel>
      <Input
        placeholder="Search location"
        value={searchTerm}
        className='mt-10'
        onChange={(e) => {setSearchTerm(e.target.value); onSearch();}}
        />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition || { lat: 0, lng: 0 }}
        zoom={currentPosition ? 15 : 2}
        onClick={onMapClick}
        onLoad={onLoad}
      >
        {currentPosition && <Marker position={currentPosition} draggable={true} />}
      </GoogleMap>
        {/* <button onClick={handleFocusCurrentLocation}>Focus on Current Location</button> */}
    </div>
  );
};

export default LocationPicker;
