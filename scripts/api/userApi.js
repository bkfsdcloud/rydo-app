import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../constants';
import { getLoadingRef } from '../loadingRef';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const loginUser = async (phone) => {
  const response = await api.get(`/api/users/phone/${phone}`);
  return response;
};

export const signUp = async (user) => {
  console.log(user)
  const response = await api.post('/api/auth/signup', user);
  return response;
};

export const genOtp = async (phone) => {
  const response = await api.post('/api/auth/send-otp', {phone});
  return response;
};

export const verifyOtp = async (phone, otp) => {
  const response = await api.post('/api/auth/verify-otp', {phone, otp});
  return response;
};

export const loadUserProfile = async () => {
  const response = await api.get('/api/profile');
  return response.data;
};

ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.log('Global JS Error:', error);

  if (isFatal) {
    Alert.alert(
      'Unexpected error occurred',
      `
      Error: ${error.name} ${error.message}
      We have reported this issue.
      `,
      [{ text: 'OK' }]
    );
  } else {
    // Non-fatal errors can be logged
    console.error(error); 
  }
});

api.interceptors.request.use(
  async (config) => {
    getLoadingRef().showLoading();
    const token = await AsyncStorage.getItem('userToken'); // get token
    console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    getLoadingRef().hideLoading(false);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(response.data);
    getLoadingRef().hideLoading();
    return response;
  }, // Pass successful responses
  async error => {
    getLoadingRef().hideLoading();
    
    if (error.response) {
      console.log(error.response.data);
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('userToken');
      }
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


