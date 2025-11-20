import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { commonStyles } from "@/scripts/constants";
import { getRecentSearches, saveSearch } from "../../scripts/searchStorage";
import useUserStore from "../store/useUserStore";

import { allFavourites, unmarkFavourite } from "../../scripts/api/miscApi";

export default function SuggestionList({
  search,
  suggestions,
  setShowSuggestionDropdown,
  handleSelectRecent,
  onAddFavourite,
}) {
  const [recent, setRecent] = useState([]);
  const { favourites, setFavourites } = useUserStore();

  useEffect(() => {
    loadSearches();
  }, []);

  const loadSearches = async () => {
    const resp = await getRecentSearches();
    setRecent(resp);
  };

  const loadFavourites = async () => {
    const resp = await allFavourites();
    setFavourites(resp.data);
  };

  const removeFavourite = async (item) => {
    const resp = await unmarkFavourite({ id: item?.id });
    if (resp.message) {
      loadFavourites();
    }
  };

  const sections = [
    {
      title: "Favourites",
      key: "FAV",
      data: search
        ? favourites?.filter(
            (item) =>
              item.description?.toLowerCase().indexOf(search.toLowerCase()) !==
                -1 ||
              item.name?.toLowerCase().indexOf(search.toLowerCase()) !== -1
          )
        : favourites,
    },
    {
      title: "Recent Searches",
      key: "RECENT",
      data: search
        ? recent?.filter(
            (item) =>
              item.description?.toLowerCase().indexOf(search.toLowerCase()) !==
                -1 ||
              (item.name &&
                item.name?.toLowerCase().indexOf(search.toLowerCase()) !== -1)
          )
        : recent,
    },
    {
      title: "Suggestions",
      key: "SUGG",
      data: suggestions,
    },
  ].filter(Boolean);

  const handleSelectRecentWithStorage = (item) => {
    setShowSuggestionDropdown(false);
    if (item?.description) {
      saveSearch({
        description: item?.description.trim(),
        place_id: item?.place_id.trim(),
        secondaryText: item?.secondaryText.trim(),
      });
      loadSearches();
    }
    handleSelectRecent(item);
  };

  const flatListItemCb = useCallback(({ item, section }) => {
    return (
      <View style={commonStyles.dropdownPanel}>
        <Ionicons
          name="location-outline"
          style={commonStyles.dropdownIcon}
          color="#666"
        />
        <TouchableOpacity
          onPress={async () => handleSelectRecentWithStorage(item)}
          style={commonStyles.item}
        >
          <Text numberOfLines={1} style={commonStyles.banner}>
            {item?.name || item.description}
          </Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={commonStyles.subText}
          >
            {item?.name ? item.description : item.secondaryText}
          </Text>
        </TouchableOpacity>
        {section?.key !== "RECENT" && !item?.id && (
          <Ionicons
            name="heart-outline"
            style={commonStyles.dropdownIcon}
            onPress={() => onAddFavourite(item)}
            color="#666"
          />
        )}
        {item?.id && (
          <Ionicons
            name="trash-outline"
            style={commonStyles.dropdownIcon}
            onPress={() => removeFavourite(item)}
            color="#666"
          />
        )}
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        contentContainerStyle={{ paddingBottom: 200 }}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title, data } }) =>
          data.length > 0 ? <Text style={styles.header}>{title}</Text> : null
        }
        renderItem={({ section, item }) => flatListItemCb({ item, section })}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No results found
          </Text>
        }
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  header: {
    color: "grey",
    textTransform: "uppercase",
  },
});
