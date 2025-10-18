import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RideTracking() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize:18 }}>Ride Tracking</Text>
      <Text>Real-time tracking will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', alignItems:'center' }
});
