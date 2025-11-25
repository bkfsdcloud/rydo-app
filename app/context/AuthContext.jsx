import { allConfigs } from "@/scripts/api/miscApi";
import { activeRide } from "@/scripts/api/riderApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import WebSocketService from "../../scripts/WebSocketService";
import useMessageStore from "../store/useMessageStore";
import { useRideStore } from "../store/useRideStore";
import useUserStore from "../store/useUserStore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState("");

  const {
    setId,
    setStatus,
    setDestination,
    setOrigin,
    setTransportMode,
    setPaymentMethod,
    setCategory,
    resetRide,
    setDistance,
    setDuration,
    setFare,
    setDriverId,
    setRiderId,
    setCommissionAmount,
    setDriverEarning,
  } = useRideStore();

  const { setMessages } = useMessageStore();
  const { setFavourites } = useUserStore();

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      if (storedToken && user) {
        setToken(storedToken);
      } else {
        setToken(null);
      }
    };
    loadToken();
  }, []);

  const saveToken = async (response) => {
    console.log("Save token : ", response);
    await AsyncStorage.setItem("userToken", response.token);
    setToken(response.token);
    setUser(response);
    checkForActiveRide();
    loadConfig();
  };

  const loadConfig = async () => {
    const response = await allConfigs();
    if (response?.data) {
      setMessages(response?.data);
      setFavourites(response?.data?.favourites);
    }
  };

  const checkForActiveRide = async () => {
    const res = await activeRide({});
    if (res.data?.id) {
      setId(res.data?.id);
      setStatus(res.data?.status);
      setDriverId(res.data?.driverId || 0);
      setRiderId(res.data?.riderId || 0);

      setOrigin({
        description: res?.data?.pickup_location,
        coords: {
          lat: res?.data?.pickup_lat,
          lng: res?.data?.pickup_lng,
        },
      });
      setDestination({
        description: res?.data?.drop_location,
        coords: { lat: res?.data?.drop_lat, lng: res?.data?.drop_lng },
      });
      setPaymentMethod(res?.data?.payment_mode);
      setTransportMode(res?.data?.transport_mode);
      setCategory(res?.data?.category);
      setDuration(res?.data?.duration_minutes);
      setFare(res?.data?.fare_estimated);
      setDistance(res?.data?.distance_km);
      setCommissionAmount(res?.data?.commissionAmount);
      setDriverEarning(res?.data?.driverEarning);
    }
  };

  const logout = async () => {
    console.log("Logout =>");
    await AsyncStorage.removeItem("userToken");
    WebSocketService.disconnect();
    resetRide();

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
