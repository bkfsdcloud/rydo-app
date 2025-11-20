import {
  getAddress,
  getCoords,
  handleAutocomplete,
} from "@/scripts/api/geoApi";
import { commonStyles, ORIGIN } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";
import { allFavourites, markFavourite } from "../../scripts/api/miscApi";
import BottomPanel from "../component/BottomPanel";
import LocationInput from "../component/LocationInput";
import SuggestionList from "../component/SuggestionList";
import LocationContext from "../context/LocationContext";
import { useRideStore } from "../store/useRideStore";
import useUserStore from "../store/useUserStore";

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

  const [refObj, setRefObj] = useState(null);
  const [bottomView, setBottomView] = useState("DEFAULT");
  const favNameRef = useRef(null);
  const sheetRef = useRef(null);
  const { setFavourites } = useUserStore();

  useEffect(() => {
    return () => clearTimeout(locationDebounce.current);
  }, []);

  const region = useMemo(
    () => ({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    }),
    []
  );

  const recentreCurrentLocation = useCallback(() => {
    mapRef.current?.animateToRegion({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    });
  }, []);

  async function updateMapLocation(newLocation) {
    const newCoords = {
      lat: newLocation?.latitude || location.lat,
      lng: newLocation?.longitude || location.lng,
    };
    const response = await getAddress(newCoords);
    setLocation(searchFor, { ...response, coords: newCoords });
  }

  const onSearch = useCallback(async (text) => {
    setShowSuggestionDropdown(false);

    if (!text) {
      setSuggestions([]);
      return;
    }
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
  }, []);

  const handleSelectRecent = async (item) => {
    setShowSuggestionDropdown(false);

    const coords = await getCoords({ placeId: item.place_id });
    setLocation(searchFor, { ...item, coords });

    setIsAnimating(true);
    mapRef.current?.animateToRegion({
      latitude: coords.lat,
      longitude: coords.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    });
    setTimeout(() => setIsAnimating(false), 1000);
    searchBox.current.clear();
  };

  const addFavourite = (data) => {
    const favObjData = data
      ? data
      : searchFor === ORIGIN
      ? origin
      : destination;
    setRefObj(favObjData);
    setBottomView("FAV");
    sheetRef.current?.expand();
  };

  return (
    <View style={styles.container}>
      <View style={{ padding: 10, backgroundColor: "#fff" }}>
        <LocationInput
          ref={searchBox}
          placeholder="Search Address"
          onChangeText={(text) => {
            searchBox.current.value = text;
            if (locationDebounce.current)
              clearTimeout(locationDebounce.current);
            locationDebounce.current = setTimeout(() => {
              onSearch(text);
            }, 1000);
          }}
          iconColor={searchFor === ORIGIN ? "green" : "red"}
          style={{ backgroundColor: "#f0f0f0ff" }}
          placeholderTextColor={"black"}
        />
        {showSuggestionDropdown && (
          <SuggestionList
            search={searchBox.current?.value}
            suggestions={suggestions}
            showSuggestionDropdown={showSuggestionDropdown}
            setShowSuggestionDropdown={setShowSuggestionDropdown}
            handleSelectRecent={handleSelectRecent}
            onAddFavourite={addFavourite}
          />
        )}
      </View>
      <View style={[styles.container]}>
        <MapView
          ref={mapRef}
          paddingAdjustmentBehavior="automatic"
          provider="google"
          showsMyLocationButton={false}
          style={styles.map}
          region={region}
          onRegionChangeComplete={async (newRegion) => {
            if (!isAnimating) updateMapLocation(newRegion);
          }}
        ></MapView>
        <View style={commonStyles.markerFixed}>
          <Ionicons name="pin-outline" size={40} color="#E53935" />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            borderRadius: "50%",
            position: "absolute",
            padding: 8,
            bottom: 180,
            right: 10,
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
      </View>

      <BottomPanel>
        {bottomView === "DEFAULT" && (
          <View style={[commonStyles.column]}>
            <LocationInput
              value={
                searchFor === ORIGIN
                  ? `${origin.description} ${origin.secondaryText}`
                  : `${destination.description} ${destination.secondaryText}`
              }
              placeholder="Enter Origin"
              showIcon={false}
              placeholderTextColor={"grey"}
              favIcon={true}
            />
            <TouchableOpacity
              style={commonStyles.button}
              onPress={() => {
                navigation.replace("RiderHome");
              }}
            >
              <Text style={commonStyles.buttonText}>Confirm location</Text>
            </TouchableOpacity>
          </View>
        )}
        {bottomView === "FAV" && (
          <View style={commonStyles.column}>
            <LocationInput
              showIcon={false}
              placeholder="Name"
              placeholderTextColor={"grey"}
              ref={favNameRef}
              onChangeText={(text) => {
                favNameRef.current.value = text;
              }}
              onAddFavourite={addFavourite}
            />

            <TouchableOpacity
              style={commonStyles.button}
              onPress={async () => {
                await markFavourite({
                  placeId: refObj?.place_id,
                  description: refObj?.description,
                  secondaryText: refObj?.secondaryText,
                  name: favNameRef.current.value,
                  latitude: refObj?.coords.lat,
                  longitude: refObj?.coords.lng,
                });
                setRefObj(null);
                setBottomView("DEFAULT");
                sheetRef.current?.expand();
                const resp = await allFavourites();
                setFavourites(resp.data);
              }}
            >
              <Text style={commonStyles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </BottomPanel>
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
