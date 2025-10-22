import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RideTracking(props) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18 }}>Ride Tracking</Text>
      <Text>Real-time tracking will appear here.</Text>
      {props.route?.params?.rideId && (
        <Text>Ride request received from {props.route.params.rideId}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
