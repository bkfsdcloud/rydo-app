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
  },
  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 5,
  },
  textWhite: {
    color: "#fff",
    fontWeight: "500",
  },
  dropdownRecent: {
    position: "absolute",
    top: 30,
    width: "100%",
    maxHeight: 150,
    borderColor: "#ccc",
    borderRadius: 5,
    zIndex: 900,
  },
  dropdownPanelRecent: {
    flex: 1,
    flexDirection: "row",
    width: "90%",
    padding: 2,
  }
});