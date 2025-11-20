import BottomPanel from "@/app/component/BottomPanel";
import { LocationContext } from "@/app/context/LocationContext";
import { getAddress } from "@/scripts/api/geoApi";
import { available } from "@/scripts/api/riderApi";
import { commonStyles, DESTINATION, ORIGIN } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import LocationInput from "../../component/LocationInput";
import { useRideStore } from "../../store/useRideStore";

export default function MapScreen() {
  const navigation = useNavigation();
  const { location, accessible } = useContext(LocationContext);

  const { id, origin, setOrigin, destination } = useRideStore();

  const mapRef = useRef(null);
  const [drivers, setDrivers] = useState([]);

  const sheetRef = useRef(null);
  const [closablePan, setClosablePan] = useState(false);
  const [bottomView, setBottomView] = useState("DEFAULT");

  const sheetY = useSharedValue(0);
  const floatingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(-sheetY.get() - 30),
        },
      ],
    };
  });

  // useEffect(() => {
  //   if (id > 0) {
  //     navigation.navigate("RideBooking");
  //   }
  // }, [id]);

  useEffect(() => {
    // setDefault();
    setAddress();
  }, []);

  const setDefault = () => {
    setBottomView("DEFAULT");
    setClosablePan(false);
    sheetRef.current?.expand();
  };

  const setAddress = async () => {
    if (!origin?.coords) {
      const response = await getAddress(location);
      setOrigin({ ...response, coords: location });
    }
  };
  async function updateMapLocation(newLocation) {
    if (newLocation) {
      const coords = {
        lat: newLocation?.latitude || newLocation?.lat,
        lng: newLocation?.longitude || newLocation?.lng,
      };
      const response = await getAddress(coords);
      setOrigin({ ...response, coords });
    }
  }

  const checkAvailableDrivers = async () => {
    const body = {
      latitude: origin.coords?.lat,
      longitude: origin.coords?.lng,
    };
    const res = await available(body);
    setDrivers(res.data || []);
  };

  const handleCheckAvailable = useCallback(() => {
    checkAvailableDrivers();
  }, [origin?.coords]);

  const trimSpace = (value) => (value ? value.trim() : value);

  const driverMarkers = useMemo(
    () =>
      drivers.map((key) => (
        <Marker
          key={key.driverId}
          anchor={{ x: 0.5, y: 0.5 }}
          coordinate={{
            latitude: key.positions.latitude,
            longitude: key.positions.longitude,
          }}
          title={key.distance}
        >
          <Image
            source={require("@/assets/images/car-img.png")}
            style={{ width: 40, height: 40 }}
          />
          <Ionicons name="car-outline" size={40} color="grey" />
        </Marker>
      )),
    [drivers]
  );

  const regions = useMemo(
    () => ({
      latitude: (origin.coords && origin.coords?.lat) || location.lat,
      longitude: (origin.coords && origin.coords?.lng) || location.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    }),
    [origin.coords?.lat, origin.coords?.lng]
  );

  const recentreCurrentLocation = useCallback(() => {
    updateMapLocation(location);
    mapRef.current?.animateToRegion({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    });
  }, []);

  return (
    <View style={styles.container}>
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

      <View style={styles.container}>
        <MapView
          ref={mapRef}
          paddingAdjustmentBehavior="automatic"
          showsMyLocationButton={false}
          provider="google"
          style={styles.map}
          showsUserLocation={true}
          region={regions}
          onRegionChangeComplete={(newRegion, { isGesture }) => {
            console.log("Region changed", isGesture);
            if (id === 0 && isGesture) {
              updateMapLocation(newRegion);
            }
            // checkAvailableDrivers();
          }}
        >
          {driverMarkers}
        </MapView>
        {id === 0 && (
          <View style={commonStyles.markerFixed}>
            <Ionicons name="pin-outline" size={40} color="#E53935" />
          </View>
        )}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 20,
              right: 10,
              zIndex: 999,
              flexDirection: "row",
              gap: 10,
            },
            floatingStyle,
          ]}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: "50%",
              padding: 8,
              alignSelf: "flex-end",
            }}
            onPress={recentreCurrentLocation}
          >
            <Ionicons name="locate-outline" size={22} color={"#000"}></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: "50%",
              padding: 8,
              alignSelf: "flex-end",
            }}
            onPress={handleCheckAvailable}
          >
            <Ionicons name="beer-outline" size={22} color={"#000"}></Ionicons>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <BottomPanel
        enablePanClose={closablePan}
        ref={sheetRef}
        onPositionChange={(height) => {
          sheetY.set(height + 50);
        }}
      >
        <View style={{}}>
          {!accessible && (
            <View>
              <Text style={styles.title}>Set Pickup Location</Text>
              <Text style={styles.subtitle}>
                Move the map to adjust your pickup point
              </Text>
              <LocationInput
                editable={false}
                placeholder="Select Pick Up Location"
                value={trimSpace(
                  `${origin.description} ${origin.secondaryText}`
                )}
                onPress={() => {
                  navigation.navigate(
                    "LocationSearch",
                    { searchFor: ORIGIN },
                    { merge: true }
                  );
                }}
              />
              <LocationInput
                editable={false}
                placeholder="Select Drop Location"
                value={trimSpace(
                  `${destination.description} ${destination.secondaryText}`
                )}
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
                iconColor="red"
              />

              {destination.description && origin.description && !id && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate("RideBooking");
                  }}
                >
                  <Text style={styles.buttonText}>Search Ride</Text>
                </TouchableOpacity>
              )}
              {id > 0 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate("RideBooking");
                  }}
                >
                  <Text style={styles.buttonText}>View Ride</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {accessible && (
            <View>
              <TextInput
                allowFontScaling={false}
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
      </BottomPanel>
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
    fontSize: 12,
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
  row: {
    flexDirection: "row",
    gap: 10,
    margin: 3,
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
    fontSize: 14,
    fontWeight: "600",
  },
  subtitle: {
    color: "#777",
    marginTop: 4,
    fontSize: 12,
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
    fontWeight: "500",
    fontSize: 12,
  },
});
