import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, Platform } from 'react-native';
import * as Location from 'expo-location';
import ErrorComponent from './ErrorComponent';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function GPSWebScreen() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      requestLocationPermission();
    }
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
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          const coords = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          setLocation(coords);
        }
      );

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
      {/* Simple web-compatible map placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapTitle}>🗺️ GPS Location</Text>
        <View style={styles.locationMarker}>
          <Text style={styles.markerIcon}>📍</Text>
        </View>
        <Text style={styles.mapInfo}>Interactive map would appear here on native devices</Text>
      </View>

      {/* Location info overlay */}
      <View style={styles.locationInfo}>
        <Text style={styles.coordText}>
          Latitude: {location.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coordText}>
          Longitude: {location.longitude.toFixed(6)}
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

        <TouchableOpacity 
          style={styles.mapsButton}
          onPress={() => {
            const url = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
            if (Platform.OS === 'web') {
              window.open(url, '_blank');
            }
          }}
        >
          <Text style={styles.mapsButtonText}>Open in Google Maps</Text>
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
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f4f8',
    margin: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
  },
  locationMarker: {
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  markerIcon: {
    fontSize: 24,
  },
  mapInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  mapsButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  mapsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
