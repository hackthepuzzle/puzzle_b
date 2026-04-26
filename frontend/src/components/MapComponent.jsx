import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!import.meta.env.VITE_MAPS_API_KEY) {
    return (
      <div className="glass-panel">
        <h2>Polling Station Finder</h2>
        <div style={{ height: '300px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' }}>
          <p>Please configure Google Maps API Key in .env</p>
        </div>
      </div>
    );
  }

  return isLoaded ? (
    <div className="glass-panel">
      <h2>Nearby Polling Station</h2>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{ styles: [{ featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] }] }}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </div>
  ) : <div className="glass-panel">Loading Map...</div>;
};

export default React.memo(MapComponent);
