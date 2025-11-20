import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import Toast from "react-native-toast-message";

import LoadingModal from "./component/LoadingModal";

import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import { LocationProvider } from "./context/LocationContext";
import { SocketProvider } from "./context/SocketContext";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import RootNavigator from "./navigation/RootNavigator";

enableScreens(true);

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <LoadingProvider>
            <LocationProvider>
              <SocketProvider>
                <BottomSheetModalProvider>
                  <AlertProvider>
                    <RootNavigator />

                    <StatusBar style="auto" />
                    <LoadingModal />
                    <Toast />
                  </AlertProvider>
                </BottomSheetModalProvider>
              </SocketProvider>
            </LocationProvider>
          </LoadingProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
