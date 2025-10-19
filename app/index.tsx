import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Toast from 'react-native-toast-message';
import LoadingModal from './component/LoadingModal';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <RootNavigator />
        <StatusBar style="auto" />
         <LoadingModal />
         <Toast />
      </LoadingProvider>
    </AuthProvider>
  );
}
