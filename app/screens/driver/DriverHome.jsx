import AuthContext from "@/app/context/AuthContext";
import { LocationContext } from "@/app/context/LocationContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import WebSocketService from "../../../scripts/WebSocketService";
// import WebSocketTest from "../../component/webSocketTest";

export default function DriverHome() {
  const [originCoord, setOriginCoord] = useState({});
  const [destCoord, setDestCoord] = useState({});
  const [polyline, setPolyline] = useState([]);

  const { location, refresh } = useContext(LocationContext);
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();

  const [onDuty, setOnDuty] = useState(false);

  const toggleDuty = () => {
    setOnDuty((prev) => !prev);
    Alert.alert(`Driver is now ${!onDuty ? "On Duty" : "Off Duty"}`);
  };

  useEffect(() => {
    WebSocketService.connect(token);
    WebSocketService.send({
      action: "init",
      coordinate: { lat: location?.latitude, lng: location?.longitude },
      message: "Driver logged in",
      online: onDuty,
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          style={{ marginRight: 20 }}
          onPress={toggleDuty}
          color={onDuty ? "green" : "red"}
          name="airplane-outline"
          size={24}
        ></Ionicons>
      ),
    });
  }, [navigation, onDuty]);

  return (
    <>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Driver is currently {onDuty ? "On Duty" : "Off Duty"}</Text>
      </View>
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
        onRegionChangeComplete={(newRegion, details) => {
          // console.log(onDuty);
          // console.log({ lat: newRegion.latitude, lng: newRegion.longitude });
          WebSocketService.send({
            action: "track",
            coordinate: { lat: newRegion.latitude, lng: newRegion.longitude },
            online: onDuty,
          });
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Origin"
        />
        <Marker
          coordinate={{
            latitude: destCoord.lat || 0.05,
            longitude: destCoord.lng || 0.05,
          }}
          title="Destination"
        />
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
