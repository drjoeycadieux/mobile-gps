import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import GPSMapScreen from '@/components/GPSMapScreen';
import GPSWebScreen from '@/components/GPSWebScreen';

export default function GPSScreen() {
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? <GPSWebScreen /> : <GPSMapScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
