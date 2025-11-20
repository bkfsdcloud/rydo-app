import BottomPanel from "@/app/component/BottomPanel";
import RatingComponent from "@/app/component/RatingComponent";
import { useAlert } from "@/app/context/AlertContext";
import LocationContext from "@/app/context/LocationContext";
import SocketContext from "@/app/context/SocketContext";
import { handleGetRoute } from "@/scripts/api/geoApi";
import { activeRide, available, createRide } from "@/scripts/api/riderApi";
import { commonStyles } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import polylineTool from "@mapbox/polyline";
import { useNavigation } from "@react-navigation/native";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import RideSummaryModal from "../../screens/rider/RideSummaryModal";
import { useRideStore } from "../../store/useRideStore";
import ChatScreen from "../profile/ChatScreen";

export default function RideBooking() {
  const { location } = useContext(LocationContext);
  const navigation = useNavigation();
  const { addListener, removeListener } = useContext(SocketContext);

  const {
    id,
    setId,
    origin,
    status,
    setStatus,
    destination,
    setDistance,
    setDuration,
    distanceKm,
    setDistanceKm,
    durationMin,
    setDurationMin,
    fare,
    setFares,
    transportMode,
    setTransportMode,
    category,
    paymentMethod,
    setPolyline,
    resetRide,
  } = useRideStore();
  const [localPolyline, setLocalPolyline] = useState([]);

  const mapRef = useRef(null);
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

  const { showAlert, hideAlert } = useAlert();

  const setDefault = () => {
    setBottomView("DEFAULT");
    setClosablePan(false);
    sheetRef.current?.expand();
  };

  useEffect(() => {
    if (id > 0 && !localPolyline?.length) {
      handleRoute();
    }
  }, [id, localPolyline]);

  useEffect(() => {
    addListener(handleMessage);
    return () => {
      removeListener(handleMessage);
    };
  }, []);

  const handleMessage = (parsed) => {
    if (parsed?.event === "sendMessage") return;
    console.log("📨 Notification from the driver:", parsed);
    if (parsed?.data) {
      setId(parsed?.data?.id);
      setStatus(parsed?.data?.status);
      Alert.alert("Information", parsed?.message);
      if (parsed?.data?.status === "COMPLETED") {
        setBottomView("RATE");
        setClosablePan(true);
        sheetRef.current?.expand();
      }
    } else {
      // resetRide();
      Alert.alert("Information", parsed?.message);
    }
  };

  useEffect(() => {
    if (mapRef.current && localPolyline?.length > 0) {
      mapRef.current.fitToCoordinates(localPolyline, {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  }, [localPolyline]);

  const handleRoute = async () => {
    if (!origin.coords || !destination.coords) return;
    const res = await handleGetRoute({
      origin: `${origin.coords.lat},${origin.coords.lng}`,
      destination: `${destination.coords.lat},${destination.coords.lng}`,
    });

    const coordinates = [];
    for (let step of res.steps) {
      const stepPoints = polylineTool.decode(step.polyline?.points);
      stepPoints.forEach(([lat, lng]) =>
        coordinates.push({ latitude: lat, longitude: lng })
      );
    }
    setLocalPolyline(coordinates);
    setFares(res.fares);
    setDistance(res.distance);
    setDuration(res.duration);
    setDistanceKm(res.distanceKm);
    setDurationMin(res.durationMin);
    setTransportMode("Car");
  };

  const handleBookRide = async () => {
    const body = {
      fareEstimated: fare,
      pickupLat: origin.coords.lat,
      pickupLng: origin.coords.lng,
      dropLat: destination.coords.lat,
      dropLng: destination.coords.lng,
      distanceKm: distanceKm,
      pickupLocation: origin.description,
      dropLocation: destination.description,
      duration: durationMin,
      transportMode,
      category,
      paymentMethod,
    };
    const res = await createRide(body);
    setId(res.data?.id);
    setStatus(res.data?.status);
    Alert.alert("Ride Created", res.message);
  };

  const originMarkerCb = useMemo(() => {
    if (!origin.coords && !location) return null;
    return (
      <Marker
        anchor={{ x: 0.5, y: 0.5 }}
        pinColor="green"
        coordinate={{
          latitude: origin.coords.lat || location.lat,
          longitude: origin.coords.lng || location.lng,
        }}
        title={origin.description}
      >
        <Ionicons
          name="radio-button-on-outline"
          size={20}
          color={"green"}
        ></Ionicons>
      </Marker>
    );
  }, [origin.coords, origin.description, location]);

  const destMarkerCb = useMemo(() => {
    if (!destination.coords) return null;
    return (
      <Marker
        pinColor="red"
        anchor={{ x: 0.5, y: 0.5 }}
        coordinate={{
          latitude: destination.coords?.lat,
          longitude: destination.coords?.lng,
        }}
        title={destination.description}
      >
        <Ionicons
          name="radio-button-on-outline"
          size={20}
          color={"red"}
        ></Ionicons>
      </Marker>
    );
  }, [destination.coords, destination.description]);

  const polyLineCb = useMemo(() => {
    if (!localPolyline?.length) return null;

    return (
      <Polyline
        coordinates={localPolyline}
        strokeWidth={5}
        strokeColor="blue"
        geodesic={true}
      />
    );
  }, [localPolyline]);

  const regions = useMemo(
    () => ({
      latitude: (origin.coords && origin.coords?.lat) || location.lat,
      longitude: (origin.coords && origin.coords?.lng) || location.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    }),
    [origin.coords]
  );

  const handleShowAlert = useCallback((options) => {
    showAlert(options);
  }, []);
  const handleHideAlert = useCallback(() => hideAlert(), []);

  return (
    <View style={styles.container}>
      <View style={commonStyles.overlayContainer}>
        <TouchableOpacity
          style={commonStyles.overlayIcon}
          onPress={() => {
            setPolyline([]);
            navigation.replace("RiderHome");
          }}
        >
          <Ionicons
            name="arrow-back-outline"
            size={20}
            color={"#000"}
            style={{ padding: 10 }}
          ></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.overlayIcon}
          onPress={async () => {
            const res = await activeRide({});
            if (res.data?.id > 0) {
              setId(res.data?.id);
              setStatus(res.data?.status || "");
            } else {
              resetRide();
              navigation.replace("RiderHome");
            }
          }}
        >
          <Ionicons
            name="location-outline"
            size={20}
            color={"#000"}
            style={{ padding: 10 }}
          ></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.overlayIcon}
          onPress={async () => {
            const body = {
              id: id,
              radiusKm: 20,
            };
            const res = await available({ rideData: body });
            setStatus(res.data?.status);
            setId(res.data?.id);
            Alert.alert("Info", res.message);
          }}
        >
          <Ionicons
            name="beer-outline"
            size={20}
            color={"#000"}
            style={{ padding: 10 }}
          ></Ionicons>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider="google"
          paddingAdjustmentBehavior="automatic"
          style={styles.map}
          region={regions}
        >
          {originMarkerCb}
          {destMarkerCb}
          {polyLineCb}
        </MapView>
      </View>
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
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          {status && !["REQUESTED"].includes(status) && (
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderRadius: "50%",
                padding: 10,
                alignSelf: "flex-end",
              }}
              onPress={() => {
                setBottomView("CHAT");
                setClosablePan(true);
                sheetRef.current?.expand();
              }}
            >
              <Ionicons name="chatbubbles-outline" size={22}></Ionicons>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <BottomPanel
        enablePanClose={closablePan}
        ref={sheetRef}
        onPositionChange={(height) => {
          sheetY.set(height + 50);
        }}
        onClose={setDefault}
      >
        {bottomView === "DEFAULT" && (
          <View>
            <Text style={{ fontSize: 22, color: "#000" }}>
              Status: {status}
            </Text>
            <RideSummaryModal
              onConfirm={handleBookRide}
              handleShowAlert={handleShowAlert}
              handleHideAlert={handleHideAlert}
            />
          </View>
        )}
        {bottomView === "CHAT" && <ChatScreen></ChatScreen>}
        {bottomView === "RATE" && (
          <RatingComponent onClose={setDefault}></RatingComponent>
        )}
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
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
