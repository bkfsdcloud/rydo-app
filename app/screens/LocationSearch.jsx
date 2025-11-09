import { getCoords, handleAutocomplete } from "@/scripts/api/geoApi";
import { commonStyles } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getRecentSearches, saveSearch } from "../../scripts/searchStorage";
import { useRideStore } from "../store/useRideStore";

export default function LocationSearch() {
  const navigation = useNavigation();
  const route = useRoute();

  const { setLocation } = useRideStore();

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestionDropdown, setShowSuggestionDropdown] = useState(false);

  const locationDebounce = useRef(null);
  const [searchFor] = useState(route?.params?.searchFor || null);

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    loadSearches();
  }, []);

  const loadSearches = async () => {
    const data = await getRecentSearches();
    setRecent(data);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.title || "Choose Pick Up Location",
    });
  }, [route.params?.title]);

  return (
    <View style={styles.container}>
      <TextInput
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        clearButtonMode="while-editing"
        onChangeText={(text) => {
          setShowSuggestionDropdown(false);
          if (locationDebounce.current) clearTimeout(locationDebounce.current);
          locationDebounce.current = setTimeout(async () => {
            if (!text) return;
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
        placeholder="Search or Select Location"
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
                  if (item?.description) {
                    await saveSearch({
                      description: item?.description.trim(),
                      place_id: item?.place_id.trim(),
                      secondaryText: item?.secondaryText.trim(),
                    });
                    loadSearches();
                  }
                  console.log("item: ", item);
                  setLocation(searchFor, { ...item, coords });
                  navigation.navigate({
                    name: "RiderHome",
                  });
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
      <View>
        <Text style={styles.title}>Recently Used</Text>
        <FlatList
          data={recent}
          keyExtractor={(item) => item.place_id}
          style={commonStyles.dropdownRecent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={commonStyles.dropdownPanelRecent}>
              <Ionicons
                name="location"
                size={20}
                style={styles.dropdownIcon}
                color="#666"
              />
              <TouchableOpacity
                onPress={async () => {
                  const coords = await getCoords({ placeId: item.place_id });

                  setLocation(searchFor, { ...item, coords });
                  navigation.navigate({
                    name: "RiderHome",
                  });
                }}
                style={styles.item}
              >
                <Text numberOfLines={1} style={styles.subtitle}>
                  {item.description}
                </Text>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{ fontSize: 12 }}
                ></Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <View style={styles.bottomCard}>
        <Text style={styles.title}>Not able to find the location</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate(
              "LocationPick",
              {
                searchFor,
              },
              { merge: true }
            );
          }}
        >
          <Text style={styles.buttonText}>Pick location from map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
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
    top: 50,
    width: "100%",
    maxHeight: 150,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    zIndex: 1000,
    left: 10,
  },
  item: {
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "90%",
    flexGrow: 1,
  },
  dropdownIcon: {
    padding: 5,
    top: 5,
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
  dropdownPanel: {
    flex: 1,
    flexDirection: "row",
    width: "90%",
    padding: 3,
  },
});
