import React, { useContext, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import AuthContext from '../../app/context/AuthContext';
import { handleGetDistance, handleGetFare, handleGetNavigation, handleGetRoute } from '../api/geoApi';
import LocationInput from "../component/LocationInput";

export default function MapScreen() {
  const [origin, setOrigin] = useState({ lat: "12.9716", lng: "77.5946" });
  const [destination, setDestination] = useState({ lat: "12.2958", lng: "76.6394" });
  const [distance, setDistance] = useState(null);
  const [fare, setFare] = useState(null);
  const [polyline, setPolyline] = useState([]);
  const [steps, setSteps] = useState([]);
  const { user, logout } = useContext(AuthContext);


  const handleDistance = async () => {
      const res = await handleGetDistance({
          originLat: origin.lat,
          originLng: origin.lng,
          destLat: destination.lat,
          destLng: destination.lng,
      });
      setDistance(res.data);
    };
  
    const handleFare = async () => {
      const res = await handleGetFare({
          originLat: origin.lat,
          originLng: origin.lng,
          destLat: destination.lat,
          destLng: destination.lng,
      });
      setFare(res.data);
    };
  
    const handleRoute = async () => {
      const res = await handleGetRoute({
          originLat: origin.lat,
          originLng: origin.lng,
          destLat: destination.lat,
          destLng: destination.lng,
      });
      const encoded = res.data.overviewPolyline;
      const points = decodePolyline(encoded);
      setPolyline(points);
    };
  
    const handleNavigation = async () => {
      const res = await handleGetNavigation({
          originLat: origin.lat,
          originLng: origin.lng,
          destLat: destination.lat,
          destLng: destination.lng,
      });
      setSteps(res.data.steps);
    };


  // Decode polyline from backend
  const decodePolyline = (t, e) => {
    e = e || 5;
    let n, o, u = 0, l = 0, r = 0, d = [];
    const h = Math.pow(10, e);
    for (let i = 0; i < t.length;) {
      let c, s = 0, m = 1;
      do (c = t.charCodeAt(i++) - 63), (s |= (31 & c) << r), (r += 5);
      while (c >= 32);
      n = 1 & s ? ~(s >> 1) : s >> 1;
      u += n;
      r = 0;
      s = 0;
      m = 1;
      do (c = t.charCodeAt(i++) - 63), (s |= (31 & c) << r), (r += 5);
      while (c >= 32);
      o = 1 & s ? ~(s >> 1) : s >> 1;
      l += o;
      d.push({ latitude: u / h, longitude: l / h });
    }
    return d;
  };

  return (
    <>
    <View style={styles.header}>
	    <Text>Welcome, {user.name} (Role: {user.role})</Text>
	    <Button title="Logout" onPress={logout} />
    </View>
    <ScrollView style={styles.container}>
      <LocationInput
        placeholder="Origin Latitude"
        value={origin.lat}
        onChangeText={(v) => setOrigin({ ...origin, lat: v })}
      />
      <LocationInput
        placeholder="Origin Longitude"
        value={origin.lng}
        onChangeText={(v) => setOrigin({ ...origin, lng: v })}
      />
      <LocationInput
        placeholder="Destination Latitude"
        value={destination.lat}
        onChangeText={(v) => setDestination({ ...destination, lat: v })}
      />
      <LocationInput
        placeholder="Destination Longitude"
        value={destination.lng}
        onChangeText={(v) => setDestination({ ...destination, lng: v })}
      />

      <View style={styles.buttonGroup}>
        <Button title="Get Distance" onPress={handleDistance} />
        <Button title="Calculate Fare" onPress={handleFare} />
        <Button title="Show Route" onPress={handleRoute} />
        <Button title="Navigation Steps" onPress={handleNavigation} />
      </View>

      {distance && (
        <Text style={styles.info}>
          Distance: {distance.text_distance} | Duration: {distance.text_duration}
        </Text>
      )}

      {fare && (
        <Text style={styles.info}>
          Estimated Fare: ₹{fare.fare.toFixed(2)} for {fare.distance_km.toFixed(2)} km
        </Text>
      )}

      {polyline.length > 0 && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(origin.lat),
            longitude: parseFloat(origin.lng),
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(origin.lat),
              longitude: parseFloat(origin.lng),
            }}
            title="Origin"
          />
          <Marker
            coordinate={{
              latitude: parseFloat(destination.lat),
              longitude: parseFloat(destination.lng),
            }}
            title="Destination"
          />
          <Polyline coordinates={polyline} strokeWidth={5} strokeColor="blue" />
        </MapView>
      )}
      {polyline.length == 0 ? (
        <MapView style={{ flex: 1 }} initialRegion={{
      latitude: 12.9716,
      longitude: 77.5946,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05
    }}>
      <Marker coordinate={{ latitude: 12.9716, longitude: 77.5946 }} title="Sample Location" />
    </MapView>
      ) : ('')
      }

      {steps.length > 0 && (
        <View style={styles.steps}>
          <Text style={styles.heading}>Navigation Steps:</Text>
          {steps.map((s, i) => (
            <Text key={i} style={styles.stepText}>• {s}</Text>
          ))}
        </View>
      )}
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9f9" },
  map: { height: 300, marginVertical: 15, borderRadius: 10 },
  info: { fontSize: 16, marginVertical: 8 },
  buttonGroup: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginVertical: 10 },
  steps: { marginTop: 10 },
  heading: { fontWeight: "bold", fontSize: 18, marginBottom: 5 },
  stepText: { marginBottom: 3, color: "#333" },
});
