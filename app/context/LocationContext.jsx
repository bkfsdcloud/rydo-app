// LocationContext.js
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { createContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const allowedArea = {
    latitude: 11.01602, // center latitude
    longitude: 76.97031, // center longitude
    radius: 90000, // in meters
  };

  const [location, setLocation] = useState({
    lat: 12.9716,
    lng: 77.5946,
  });
  const [accessible, setAccessible] = useState(false);

  const isServiceAvailable = (coords) => {
    const distance = getDistance(
      {
        latitude: coords?.lat || location.lat,
        longitude: coords?.lng || location.lng,
      },
      { latitude: allowedArea.latitude, longitude: allowedArea.longitude }
    );
    return distance <= allowedArea.radius;
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location Error", "Permission to access location denied");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      console.log("GPS updating: ", location);
    } catch (err) {
      Alert.alert("Location Error", err.message);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    setAccessible(isServiceAvailable());

    const watch = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 10 },
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    );

    return () => {
      watch && watch.then((sub) => sub.remove());
    };
  }, []);

  const value = useMemo(
    () => ({ location, accessible }),
    [location, accessible]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
