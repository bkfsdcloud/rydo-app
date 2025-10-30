import axios from 'axios';
import { Alert } from 'react-native';
import { api } from '../../scripts/api/userApi';
import { getLoadingRef } from '../loadingRef';

const axis = axios.create({
  baseURL: 'https://ohtryxvm9b.execute-api.ap-south-1.amazonaws.com/dev',
  timeout: 10000,
});

export const handleGetDistance = async (params) => {
  const res = await api.get("/api/geo/distance", {
    params: params,
  });
  return res.data;
};

export const handleGetFare = async (params) => {
  const res = await api.get("/api/geo/fare", {
  params: params,
  });
  return res.data;
};

export const handleGetRoute = async (params) => {
  const res = await axis.get("/api/v1/rydo/maps/route", {
    params: params,
  });
  return res.data;
};

export const handleGetNavigation = async (params) => {
  const res = await api.get("/api/geo/navigation", {
    params: params,
  });
  return res.data;
};

export const handleAutocomplete = async (params) => {
  const res = await axis.get("/api/v1/rydo/maps/autocomplete", {
    params: params,
  });
  return res.data.predictions;
};

export const getAddress = async (params) => {
  const res = await axis.get("/api/v1/rydo/maps/address", {
    params: params,
  });
  return res.data;
};

export const getCoords = async (params) => {
  const res = await axis.get("/api/v1/rydo/maps/coords", {
    params: params,
  });
  return res.data;
};

axis.interceptors.request.use(
  async (config) => {
    getLoadingRef().showLoading();
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axis.interceptors.response.use(
  response => {
    getLoadingRef().hideLoading();
    return response;
  }, // Pass successful responses
  async error => {
    getLoadingRef().hideLoading();
    if (error.response) {
      console.log(error.response.data);
      // Server responded with status != 2xx
      Alert.alert('Error', error.response.data.message);
    } else if (error.request) {
      console.log(error.request)
      Alert.alert('Error', 'No response from server');
    } else {
      Alert.alert('Error', error.message);
    }
    return Promise.reject(error); // Keep rejection for component-level handling if needed
  }
);