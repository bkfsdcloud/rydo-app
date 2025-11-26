import BottomPanel from "@/app/component/BottomPanel";
import RatingComponent from "@/app/component/RatingComponent";
import TouchableButton from "@/app/component/TouchableButton";
import { LocationContext } from "@/app/context/LocationContext";
import SocketContext from "@/app/context/SocketContext";
import { handleGetRoute } from "@/scripts/api/geoApi";
import { allTransactions } from "@/scripts/api/miscApi";
import { activeRide, available } from "@/scripts/api/riderApi";
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
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import SearchingModal from "../../component/SearchingModal";
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
    setDistanceKm,
    setDurationMin,
    setFares,
    setTransportMode,
    setPolyline,
    resetRide,
    riderId,
    setRiderId,
    driverId,
    setDriverId,
    paymentMethod,
    setPaymentMethod,
    setCommissionAmount,
    setCategory,
    setFare,
    setDriverEarning,
  } = useRideStore();
  const [localPolyline, setLocalPolyline] = useState([]);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);
  const sheetRef = useRef(null);
  const [closablePan, setClosablePan] = useState(false);
  const [panelTitle, setPanelTitle] = useState("");
  const [bottomView, setBottomView] = useState("DEFAULT");
  const [wallet, setWallet] = useState({
    balance: 0,
    walletId: 0,
    transactions: [],
  });

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

  const fetchWallet = async () => {
    setLoading(true);
    const transactions = await allTransactions({ skipGlobalLoader: true });
    setLoading(false);
    if (transactions.data) {
      setWallet(transactions.data);
    }
  };

  const setDefault = useCallback(() => {
    setBottomView("DEFAULT");
    setClosablePan(false);
    setPanelTitle("");
    sheetRef.current?.expand();
  }, []);

  useEffect(() => {
    if (!localPolyline?.length) {
      handleRoute();
    }
  }, [id, localPolyline]);

  useEffect(() => {
    console.log("status", status);
    addListener(handleMessage);
    return () => {
      removeListener(handleMessage);
    };
  }, []);

  const handleMessage = useCallback((parsed) => {
    if (parsed?.event === "sendMessage") return;
    console.log("📨 Notification from the driver:", parsed);
    if (parsed?.data) {
      setId(parsed?.data?.id);
      setStatus(parsed?.data?.status);
      if (parsed?.data?.riderId) {
        setRiderId(parsed?.data?.riderId);
      }
      if (parsed?.data?.driverId) {
        setDriverId(parsed?.data?.driverId);
      }
      Alert.alert("Information", parsed?.message);
      if (parsed?.data?.status === "COMPLETED") {
        setBottomView("RATE");
        setClosablePan(true);
        setPanelTitle("Rate Your Ride");
        sheetRef.current?.expand();
      }
    } else {
      // resetRide();
      Alert.alert("Information", parsed?.message);
    }
  }, []);

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
    if (res.fares && Object.keys(res.fares).length > 0) {
      const entries = Object.entries(res.fares || {});
      const [firstItem, firstValue] = entries[0];
      const { fare, commissionAmount, driverEarning } = firstValue;
      setCategory(firstItem);
      setFare(fare);
      setPaymentMethod("Cash");
      setCommissionAmount(commissionAmount);
      setDriverEarning(driverEarning);
    }
  };

  const originMarkerCb = useMemo(() => {
    if (!origin.coords && !location) return null;
    return (
      <Marker
        anchor={{ x: 0.5, y: 0.5 }}
        pinColor="green"
        coordinate={{
          latitude: (origin.coords && origin.coords.lat) || location.lat,
          longitude: (origin.coords && origin.coords.lng) || location.lng,
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
    [origin.coords, location]
  );

  return (
    <View style={styles.container}>
      <SearchingModal></SearchingModal>
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
        title={panelTitle}
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
              onShowBottomPanel={(view) => {
                fetchWallet();
                setBottomView(view);
                setPanelTitle("Payment Method");
              }}
              onBooking={() => {}}
            />
          </View>
        )}
        {bottomView === "CHAT" && <ChatScreen></ChatScreen>}
        {bottomView === "RATE" && (
          <RatingComponent
            rideId={id}
            riderId={riderId}
            driverId={driverId}
            onClose={setDefault}
          ></RatingComponent>
        )}
        {bottomView === "PAYMENT_METHOD" && (
          <View>
            <Text style={styles.sectionLabel}>WALLETS</Text>
            <TouchableOpacity
              style={[
                commonStyles.card,
                commonStyles.cardBorder,
                styles.customCard,
              ]}
              disabled={wallet.balance === 0}
              onPress={() => setPaymentMethod("Wallet")}
            >
              <View style={commonStyles.cardLeft}>
                <View
                  style={[
                    commonStyles.iconBg,
                    { backgroundColor: "#eef2f5ff" },
                  ]}
                >
                  {loading && <ActivityIndicator size="small" color={"red"} />}
                  {!loading && (
                    <Text style={styles.icon}>
                      <Ionicons
                        name={"wallet-outline"}
                        size={20}
                        color={"#f7312aff"}
                      />
                    </Text>
                  )}
                </View>
                <View style={[commonStyles.cardText, { flexDirection: "row" }]}>
                  <Text style={commonStyles.cardTitle}>Wallet</Text>
                  <Text style={[commonStyles.cardSubtitle, { marginLeft: 5 }]}>
                    ( Balance : ₹{wallet.balance.toFixed(2)} )
                  </Text>
                </View>
              </View>
              <View>
                <Ionicons
                  name={
                    paymentMethod === "Wallet"
                      ? "radio-button-on-outline"
                      : "ellipse-outline"
                  }
                  size={20}
                  color={"#333"}
                />
              </View>
            </TouchableOpacity>
            <Text style={commonStyles.sectionLabel}>OTHER PAYMENTS</Text>
            <TouchableButton
              style={[
                commonStyles.card,
                commonStyles.cardBorder,
                styles.customCard,
              ]}
              onPress={() => setPaymentMethod("Cash")}
            >
              <View style={commonStyles.cardLeft}>
                <View
                  style={[
                    commonStyles.iconBg,
                    { backgroundColor: "#eef2f5ff" },
                  ]}
                >
                  <Ionicons name={"cash-outline"} size={20} color={"orange"} />
                </View>
                <View style={commonStyles.cardText}>
                  <Text style={commonStyles.cardTitle}>Cash</Text>
                </View>
              </View>
              <View>
                <Ionicons
                  name={
                    paymentMethod === "Cash"
                      ? "radio-button-on-outline"
                      : "ellipse-outline"
                  }
                  size={20}
                  color={"#333"}
                />
              </View>
            </TouchableButton>
            <TouchableButton
              style={[
                commonStyles.card,
                commonStyles.cardBorder,
                styles.customCard,
              ]}
              onPress={() => setPaymentMethod("UPI")}
            >
              <View style={commonStyles.cardLeft}>
                <View
                  style={[
                    commonStyles.iconBg,
                    { backgroundColor: "#eef2f5ff" },
                  ]}
                >
                  <Ionicons name={"qr-code-outline"} size={20} color={"#333"} />
                </View>
                <View style={commonStyles.cardText}>
                  <Text style={commonStyles.cardTitle}>UPI</Text>
                </View>
              </View>
              <View>
                <Ionicons
                  name={
                    paymentMethod === "UPI"
                      ? "radio-button-on-outline"
                      : "ellipse-outline"
                  }
                  size={20}
                  color={"#333"}
                />
              </View>
            </TouchableButton>
            <TouchableButton
              onPress={setDefault}
              style={[commonStyles.button, { backgroundColor: "#000" }]}
            >
              <Text style={commonStyles.buttonText}>Done</Text>
            </TouchableButton>
          </View>
        )}
      </BottomPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  customCard: { paddingVertical: 5 },
});
