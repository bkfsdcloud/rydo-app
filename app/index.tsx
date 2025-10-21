import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import LoadingModal from './component/LoadingModal';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { LocationProvider } from './context/LocationContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AuthProvider>
          <LoadingProvider>
            <LocationProvider>
              <RootNavigator />
            </LocationProvider>
            <StatusBar style="auto" />
            <LoadingModal />
            <Toast />
          </LoadingProvider>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
});
