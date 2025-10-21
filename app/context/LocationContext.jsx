// LocationContext.js
import * as Location from "expo-location";
import { createContext, useEffect, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });
  const [error, setError] = useState(null);

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
      value={{ location, error, refresh: getCurrentLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
