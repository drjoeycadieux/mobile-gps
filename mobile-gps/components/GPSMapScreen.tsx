import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapboxGL from '@rnmapbox/maps';
import { MAPBOX_CONFIG } from '@/config/mapbox';
import ErrorComponent from './ErrorComponent';

// Set your Mapbox access token here
// You can get this from https://account.mapbox.com/access-tokens/
MapboxGL.setAccessToken(MAPBOX_CONFIG.ACCESS_TOKEN);

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function GPSMapScreen() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      getCurrentLocation();
    } catch (error) {
      setErrorMsg('Error requesting location permission');
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsTracking(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(coords);
      setIsTracking(false);
    } catch (error) {
      setErrorMsg('Error getting current location');
      setIsTracking(false);
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get current location');
    }
  };

  const startLocationTracking = async () => {
    try {
      setIsTracking(true);
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every meter
        },
        (newLocation) => {
          const coords = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          setLocation(coords);
        }
      );

      // Store subscription to stop tracking later if needed
      return locationSubscription;
    } catch (error) {
      setIsTracking(false);
      console.error('Error starting location tracking:', error);
      Alert.alert('Tracking Error', 'Unable to start location tracking');
    }
  };

  if (errorMsg) {
    return (
      <ErrorComponent 
        message={errorMsg}
        onRetry={requestLocationPermission}
        retryText="Try Again"
      />
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>
          {isTracking ? 'Getting your location...' : 'Requesting location permission...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        <MapboxGL.Camera
          centerCoordinate={[location.longitude, location.latitude]}
          zoomLevel={15}
          animationDuration={1000}
        />

        {/* User location marker */}
        <MapboxGL.PointAnnotation
          id="userLocation"
          coordinate={[location.longitude, location.latitude]}
        >
          <View style={styles.markerContainer}>
            <View style={styles.marker} />
          </View>
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>

      {/* Location info overlay */}
      <View style={styles.locationInfo}>
        <Text style={styles.coordText}>
          Lat: {location.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coordText}>
          Lng: {location.longitude.toFixed(6)}
        </Text>
        <TouchableOpacity
          style={[styles.trackingButton, isTracking && styles.trackingButtonActive]}
          onPress={isTracking ? () => setIsTracking(false) : startLocationTracking}
        >
          <Text style={styles.trackingButtonText}>
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.refreshButton} onPress={getCurrentLocation}>
          <Text style={styles.refreshButtonText}>Refresh Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  map: {
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  locationInfo: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  coordText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  trackingButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  trackingButtonActive: {
    backgroundColor: '#f44336',
  },
  trackingButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2196F3',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
