import {
  getAddress,
  getCoords,
  handleAutocomplete,
} from "@/scripts/api/geoApi";
import { ORIGIN } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView from "react-native-maps";
import LocationContext from "../context/LocationContext";
import { useRideStore } from "../store/useRideStore";

export default function LocationPick() {
  const navigation = useNavigation();
  const route = useRoute();
  const { location } = useContext(LocationContext);

  const { origin, destination, setLocation } = useRideStore();

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestionDropdown, setShowSuggestionDropdown] = useState(false);

  const locationDebounce = useRef(null);
  const searchBox = useRef(null);
  const [searchFor] = useState(route?.params?.searchFor || null);
  const mapRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  async function updateMapLocation(newLocation) {
    const newCoords = {
      lat: newLocation?.latitude || location.latitude,
      lng: newLocation?.longitude || location.longitude,
    };
    const response = await getAddress(newCoords);
    setLocation(searchFor, { ...response, coords: newCoords });
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        paddingAdjustmentBehavior="automatic"
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onMapReady={() => {
          updateMapLocation();
        }}
        onRegionChangeComplete={async (newRegion) => {
          if (!isAnimating) updateMapLocation(newRegion);
        }}
      ></MapView>
      <View style={styles.markerFixed}>
        <Ionicons name="location-sharp" size={40} color="#E53935" />
      </View>
      <View style={styles.overlayContainer}>
        <TextInput
          ref={searchBox}
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
          autoFocus={false}
          clearButtonMode="while-editing"
          onChangeText={(text) => {
            setShowSuggestionDropdown(false);
            if (locationDebounce.current)
              clearTimeout(locationDebounce.current);
            locationDebounce.current = setTimeout(async () => {
              if (text.length < 2) return setSuggestions([]);
              try {
                const res = await handleAutocomplete({
                  input: text,
                });
                setSuggestions(res || []);
                setShowSuggestionDropdown(true);
              } catch {
                setSuggestions([]);
                setShowSuggestionDropdown(false);
              }
            }, 1000); // 500ms debounce
          }}
          placeholder="Search Address"
          placeholderTextColor={"grey"}
          style={styles.input}
        />
        {showSuggestionDropdown && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            style={styles.dropdown}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <View style={styles.dropdownPanel}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  style={styles.dropdownIcon}
                  color="#666"
                />
                <TouchableOpacity
                  onPress={async () => {
                    setShowSuggestionDropdown(false);

                    const coords = await getCoords({ placeId: item.place_id });
                    setLocation(searchFor, { ...item, coords });

                    setIsAnimating(true);
                    mapRef.current?.animateToRegion({
                      latitude: coords.lat,
                      longitude: coords.lng,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    });
                    setTimeout(() => setIsAnimating(false), 1000);

                    searchBox.current.clear();
                  }}
                  style={styles.item}
                >
                  <Text numberOfLines={1} style={{ fontSize: 14 }}>
                    {item.description}
                  </Text>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{ fontSize: 12 }}
                  >
                    {item.secondaryText}
                  </Text>
                </TouchableOpacity>
                <Ionicons
                  name="heart-outline"
                  size={20}
                  style={styles.dropdownIcon}
                  color="#666"
                />
              </View>
            )}
          />
        )}
      </View>
      <View style={styles.bottomCard}>
        <TextInput
          value={
            searchFor === ORIGIN ? origin.description : destination.description
          }
          placeholder="Enter Origin"
          style={styles.input}
          placeholderTextColor={"grey"}
          editable={false}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate({
              name: "RiderHome",
            });
          }}
        >
          <Text style={styles.buttonText}>Confirm location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlayContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    zIndex: 999,
  },
  map: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  dropdown: {
    position: "absolute",
    top: 40,
    width: "100%",
    maxHeight: 150,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    zIndex: 1000,
  },
  item: {
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "90%",
    flexGrow: 1,
  },
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20, // half icon width
    marginTop: -40, // half icon height
    zIndex: 10,
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
    paddingTop: 5,
  },
  subtitle: {
    color: "#777",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#007BFF",
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  dropdownIcon: {
    padding: 5,
    top: 5,
  },
  dropdownPanel: {
    flex: 1,
    flexDirection: "row",
    width: "90%",
    padding: 3,
  },
});
