import { useAlert } from "@/app/context/AlertContext";
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
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { handleGetRoute } from "../../../scripts/api/geoApi";
import { updateStatus } from "../../../scripts/api/riderApi";
import { commonStyles } from "../../../scripts/constants";
import BottomPanel from "../../component/BottomPanel";
import { LocationContext } from "../../context/LocationContext";
import SocketContext from "../../context/SocketContext";
import { useRideStore } from "../../store/useRideStore";
import ChatScreen from "../profile/ChatScreen";

export default function DriverHome() {
  const { location } = useContext(LocationContext);
  const { sendMessage, addListener, removeListener } =
    useContext(SocketContext);

  const navigation = useNavigation();
  const {
    id,
    setId,
    origin,
    setOrigin,
    destination,
    setDestination,
    distance,
    setDistance,
    setDuration,
    fare,
    setFare,
    distanceKm,
    setDistanceKm,
    setDurationMin,
    status,
    setStatus,
    resetRide,
  } = useRideStore();

  const [dutyStatus, setDutyStatus] = useState("AVAILABLE");
  const mapRef = useRef(null);
  const [reason, setReason] = useState("");
  const [showReason, setShowReason] = useState(false);
  const [localPolyline, setLocalPolyline] = useState([]);
  // const [showAlert, setShowAlert] = useState(false);
  const [tempLocation, setTempLocation] = useState({
    description: "",
    coords: null,
  });
  const [steps, setSteps] = useState([]);
  const { showAlert, hideAlert } = useAlert();

  const sheetRef = useRef(null);
  const [closablePan, setClosablePan] = useState(false);
  const [bottomView, setBottomView] = useState("DEFAULT");

  const sheetY = useSharedValue(0);
  const floatingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(-sheetY.get() - 50),
        },
      ],
    };
  });

  useEffect(() => {
    // setDefault();
    if (status === "PENDING") {
      showAlert({
        title: "Ride Request!",
        message: `Total distance : ${distance} km Estimated Fare ₹${fare}`,
        leftText: "Reject",
        rightText: "Accept",
        onLeft: () => handleCancel,
        onRight: () => handleConfirm,
      });
      setShowReason(true);
    } else if (status === "ASSIGNED" && localPolyline?.length === 0) {
      setTempLocation({
        description: "You are here",
        coords: { lat: location.lat, lng: location.lng },
      });
      handleRoute(status);
    } else if (status === "ONGOING" && !localPolyline?.length) {
      handleRoute(status);
    }
  }, [status, distanceKm, fare]);

  const setDefault = () => {
    setBottomView("DEFAULT");
    setClosablePan(false);
    sheetRef.current?.expand();
  };

  const handleConfirm = async () => {
    hideAlert();
    const res = await updateStatus({
      rideData: { id: id, status: "ACCEPTED" },
    });
    if (res?.data) {
      setStatus(res?.data.status);
      handleRoute(res?.data.status);
    }
  };

  const handleCancel = async () => {
    hideAlert();
    setShowReason(false);
    const res = await updateStatus({
      rideData: { id: id, reason, status: "REJECTED" },
    });
    if (res?.data) {
      setStatus(null);
      setTempLocation({});
      resetRide();
      setLocalPolyline([]);
    }
  };

  const handleToPickup = async (status) => {
    if (status) {
      await updateStatus({
        rideData: { id: id, status: status },
      });
      setStatus(status);
      setTempLocation({});
    }
  };

  const handleStart = async () => {
    setTempLocation({});
    const res = await updateStatus({
      rideData: { id: id, status: "ONGOING" },
    });
    if (res?.data) {
      setStatus(res?.data.status);
      handleRoute(res?.data.status);
    }
  };

  const handleComplete = async () => {
    const res = await updateStatus({
      rideData: { id: id, status: "COMPLETED", finalFare: fare },
    });
    if (res?.data) {
      resetRide();
      setLocalPolyline([]);
    }
  };

  useEffect(() => {
    addListener(handleMessage);
    return () => {
      removeListener(handleMessage);
    };
  }, []);

  const handleMessage = (parsed) => {
    if (parsed?.event === "sendMessage") return;
    console.log("📨 Notification from the rider:", parsed);
    if (parsed?.data) {
      setId(parsed?.data?.id);
      setStatus(parsed?.data?.status);
      setFare(parsed.data?.fareEstimated);

      showAlert({
        title: parsed.message,
        message: `Total distance : ${parsed.data?.distance} KM. Estimated Fare ₹${parsed.data?.fareEstimated}`,
        leftText: "Reject",
        rightText: "Accept",
        onLeft: () => handleCancel,
        onRight: () => handleConfirm,
      });
      setOrigin({
        description: parsed?.data.pickupLocation,
        coords: { lat: parsed?.data?.pickupLat, lng: parsed?.data?.pickupLng },
      });
      setDestination({
        description: parsed?.data.dropLocation,
        coords: { lat: parsed?.data?.dropLat, lng: parsed?.data?.dropLng },
      });
    } else {
      resetRide();
      Alert.alert("Information", parsed?.message);
    }
  };

  const handleRoute = async (status) => {
    const res = await handleGetRoute({
      origin:
        status === "ASSIGNED"
          ? `${tempLocation.coords ? tempLocation.coords.lat : location.lat},${
              tempLocation.coords ? tempLocation.coords.lng : location.lng
            }`
          : `${origin.coords.lat},${origin.coords.lng}`,
      destination:
        status === "ASSIGNED"
          ? `${origin.coords.lat},${origin.coords.lng}`
          : `${destination.coords.lat},${destination.coords.lng}`,
    });

    setSteps(res.steps);
    const coordinates = [];
    for (let step of res.steps) {
      const stepPoints = polylineTool.decode(step.polyline.points);
      stepPoints.forEach(([lat, lng]) =>
        coordinates.push({ latitude: lat, longitude: lng })
      );
    }
    setLocalPolyline(coordinates);
    setDistance(res.distance);
    setDuration(res.duration);
    setDistanceKm(res.distanceKm);
    setDurationMin(res.durationMin);
  };

  const regions = useMemo(
    () => ({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    }),
    [location]
  );

  const originMarkerCb = useMemo(() => {
    if (!origin.coords) return null;
    return (
      <Marker
        anchor={{ x: 0.5, y: 0.5 }}
        pinColor="green"
        icon={
          <Ionicons
            name="radio-button-on-outline"
            size={20}
            color={"green"}
          ></Ionicons>
        }
        coordinate={{
          latitude: tempLocation?.coords
            ? tempLocation?.coords?.lat
            : origin.coords.lat,
          longitude: tempLocation?.coords
            ? tempLocation?.coords?.lng
            : origin.coords.lng,
        }}
        title={tempLocation.description || origin.description}
        titleVisibility="visible"
      />
    );
  }, [tempLocation, origin.coords]);

  const destMarkerCb = useMemo(() => {
    if (!origin.coords && !destination.coords) return null;
    return (
      <Marker
        pinColor="red"
        icon={
          <Ionicons
            name="radio-button-on-outline"
            size={20}
            color={"red"}
          ></Ionicons>
        }
        anchor={{ x: 0.5, y: 0.5 }}
        coordinate={{
          latitude: tempLocation?.coords
            ? origin.coords.lat
            : destination.coords && destination.coords.lat,
          longitude: tempLocation?.coords
            ? origin.coords.lng
            : destination.coords && destination.coords.lng,
        }}
        title={
          tempLocation?.coords ? origin.description : destination.description
        }
      />
    );
  }, [tempLocation.coords, origin.coords, destination.coords]);

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

  const onRegionChangeCompleteCb = useCallback(
    async (newRegion, isGesture) => {
      if ((!id || id === 0) && isGesture) {
        console.log("Updating location :", id);
        sendMessage({
          event: "onLocationUpdate",
          driverLocation: {
            lat: newRegion.latitude,
            lng: newRegion.longitude,
          },
          details: {
            vehicleType: "car",
            category: "standard",
          },
        });
        setTempLocation({
          description: "You are here",
          coords: { lat: newRegion.latitude, lng: newRegion.longitude },
        });
      }
    },
    [id]
  );

  const recentreCurrentLocation = useCallback(() => {
    mapRef.current?.animateToRegion({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    });
  }, []);

  const toggleDuty = () => {
    const status = dutyStatus === "AVAILABLE" ? "INACTIVE" : "AVAILABLE";
    setDutyStatus(status);
    sendMessage({
      event: "onLocationUpdate",
      details: {
        status,
      },
    });
  };
  return (
    <>
      {showReason && (
        <TextInput
          placeholder="Reason for cancelling"
          placeholderTextColor={"grey"}
          onChangeText={(text) => {
            setReason(text);
          }}
          style={[commonStyles.input, { marginBottom: 10 }]}
        ></TextInput>
      )}

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
          onPress={toggleDuty}
          disabled={status !== null}
        >
          <Ionicons
            color={dutyStatus === "AVAILABLE" ? "green" : "red"}
            name="train"
            size={20}
            style={{ padding: 10 }}
          ></Ionicons>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          ref={mapRef}
          provider="google"
          showsUserLocation={true}
          showsMyLocationButton={false}
          initialRegion={regions}
          onRegionChangeComplete={(newRegion, { isGesture }) =>
            onRegionChangeCompleteCb(newRegion, isGesture)
          }
        >
          {originMarkerCb}
          {destMarkerCb}
          {polyLineCb}
        </MapView>
        <Animated.View
          style={[
            {
              position: "absolute",
              right: 20,
              bottom: 30,
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
              padding: 10,
              alignSelf: "flex-end",
            }}
            onPress={() =>
              navigation.navigate("CarNavigation", { steps: steps })
            }
          >
            <Ionicons
              name="navigate-outline"
              size={22}
              color={"#000"}
              style={{}}
            ></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: "50%",
              padding: 10,
              alignSelf: "flex-end",
            }}
            onPress={recentreCurrentLocation}
          >
            <Ionicons
              name="locate-outline"
              size={22}
              color={"#000"}
              style={{}}
            ></Ionicons>
          </TouchableOpacity>
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
        </Animated.View>
      </View>
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
            <View style={commonStyles.row}>
              {status && (
                <Text style={{ fontSize: 22, marginBottom: 5 }}>
                  Status: {status} - {id}
                </Text>
              )}
            </View>

            <View style={commonStyles.column}>
              {status === "ASSIGNED" && localPolyline?.length > 0 && (
                <TouchableOpacity
                  style={commonStyles.button}
                  onPress={() => {
                    handleToPickup("ARRIVED");
                  }}
                >
                  <Text style={commonStyles.buttonText}>Reached Pickup</Text>
                </TouchableOpacity>
              )}
              {status === "ARRIVED" && (
                <TouchableOpacity
                  style={[commonStyles.button, { backgroundColor: "green" }]}
                  onPress={() => {
                    handleStart();
                  }}
                >
                  <Text style={commonStyles.buttonText}>Start Ride</Text>
                </TouchableOpacity>
              )}
              {status === "ONGOING" && (
                <TouchableOpacity
                  style={[commonStyles.button, { backgroundColor: "red" }]}
                  onPress={() => {
                    handleComplete();
                  }}
                >
                  <Text style={commonStyles.buttonText}>Complete Ride</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        {bottomView === "CHAT" && <ChatScreen></ChatScreen>}
      </BottomPanel>
    </>
  );
}
