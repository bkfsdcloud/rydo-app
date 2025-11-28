import CancelComponent from "@/app/component/CancelComponent";
import RatingComponent from "@/app/component/RatingComponent";

import { useAlert } from "@/app/context/AlertContext";
import AuthContext from "@/app/context/AuthContext";
import useUserStore from "@/app/store/useUserStore";
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
import { Alert, Text, TouchableOpacity, View } from "react-native";
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
import LocationContext from "../../context/LocationContext";
import SocketContext from "../../context/SocketContext";
import { useRideStore } from "../../store/useRideStore";
import ChatScreen from "../profile/ChatScreen";

export default function DriverHome() {
  const { location } = useContext(LocationContext);
  const { user } = useContext(AuthContext);
  const { sendMessage, addListener, removeListener } =
    useContext(SocketContext);

  const navigation = useNavigation();
  const {
    id,
    origin,
    setOrigin,
    destination,
    setDestination,
    distance,
    setDistance,
    setDuration,
    fare,
    setDistanceKm,
    setDurationMin,
    status,
    setStatus,
    resetRide,
    setId,
    driverEarning,
    riderId,
    setRiderId,
    driverId,
    setDriverId,
  } = useRideStore();

  const { setDriverStatus } = useUserStore();

  const [dutyStatus, setDutyStatus] = useState("ACTIVE");
  const mapRef = useRef(null);
  const [localPolyline, setLocalPolyline] = useState([]);
  const [steps, setSteps] = useState([]);
  const { showAlert } = useAlert();
  const [showCancelTab, setShowCancelTab] = useState(false);

  const sheetRef = useRef(null);
  const [closablePan, setClosablePan] = useState(false);
  const [bottomView, setBottomView] = useState("DEFAULT");
  const [panelTitle, setPanelTitle] = useState("");

  const statusRef = useRef(null);
  const tempLocation = useRef(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);

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

  useEffect(() => {
    if (statusRef.current) return;
    if (status === "PENDING") {
      showAlert({
        title: "Ride Request!",
        message: `Distance : ${distance}km Estimated Fare ₹${fare} Earnings: ₹${driverEarning}`,
        leftText: "Reject",
        rightText: "Accept",
        onLeft: handleReject,
        onRight: handleConfirm,
      });
    } else if (status === "ASSIGNED" && localPolyline?.length === 0) {
      setRoutePositions();
      handleRoute(status);
    } else if (status === "ONGOING" && !localPolyline?.length) {
      setRoutePositions();
      tempLocation.current = null;
      handleRoute(status);
    }
    statusRef.current = status;
  }, [status]);

  const setDefault = () => {
    setBottomView("DEFAULT");
    setClosablePan(false);
    setPanelTitle("");
    sheetRef.current?.expand();
  };

  const handleConfirm = useCallback(
    async (rideInfo) => {
      const res = await updateStatus({
        rideData: { id: rideInfo?.id || id, status: "ACCEPTED" },
      });

      if (res?.data) {
        setStatus(res?.data.status);
        console.log("rideInfo: ", rideInfo);
        setRoutePositions(rideInfo);
        handleRoute(res?.data.status);
      } else if (res?.message) {
        Alert.alert("Info", res?.message);
      }
    },
    [id, origin, destination]
  );

  const resetRef = () => {
    tempLocation.current = null;
    originRef.current = null;
    destinationRef.current = null;
  };

  const setRoutePositions = (rideInfo) => {
    tempLocation.current = tempLocation.current || {
      description: "You are here",
      coords: { lat: location.lat, lng: location.lng },
    };
    if (rideInfo) {
      originRef.current = {
        description: rideInfo?.pickupLocation,
        coords: {
          lat: rideInfo?.pickupLat,
          lng: rideInfo?.pickupLng,
        },
      };
      destinationRef.current = {
        description: rideInfo?.dropLocation,
        coords: {
          lat: rideInfo?.dropLat,
          lng: rideInfo?.dropLng,
        },
      };
    } else {
      originRef.current = origin;
      destinationRef.current = destination;
    }
  };

  const handleReject = useCallback(async (rideInfo) => {
    setShowCancelTab(true);
    setId(rideInfo?.id);
  }, []);

  const handleToPickup = useCallback(
    async (status) => {
      if (status) {
        await updateStatus({
          rideData: { id: id, status: status },
        });
        setStatus(status);
        tempLocation.current = null;
      }
    },
    [id]
  );

  const handleStart = useCallback(async () => {
    tempLocation.current = null;
    const res = await updateStatus({
      rideData: { id: id, status: "ONGOING" },
    });
    if (res?.data) {
      setStatus(res?.data.status);
      handleRoute(res?.data.status);
    }
  }, [id]);

  const handleComplete = useCallback(async () => {
    const res = await updateStatus({
      rideData: { id: id, status: "COMPLETED", finalFare: fare },
    });
    if (res?.data) {
      if (res?.data?.riderId) {
        setRiderId(res?.data?.riderId);
      }
      if (res?.data?.driverId) {
        setDriverId(res?.data?.driverId);
      }
      setBottomView("RATE");
      setClosablePan(true);
      setPanelTitle("Rate Your Ride");
      sheetRef.current?.expand();
    }
  }, [id, fare]);

  useEffect(() => {
    addListener(handleMessage);
    return () => {
      removeListener(handleMessage);
    };
  }, []);

  const handleMessage = (parsed) => {
    if (parsed?.event === "sendMessage") return;
    const data = parsed?.data;
    console.log("📨 Notification from the rider:", data);
    if (data) {
      setId(data?.id);
      setStatus(data?.status);
      showAlert({
        title: parsed.message,
        message: `Distance : ${data?.distanceKm} km. Estimated Fare ₹${data?.fareEstimated} Earnings: ₹${data?.driverEarning}`,
        leftText: "Reject",
        rightText: "Accept",
        onLeft: () => handleReject(data),
        onRight: () => handleConfirm(data),
      });
    } else {
      resetRide();
      Alert.alert("Info", parsed?.message);
    }
  };

  const handleRoute = async (status) => {
    console.log("originRef.current: ", originRef.current);
    console.log("tempLocation.current: ", tempLocation.current);
    console.log("destinationRef.current: ", destinationRef.current);
    const res = await handleGetRoute({
      origin: tempLocation.current
        ? `${tempLocation.current?.coords?.lat},${tempLocation.current?.coords?.lng}`
        : `${originRef.current?.coords?.lat},${originRef.current?.coords?.lng}`,
      destination: tempLocation.current
        ? `${originRef.current?.coords?.lat},${originRef.current?.coords?.lng}`
        : `${destinationRef.current?.coords?.lat},${destinationRef.current?.coords?.lng}`,
    });

    setOrigin({ description: res?.start_address, coords: res?.start_coords });
    setDestination({ description: res?.end_address, coords: res?.end_coords });

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

  const handleCancel = useCallback(
    async (ack) => {
      setShowCancelTab(false);
      if (ack) {
        resetRide();
        resetRef();
        setLocalPolyline(null);
      }
    },
    [resetRide]
  );

  const regions = useMemo(
    () => ({
      latitude: tempLocation.current
        ? tempLocation.current.coords?.lat
        : location.lat,
      longitude: tempLocation.current
        ? tempLocation.current.coords?.lng
        : location.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    }),
    [location.lat, location.lng]
  );

  const originMarkerCb = useMemo(() => {
    if (!origin.coords) return null;
    return (
      <Marker
        anchor={{ x: 0.5, y: 0.5 }}
        pinColor="green"
        tracksViewChanges={false}
        coordinate={{
          latitude: origin.coords.lat,
          longitude: origin.coords.lng,
        }}
        title={origin.description}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="radio-button-on-outline" size={20} color="green" />
        </View>
      </Marker>
    );
  }, [origin]);

  const destMarkerCb = useMemo(() => {
    if (!destination.coords) return null;
    return (
      <Marker
        pinColor="red"
        anchor={{ x: 0.5, y: 0.5 }}
        tracksViewChanges={false}
        coordinate={{
          latitude: destination.coords.lat,
          longitude: destination.coords.lng,
        }}
        title={destination.description}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="radio-button-on-outline" size={20} color="red" />
        </View>
      </Marker>
    );
  }, [destination]);

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
            vehicleType: user?.driver?.vehicle?.type,
            category: user?.driver?.vehicle?.category,
            status: dutyStatus,
          },
        });
        tempLocation.current = {
          description: "You are here",
          coords: { lat: newRegion.latitude, lng: newRegion.longitude },
        };
      }
    },
    [id, sendMessage]
  );

  const recentreCurrentLocation = useCallback(() => {
    mapRef.current?.animateToRegion({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    });
  }, [location]);

  const toggleDuty = useCallback(() => {
    const status = dutyStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setDriverStatus(status);
    setDutyStatus(status);
    sendMessage({
      event: "onLocationUpdate",
      details: {
        status,
      },
    });
  }, [dutyStatus, sendMessage]);
  return (
    <>
      <CancelComponent
        visible={showCancelTab}
        onClose={handleCancel}
      ></CancelComponent>
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
            color={dutyStatus === "ACTIVE" ? "green" : "red"}
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
          region={regions}
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
          {steps?.length > 0 && (
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderRadius: "50%",
                padding: 10,
                alignSelf: "flex-end",
              }}
              onPress={() => navigation.navigate("CarNavigation", { steps })}
            >
              <Ionicons
                name="navigate-outline"
                size={22}
                color={"#000"}
                style={{}}
              ></Ionicons>
            </TouchableOpacity>
          )}
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
                setPanelTitle("Chat");
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
        title={panelTitle}
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
                  style={[commonStyles.button, { backgroundColor: "green" }]}
                  onPress={() => {
                    handleToPickup("ARRIVED");
                  }}
                >
                  <Text style={commonStyles.buttonText}>
                    Reached Pickup Point
                  </Text>
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
              {!status && (
                <TouchableOpacity
                  style={[
                    commonStyles.button,
                    {
                      backgroundColor:
                        dutyStatus === "ACTIVE" ? "grey" : "green",
                    },
                  ]}
                  onPress={toggleDuty}
                >
                  <Text style={commonStyles.buttonText}>
                    {dutyStatus === "ACTIVE" ? "Duty Off" : "Duty On"}
                  </Text>
                </TouchableOpacity>
              )}
              {["ASSIGNED", "ARRIVED"].includes(status) && (
                <TouchableOpacity
                  style={[commonStyles.button, { backgroundColor: "red" }]}
                  onPress={() => setShowCancelTab(true)}
                >
                  <Text style={commonStyles.buttonText}>Cancel Ride</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        {bottomView === "CHAT" && <ChatScreen></ChatScreen>}
        {bottomView === "RATE" && (
          <RatingComponent
            rideId={id}
            riderId={riderId}
            driverId={driverId}
            onClose={() => {
              setDefault();
              resetRide();
              setLocalPolyline([]);
            }}
          ></RatingComponent>
        )}
      </BottomPanel>
    </>
  );
}
