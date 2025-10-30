import { LocationContext } from "@/app/context/LocationContext";
import { getAddress } from "@/scripts/api/geoApi";
import { commonStyles, DESTINATION, ORIGIN } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView from "react-native-maps";
import { useRideStore } from "../../store/useRideStore";

export default function MapScreen() {
  const navigation = useNavigation();
  const { location, accessible } = useContext(LocationContext);

  const { origin, destination, setOrigin } = useRideStore();
  const [locationConfirm, setLocationConfirm] = useState(false);

  const mapRef = useRef(null);

  async function updateMapLocation(newLocation) {
    const response = await getAddress({
      lat: newLocation?.latitude || origin.coords.lat || location.latitude,
      lng: newLocation?.longitude || origin.coords.lng || location.longitude,
    });
    setOrigin({ ...response, coords: origin.coords });
  }

  useLayoutEffect(() => {
    async function checkActive() {
      // const active = //await activeRide();
    }

    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          style={{ marginRight: 20 }}
          onPress={checkActive}
          color={"green"}
          name="alert-outline"
          size={24}
        ></Ionicons>
      ),
    });
    checkActive();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        paddingAdjustmentBehavior="automatic"
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: origin.coords.lat || location.latitude,
          longitude: origin.coords.lng || location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onMapReady={() => {
          updateMapLocation();
        }}
        onRegionChangeComplete={async (newRegion) => {
          setLocationConfirm(false);
          updateMapLocation(newRegion);
        }}
      ></MapView>

      <View style={commonStyles.overlayContainer}>
        <TouchableOpacity
          style={commonStyles.overlayIcon}
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Ionicons
            name="menu-outline"
            size={20}
            color={"#000"}
            style={{ padding: 10 }}
          ></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.overlayIcon}
          onPress={() => {
            navigation.navigate("Notifications");
          }}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={"#000"}
            style={{ padding: 10 }}
          ></Ionicons>
        </TouchableOpacity>
      </View>

      <View style={styles.markerFixed}>
        <Ionicons name="location-sharp" size={40} color="#E53935" />
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#fff",
          top: "70%",
          left: "88%",
          width: "35",
          height: "35",
          borderRadius: "50%",
          position: "absolute",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
        onPress={() => {
          mapRef.current?.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }}
      >
        <Ionicons
          name="locate-outline"
          size={22}
          color={"#000"}
          style={{ padding: 7 }}
        ></Ionicons>
      </TouchableOpacity>
      <View style={styles.bottomCard}>
        {!accessible && (
          <View>
            <Text style={styles.title}>Set Pickup Location</Text>
            <Text style={styles.subtitle}>
              Move the map to adjust your pickup point
            </Text>
            <TextInput
              editable={false}
              value={origin.description}
              onPress={() => {
                navigation.navigate(
                  "LocationSearch",
                  { searchFor: ORIGIN },
                  { merge: true }
                );
              }}
              placeholder="Select Pick Up Location"
              placeholderTextColor={"grey"}
              style={styles.input}
            />

            {locationConfirm ? (
              <TextInput
                editable={false}
                value={destination.description}
                onPress={() => {
                  navigation.navigate(
                    "LocationSearch",
                    {
                      searchFor: DESTINATION,
                      title: "Choose Drop Location",
                    },
                    { merge: true }
                  );
                }}
                placeholder="Select Drop Location"
                placeholderTextColor={"grey"}
                style={styles.input}
              />
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setLocationConfirm(true);
                }}
              >
                <Text style={styles.buttonText}>Confirm Location</Text>
              </TouchableOpacity>
            )}
            {locationConfirm &&
              destination.description &&
              origin.description && (
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    backgroundColor: "#007AFF",
                    padding: 15,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                  onPress={() => {
                    navigation.navigate("RideBooking");
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Book Ride
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        )}
        {accessible && (
          <View>
            <TextInput
              editable={false}
              value={origin.description}
              placeholder="Select Pick Up Location"
              placeholderTextColor={"grey"}
              style={styles.input}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                padding: 10,
                textAlign: "center",
              }}
            >
              No Service available in this Area
            </Text>
            <TouchableOpacity
              style={styles.phoneBookingButton}
              onPress={() => {
                navigation.navigate("PhoneBooking");
              }}
            >
              <Text style={styles.buttonText}>Phone Booking</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  overlayContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    zIndex: 999,
  },
  welcome: { fontSize: 16, fontWeight: "bold", color: "#000" },
  inputContainer: { marginVertical: 5, position: "relative" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  dropdown: {
    position: "absolute",
    top: 45,
    width: "100%",
    maxHeight: 150,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    zIndex: 1000,
  },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  clearButton: {
    position: "absolute",
    right: 10,
    top: 12,
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
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    color: "#777",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#007BFF",
    margin: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  phoneBookingButton: {
    backgroundColor: "#f0140cff",
    marginTop: 15,
    opacity: 0.3,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20, // half icon width
    marginTop: -40, // half icon height
    zIndex: 10,
  },
});
