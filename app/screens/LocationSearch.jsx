import { getCoords, handleAutocomplete } from "@/scripts/api/geoApi";
import { commonStyles, ORIGIN } from "@/scripts/constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { allFavourites, markFavourite } from "../../scripts/api/miscApi";
import BottomPanel from "../component/BottomPanel";
import LocationInput from "../component/LocationInput";
import SuggestionList from "../component/SuggestionList";
import { useRideStore } from "../store/useRideStore";
import useUserStore from "../store/useUserStore";

export default function LocationSearch() {
  const navigation = useNavigation();
  const route = useRoute();
  const { setLocation } = useRideStore();
  const { setFavourites } = useUserStore();

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestionDropdown, setShowSuggestionDropdown] = useState(false);

  const locationDebounce = useRef(null);
  const [searchFor] = useState(route?.params?.searchFor || null);
  const searchBox = useRef(null);

  const [refObj, setRefObj] = useState(null);
  const [bottomView, setBottomView] = useState("DEFAULT");
  const favNameRef = useRef(null);
  const sheetRef = useRef(null);

  const handleSelectRecent = async (item) => {
    const coords = await getCoords({ placeId: item.place_id });
    setLocation(searchFor, { ...item, coords });
    setTimeout(() => navigation.replace("RiderHome"), 500);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.title || "Choose Pick Up Location",
    });
  }, [route.params?.title]);

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

  const addFavourite = (data) => {
    setRefObj(data);
    setBottomView("FAV");
    sheetRef.current?.expand();
  };

  return (
    <View style={[commonStyles.container, { backgroundColor: "#fff" }]}>
      <LocationInput
        placeholder="Search or Select Location"
        onChangeText={(text) => {
          searchBox.current.value = text;
          if (locationDebounce.current) clearTimeout(locationDebounce.current);
          locationDebounce.current = setTimeout(async () => {
            onSearch(text);
          }, 1000);
        }}
        iconColor={searchFor === ORIGIN ? "green" : "red"}
        style={{ backgroundColor: "#f0f0f0ff" }}
        placeholderTextColor={"black"}
        ref={searchBox}
      />
      <SuggestionList
        search={searchBox.current?.value}
        suggestions={suggestions}
        showSuggestionDropdown={showSuggestionDropdown}
        setShowSuggestionDropdown={setShowSuggestionDropdown}
        handleSelectRecent={handleSelectRecent}
        addFavourite={addFavourite}
      />
      <BottomPanel ref={sheetRef}>
        {bottomView === "DEFAULT" && (
          <View>
            <Text
              style={[commonStyles.banner, { bottom: 10, alignSelf: "center" }]}
            >
              Not able to find the location
            </Text>
            <TouchableOpacity
              style={commonStyles.button}
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
              <Text style={commonStyles.buttonText}>
                Pick location from map
              </Text>
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
            />

            <TouchableOpacity
              style={commonStyles.button}
              onPress={async () => {
                await markFavourite({
                  placeId: refObj?.place_id,
                  description: refObj?.description,
                  secondaryText: refObj?.secondaryText,
                  name: favNameRef.current.value,
                });
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
});
