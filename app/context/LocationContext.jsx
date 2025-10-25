// LocationContext.js
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { createContext, useEffect, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const allowedArea = {
    latitude: 11.01602, // center latitude
    longitude: 76.97031, // center longitude
    radius: 60000, // in meters
  };

  const [error, setError] = useState(null);
  const [location, setLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });
  const [accessible, setAccessible] = useState(false);

  const isUserInsideAllowedArea = () => {
    const distance = getDistance(
      {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      { latitude: allowedArea.latitude, longitude: allowedArea.longitude }
    );
    setAccessible(distance <= allowedArea.radius);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location denied");
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(pos.coords);
      console.log(location);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    isUserInsideAllowedArea();

    // Optional: track location changes
    const watch = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 10 },
      (pos) => setLocation(pos.coords)
    );

    return () => {
      watch && watch.then((sub) => sub.remove());
    };
  }, []);

  return (
    <LocationContext.Provider
      value={{ location, error, refresh: getCurrentLocation, accessible }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
