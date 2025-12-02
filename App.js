import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";

import { AlertProvider } from "./app/context/AlertContext";
import { AuthProvider } from "./app/context/AuthContext";
import { LoadingProvider } from "./app/context/LoadingContext";
import { LocationProvider } from "./app/context/LocationContext";
import { SocketProvider } from "./app/context/SocketContext";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import LoadingModal from "./app/component/LoadingModal";
import RootNavigator from "./app/navigation/RootNavigator";

enableScreens(true);

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <NavigationContainer>
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
          </NavigationContainer>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
