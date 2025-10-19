import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { loadUserProfile } from '../../scripts/api/userApi';

/**
 * Mock auth context
 * - login({role, name}) sets a simple user object
 * - roles: 'rider' | 'driver'
 */

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // <-- new loading state
  const [user, setUser] = useState('');

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false); // done checking token
    };
    loadToken();
  }, []);

  const saveToken = async (newToken) => {
    await AsyncStorage.setItem('userToken', newToken);
    setToken(newToken);
    const userRes = await loadUserProfile();
    // console.log(userRes.data)
    setUser(userRes.data);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
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