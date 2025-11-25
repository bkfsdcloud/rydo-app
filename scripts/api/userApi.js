import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
import { LoadingController } from "../../app/context/LoadingContext";
import { API_URL } from "../constants";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const loginUser = async (phone) => {
  const response = await api.get(`/api/users/phone/${phone}`);
  return response;
};

export const signUp = async (user) => {
  const response = await api.post(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/users/signup",
    user
  );
  return response;
};

export const genOtp = async (phone) => {
  const response = await api.post(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/users/generate-otp",
    { phone }
  );
  return response;
};

export const verifyOtp = async (phone, otp) => {
  const response = await api.post(
    "https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/rydo/users/verify-otp",
    { phone, otp }
  );
  return response;
};

export const loadUserProfile = async () => {
  const response = await api.get("/api/profile");
  return response.data;
};

ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.log("Global JS Error:", error);

  if (isFatal) {
    LoadingController.stop();
    Alert.alert(
      "Unexpected error occurred",
      `
      Error: ${error.name} ${error.message}
      We have reported this issue.
      `,
      [{ text: "OK" }]
    );
  } else {
    // Non-fatal errors can be logged
    // console.error(error);
  }
});

api.interceptors.request.use(
  async (config) => {
    if (!config?.skipGlobalLoader) {
      LoadingController.start();
    }
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (!error.config?.skipGlobalLoader) {
      LoadingController.stop();
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (!response.config?.skipGlobalLoader) {
      LoadingController.stop();
    }
    console.log("response => ", response?.data);
    return response;
  }, // Pass successful responses
  async (error) => {
    if (!error.config?.skipGlobalLoader) {
      LoadingController.stop();
    }
    console.log("error => ", error.code, error?.message);

    if (error.response) {
      console.log("error response => ", error.response.data);
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("userToken");
      }
      // Server responded with status != 2xx
      Alert.alert("Error", error.response.data.message);
    } else if (error.request) {
      Alert.alert("Error", "No response from server");
    } else {
      Alert.alert("Error", error.message);
    }
    return Promise.reject(error); // Keep rejection for component-level handling if needed
  }
);
