import BottomPanel from "@/app/component/BottomPanel";
import LocationInput from "@/app/component/LocationInput";
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
import { StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TouchableButton from "../../component/TouchableButton";
import { useRideStore } from "../../store/useRideStore";

export default function MapScreen() {
  const navigation = useNavigation();
  const { location, accessible } = useContext(LocationContext);

  const { id, origin, setOrigin, destination } = useRideStore();

  const initialRef = useRef(false);
  const mapRef = useRef(null);

  const [recentre, setRecentre] = useState(true);
  const [drivers, setDrivers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [confirmLocation, setConfirmLocation] = useState(true);

  const sheetRef = useRef(null);

  const sheetY = useSharedValue(0);
  const floatingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(-sheetY.get() - 10),
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
    if (!initialRef.current) {
      setAddress();
      initialRef.current = true;
    }
    return () => (initialRef.current = false);
  }, []);

  const setAddress = async () => {
    if (!origin?.coords) {
      const response = await getAddress(location);
      setOrigin({ ...response, coords: location });
    }
  };
  const onRegionChangeCompleteCb = useCallback(
    async (newRegion, isGesture) => {
      if (id === 0 && isGesture) {
        setRecentre(false);
        // console.log("Region change", newRegion);
        // setCurrentRegion(newRegion);
        // setSearching(false);
        updateMapLocation(newRegion);
        // checkAvailableDrivers();
      }
    },
    [id]
  );

  const updateMapLocation = useCallback(async (newRegion) => {
    const coords = {
      lat: newRegion?.latitude || newRegion?.lat,
      lng: newRegion?.longitude || newRegion?.lng,
    };
    const response = await getAddress(coords);
    setOrigin({ ...response, coords });
  }, []);

  const checkAvailableDrivers = useCallback(async () => {
    const body = {
      latitude: origin.coords?.lat,
      longitude: origin.coords?.lng,
    };
    const res = await available(body);
    setDrivers(res.data || []);
  }, [origin?.coords?.lat, origin?.coords?.lng]);

  const trimSpace = (value) => (value ? value.trim() : value);

  const driverMarkers = useMemo(
    () =>
      drivers
        .filter((key) => key?.connectionId)
        .map((key) => (
          <Marker
            key={key.driverId}
            anchor={{ x: 0.5, y: 0.5 }}
            coordinate={{
              latitude: key.positions.lat,
              longitude: key.positions.lng,
            }}
            title={key.distance}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="car-outline" size={40} color="red" />
            </View>
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
    setRecentre(true);
    mapRef.current?.animateToRegion({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    });
  }, [location.lat, location.lng]);

  return (
    <View style={styles.container}>
      <View style={commonStyles.overlayContainer}>
        <TouchableButton
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
        </TouchableButton>
        <TouchableButton
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
        </TouchableButton>
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
          onRegionChangeStart={() => setRecentre(false)}
          onRegionChangeComplete={(newRegion, { isGesture }) =>
            onRegionChangeCompleteCb(newRegion, isGesture)
          }
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
          <TouchableButton
            style={{
              backgroundColor: "#fff",
              borderRadius: "50%",
              padding: 8,
              alignSelf: "flex-end",
            }}
            onPress={recentreCurrentLocation}
          >
            <Ionicons
              name="locate-outline"
              size={22}
              color={recentre ? "blue" : "#000"}
            ></Ionicons>
          </TouchableButton>
          <TouchableButton
            style={{
              backgroundColor: "#fff",
              borderRadius: "50%",
              padding: 8,
              alignSelf: "flex-end",
            }}
            onPress={checkAvailableDrivers}
          >
            <Ionicons name="beer-outline" size={22} color={"#000"}></Ionicons>
          </TouchableButton>
        </Animated.View>
      </View>

      <BottomPanel
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
                placeholder={
                  searching ? "Fetching Location..." : "Select Pick Up Location"
                }
                value={
                  searching
                    ? ""
                    : trimSpace(`${origin.description} ${origin.secondaryText}`)
                }
                onPress={() => {
                  navigation.navigate(
                    "LocationSearch",
                    { searchFor: ORIGIN },
                    { merge: true }
                  );
                }}
              />

              {!confirmLocation && (!id || id === 0) && (
                <TouchableButton
                  style={styles.button}
                  disabled={searching}
                  onPress={() => {
                    setConfirmLocation(true);
                    updateMapLocation();
                  }}
                >
                  <Text style={styles.buttonText}>Confirm Location</Text>
                </TouchableButton>
              )}

              {confirmLocation && (
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
              )}

              {confirmLocation &&
                destination.description &&
                origin.description &&
                !id && (
                  <TouchableButton
                    style={commonStyles.button}
                    onPress={() => {
                      navigation.navigate("RideBooking");
                    }}
                  >
                    <Text style={commonStyles.buttonText}>Search Ride</Text>
                  </TouchableButton>
                )}
              {confirmLocation && id > 0 && (
                <TouchableButton
                  style={commonStyles.button}
                  onPress={() => {
                    navigation.navigate("RideBooking");
                  }}
                >
                  <Text style={commonStyles.buttonText}>View Ride</Text>
                </TouchableButton>
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
              <TouchableButton
                style={styles.phoneBookingButton}
                onPress={() => {
                  navigation.navigate("PhoneBooking");
                }}
              >
                <Text style={styles.buttonText}>Phone Booking</Text>
              </TouchableButton>
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
