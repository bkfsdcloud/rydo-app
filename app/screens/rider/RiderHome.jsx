import { handleAutocomplete, handleGetRoute } from "@/scripts/api/geoApi";
import { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import RideSummaryModal from './RideSummaryModal';

export default function MapScreen() {

  const [origin, setOrigin] = useState({place_id:'',description:''});
  const [destination, setDestination] = useState({place_id:'',description:''});
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [distance, setDistance] = useState(null);
  const [fare, setFare] = useState(null);

  const [originCoord, setOriginCoord] = useState({ lat: 12.9716, lng: 77.5946 });
  const [destCoord, setDestCoord] = useState({ lat: 12.9716, lng: 77.5946 });
  const [polyline, setPolyline] = useState([]);

  const originDebounce = useRef(null);
  const destDebounce = useRef(null);
  
  const [showModal, setShowModal] = useState(false);
  const [transportMode, setTransportMode] = useState('Car');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const handleSelectOrigin = (item) => {
    setOrigin(item);
    setShowOriginDropdown(false);
    setOriginCoord(item.location || originCoord);
  };

  const handleSelectDestination = (item) => {
    setDestination(item);
    setShowDestDropdown(false);
    setDestCoord(item.location || destCoord);
  };

  const handleRoute = async () => {
    if (!origin.place_id || !destination.place_id) return;
    const res = await handleGetRoute({ originPlaceId: origin.place_id, destPlaceId: destination.place_id });
    setPolyline(res.data.coordinates);
    setOriginCoord(res.data.originCoord);
    setDestCoord(res.data.destCoord);
    setFare(res.data.fare);
    setDistance(res.data.distanceTxt);
    setTimeout(() => setShowModal(true), 1000);
  };

  const handleBookRide = () => {
    setShowModal(false);
    console.log('Ride Booked with', { transportMode, paymentMethod });
    // call your backend API here
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: originCoord.lat,
            longitude: originCoord.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker coordinate={{ latitude: originCoord.lat, longitude: originCoord.lng }} title="Origin" />
          <Marker coordinate={{ latitude: destCoord.lat, longitude: destCoord.lng }} title="Destination" />
          {polyline.length > 0 && <Polyline coordinates={polyline} strokeWidth={5} strokeColor="blue" />}
        </MapView>

      <RideSummaryModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleBookRide}
        distance={distance}
        fare={fare}
        transportMode={transportMode}
        setTransportMode={setTransportMode}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

        {/* Overlay UI */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={StyleSheet.absoluteFill}
          pointerEvents="box-none"
        >
          <View style={styles.overlayContainer}>
            {/* {distance && (
              <Text style={styles.info}>
                Distance: {distance.distanceTxt} | Duration: {distance.durationMins}
              </Text>
            )}

            {fare && (
              <Text style={styles.info}>
                Estimated Fare: ₹{fare.fare.toFixed(2)} for {fare.distanceKm.toFixed(2)} km
              </Text>
            )} */}

            <View style={styles.inputContainer}>
              <TextInput
                value={origin.description}
                onChangeText={(text) => {
                  setOrigin({description: text});
                  if (originDebounce.current) clearTimeout(originDebounce.current);
                    originDebounce.current = setTimeout(async () => {
                      if (text.length < 2) return setOriginSuggestions([]);
                      try {
                        const res = await handleAutocomplete({ input: text, sessionToken: "123" });
                        setOriginSuggestions(res || []);
                        setShowOriginDropdown(true);
                      } catch {
                        setOriginSuggestions([]);
                        setShowOriginDropdown(false);
                      }
                    }, 1000); // 500ms debounce
                }}
                placeholder="Enter Origin"
                style={styles.input}
              />
              {showOriginDropdown && (
                <FlatList
                  data={originSuggestions}
                  keyExtractor={(item) => item.place_id}
                  style={styles.dropdown}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelectOrigin(item)} style={styles.item}>
                      <Text>{item.description}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                value={destination.description}
                onChangeText={(text) => {
                  setDestination({description: text});
                  if (destDebounce.current) clearTimeout(destDebounce.current);
                    destDebounce.current = setTimeout(async () => {
                      if (text.length < 2) return setDestSuggestions([]);
                      try {
                        const res = await handleAutocomplete({ input: text, sessionToken: "123" });
                        setDestSuggestions(res || []);
                        setShowDestDropdown(true);
                      } catch {
                        setDestSuggestions([]);
                        setShowDestDropdown(false);
                      }
                    }, 1000);
                }}
                placeholder="Enter Destination"
                style={styles.input}
              />
              {showDestDropdown && (
                <FlatList
                  data={destSuggestions}
                  keyExtractor={(item) => item.place_id}
                  style={styles.dropdown}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelectDestination(item)} style={styles.item}>
                      <Text>{item.description}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
            <TouchableOpacity
        style={{
          alignSelf: 'center',
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 10,
        }}
        onPress={() => handleRoute()}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Search Ride</Text>
      </TouchableOpacity>
            
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
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
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
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
});
