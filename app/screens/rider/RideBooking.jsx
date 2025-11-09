import { LocationContext } from "@/app/context/LocationContext";
import { handleGetRoute } from "@/scripts/api/geoApi";
import { activeRide, available, createRide } from "@/scripts/api/riderApi";
import { commonStyles } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import polylineTool from "@mapbox/polyline";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useRideStore } from "../../store/useRideStore";
import RideSummaryModal from "./RideSummaryModal";

export default function RideBooking({ navigation }) {
  const { location } = useContext(LocationContext);

  const {
    origin,
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
    setCategory,
    paymentMethod,
    setPaymentMethod,
  } = useRideStore();

  const [polyline, setPolyline] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [rideData, setRideData] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    handleRoute();
  }, []);

  useEffect(() => {
    if (mapRef.current && polyline.length > 0) {
      mapRef.current.fitToCoordinates(polyline, {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  }, [polyline]);

  const handleRoute = async () => {
    if (!origin.place_id || !destination.place_id) return;
    const res = await handleGetRoute({
      origin: "place_id:" + origin.place_id,
      destination: "place_id:" + destination.place_id,
    });

    const coordinates = [];
    for (let step of res.overview_polyline) {
      const stepPoints = polylineTool.decode(step.polyline.points);
      stepPoints.forEach(([lat, lng]) =>
        coordinates.push({ latitude: lat, longitude: lng })
      );
    }
    setPolyline(coordinates);
    setFares(res.fares);
    setDistance(res.distance);
    setDuration(res.duration);
    setDistanceKm(res.distanceKm);
    setDurationMin(res.durationMin);
    setTransportMode("Car");
    setCategory("standard");
    setPaymentMethod("Cash");
    setTimeout(() => setShowModal(true), 500);
  };

  const handleBookRide = async () => {
    setShowModal(false);
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
    console.log("body: ", body);
    const res = await createRide(body);
    Alert.alert("Ride Created", res.data);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        paddingAdjustmentBehavior="automatic"
        style={styles.map}
        region={{
          latitude: origin.coords.lat || location.latitude,
          longitude: origin.coords.lng || location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          anchor={{ x: 0.5, y: 0.5 }}
          pinColor="green"
          icon={
            <Ionicons name="pin-outline" size={20} color={"green"}></Ionicons>
          }
          coordinate={{
            latitude: origin.coords.lat,
            longitude: origin.coords.lng,
          }}
          title={origin.description}
        />
        <Marker
          pinColor="red"
          icon={
            <Ionicons name="pin-outline" size={20} color={"red"}></Ionicons>
          }
          anchor={{ x: 0.5, y: 0.5 }}
          coordinate={{
            latitude: destination.coords.lat,
            longitude: destination.coords.lng,
          }}
          title={destination.description}
        />
        {polyline.length > 0 && (
          <Polyline
            coordinates={polyline}
            strokeWidth={5}
            strokeColor="blue"
            geodesic={true}
          />
        )}
      </MapView>
      <View style={commonStyles.overlayContainer}>
        <Text style={{ fontSize: 22, color: "#fff" }}>
          Status: {rideData?.status}
        </Text>
        <TouchableOpacity
          style={commonStyles.overlayIcon}
          onPress={() => {
            navigation.goBack();
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
            setRideData(res.data);
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
              fareEstimated: fare,
              pickupLat: origin.coords.lat,
              pickupLng: origin.coords.lng,
              dropLat: destination.coords.lat,
              dropLng: destination.coords.lng,
              distanceKm: distanceKm,
              pickupLocation: origin.description,
              dropLocation: destination.description,
              duration: durationMin,
            };
            const res = await available({ rideData: body });
            console.log(res);
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

      <View style={{}}>
        <RideSummaryModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleBookRide}
        />
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
