import AuthContext from "@/app/context/AuthContext";
import { LocationContext } from "@/app/context/LocationContext";
import { setupNotificationListeners } from "@/app/service/notificationService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Alert, StyleSheet, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import WebSocketService from "../../../scripts/WebSocketService";

export default function DriverHome() {
  const [originCoord, setOriginCoord] = useState({});
  const [destCoord, setDestCoord] = useState({});
  const [polyline, setPolyline] = useState([]);

  const { location } = useContext(LocationContext);
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();

  const [dutyStatus, setDutyStatus] = useState("AVAILABLE");
  const responseListener = useRef();

  useEffect(() => {
    WebSocketService.connect(token);
    WebSocketService.addListener(handleMessage);
    setupNotificationListeners();

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User tapped notification:", response);

        const rideData = response.notification.request.content.data;

        navigation.navigate(rideData?.screen, { rideId: rideData.rideId });
      });

    return () => {
      if (responseListener.current) responseListener.current.remove();
      WebSocketService.removeListener(handleMessage);
    };
  }, []);

  const handleMessage = (msg) => {
    console.log("📨 Message from server:", msg);
    // const parsed = JSON.parse(msg);
    // Alert.alert(
    //   parsed.message,
    //   `Total distance : ${parsed.distance} Estimated Fare ${parsed.fare}`
    // );
  };

  useLayoutEffect(() => {
    const toggleDuty = () => {
      setDutyStatus(dutyStatus === "AVAILABLE" ? "INACTIVE" : "AVAILABLE");
      Alert.alert(`Driver is now ${dutyStatus}`);
    };

    navigation.setOptions({
      headerRight: () => (
        <>
          <Text>{dutyStatus}</Text>
          <Ionicons
            style={{ marginRight: 20 }}
            onPress={toggleDuty}
            color={dutyStatus === "AVAILABLE" ? "green" : "red"}
            name="clipboard-outline"
            size={24}
          ></Ionicons>
        </>
      ),
    });
  }, [navigation, dutyStatus]);

  return (
    <>
      <MapView
        style={StyleSheet.absoluteFill}
        showsUserLocation={true}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onRegionChangeComplete={(newRegion) => {
          WebSocketService.send({
            event: "onLocationUpdate",
            message: "Driver ping",
            driverLocation: {
              lat: newRegion.latitude,
              lng: newRegion.longitude,
            },
            driverStatus: dutyStatus,
          });
        }}
      >
        {originCoord.lat && (
          <Marker
            coordinate={{
              latitude: originCoord.lat,
              longitude: originCoord.lng,
            }}
            title="Origin"
          />
        )}
        {destCoord.lat && (
          <Marker
            coordinate={{ latitude: destCoord.lat, longitude: destCoord.lng }}
            title="Destination"
          />
        )}
        {polyline.length > 0 && (
          <Polyline
            coordinates={polyline}
            strokeWidth={5}
            strokeColor="blue"
            geodesic={true}
          />
        )}
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
});
