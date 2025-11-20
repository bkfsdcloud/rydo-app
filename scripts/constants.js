import { StyleSheet } from "react-native";

export const API_URL = "http://192.168.1.15:8083";
export const SOCKET_URL =
  "wss://yugvqed780.execute-api.ap-south-1.amazonaws.com/dev/";
export const GOOGLE_MAPS_API_KEY = "AIzaSyDqaqO6czuq1cTzTetNJU6yhnQP2b6_k8U";

export const ORIGIN = "origin";
export const DESTINATION = "destination";

export const commonStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  map: { flex: 1 },
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
  },
  row: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  column: {
    flex: 1,
    flexDirection: "column",
    gap: 5,
    justifyContent: "center",
  },
  contentCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20, // half icon width
    marginTop: -40, // half icon height
    zIndex: 10,
  },
  fixedRow: {
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
  title: {
    fontSize: 18,
    fontWeight: "600",
    paddingTop: 5,
  },
  banner: {
    fontSize: 14,
    fontWeight: "500",
  },
  subtitle: {
    color: "#777",
    marginTop: 4,
    fontSize: 12,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f3f2f2ff",
    fontSize: 14,
    padding: 10,
  },
  dropdown: {
    position: "absolute",
    top: "9%",
    width: "100%",
    maxHeight: 250,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    zIndex: 1000,
  },
  dropdownPanel: {
    flex: 1,
    flexDirection: "row",
    width: "90%",
  },
  item: {
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "90%",
    flexGrow: 1,
  },
  dropdownIcon: {
    padding: 5,
    fontSize: 20,
    top: 5,
  },
  text: {
    fontSize: 14,
  },
  subText: {
    fontSize: 12,
  },
  textAlignCenter: {
    textAlign: "center",
  },
  disabled: {
    backgroundColor: "#f3f2f2ff",
  },
});
