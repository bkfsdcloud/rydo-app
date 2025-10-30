import { StyleSheet } from "react-native";

export const API_URL = "http://192.168.1.15:8083";
export const SOCKET_URL = "wss://yugvqed780.execute-api.ap-south-1.amazonaws.com/dev/";
export const GOOGLE_MAPS_API_KEY = "AIzaSyDqaqO6czuq1cTzTetNJU6yhnQP2b6_k8U";

export const ORIGIN = 'origin';
export const DESTINATION = 'destination';

export const commonStyles = StyleSheet.create({
    container: { flex: 1 },
    overlayContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    zIndex: 999,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overlayIcon: {
    backgroundColor: "#fff",
            margin: 10,
            borderRadius: "50%",
  }
});