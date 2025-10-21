import AuthContext from "@/app/context/AuthContext";
import { LocationContext } from "@/app/context/LocationContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
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

  useEffect(() => {
    WebSocketService.connect(token);
    WebSocketService.addListener(handleMessage);
  }, [token]);

  const handleMessage = (msg) => {
    console.log("📨 Message from server:", msg);
    Alert.alert("Notification", msg);
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
        // region={{
        //   latitude: originCoord.lat || location.latitude,
        //   longitude: originCoord.lng || location.longitude,
        //   latitudeDelta: destCoord.lat || 0.05,
        //   longitudeDelta: destCoord.lng || 0.05,
        // }}
        onRegionChangeComplete={(newRegion) => {
          WebSocketService.send({
            action: "track",
            coordinate: { lat: newRegion.latitude, lng: newRegion.longitude },
            status: dutyStatus,
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
          <Polyline coordinates={polyline} strokeWidth={5} strokeColor="blue" />
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
