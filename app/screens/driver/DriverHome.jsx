import AuthContext from "@/app/context/AuthContext";
import { LocationContext } from "@/app/context/LocationContext";
import { setupNotificationListeners } from "@/app/service/notificationService";
import { commonStyles } from "@/scripts/constants";
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
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import WebSocketService from "../../../scripts/WebSocketService";
import CommonAlert from "../../component/CommonAlert";

export default function DriverHome() {
  const [originCoord, setOriginCoord] = useState({});
  const [destCoord, setDestCoord] = useState({});
  const [polyline, setPolyline] = useState([]);

  const { location } = useContext(LocationContext);
  const { token, user } = useContext(AuthContext);
  const navigation = useNavigation();

  const [dutyStatus, setDutyStatus] = useState("AVAILABLE");
  const responseListener = useRef();

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
  });

  const handleConfirm = () => {
    console.log("User confirmed!");
    setShowAlert(false);
  };

  const handleCancel = () => {
    console.log("User cancelled!");
    setShowAlert(false);
  };

  useEffect(() => {
    WebSocketService.connect(token, {
      event: "onLocationUpdate",
      driverLocation: {
        lat: location.latitude,
        lng: location.longitude,
      },
      details: {
        status: dutyStatus,
        vehicleType: "car",
        category: "standard",
      },
    });
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
    const parsed = typeof msg == "string" ? JSON.parse(msg) : msg;
    console.log("📨 Message from server:", parsed);
    setAlertData({
      title: parsed.message,
      message: `Total distance : ${parsed.data?.distanceKm} Estimated Fare ${parsed.data?.fareEstimated}`,
    });
    setShowAlert(true);
  };

  useLayoutEffect(() => {
    const toggleDuty = () => {
      const status = dutyStatus === "AVAILABLE" ? "INACTIVE" : "AVAILABLE";
      setDutyStatus(status);
      WebSocketService.send({
        event: "onLocationUpdate",
        details: {
          status,
        },
      });
      // Alert.alert(`Driver is now ${dutyStatus}`);
    };

    navigation.setOptions({
      headerRight: () => (
        <>
          {/* <Text>{dutyStatus}</Text> */}
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
      <CommonAlert
        visible={showAlert}
        title={alertData.title}
        message={alertData.message}
        leftButtonTitle="Decline"
        rightButtonTitle="Accept"
        onLeftPress={handleCancel}
        onRightPress={handleConfirm}
      />

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
          console.log("Driver location changed");
          WebSocketService.send({
            event: "onLocationUpdate",
            driverLocation: {
              lat: newRegion.latitude,
              lng: newRegion.longitude,
            },
            details: {
              status: dutyStatus,
              vehicleType: "car",
              category: "standard",
            },
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
