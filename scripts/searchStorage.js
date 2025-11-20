import AsyncStorage from "@react-native-async-storage/async-storage";

const SEARCH_KEY = "recent_searches";

export const saveSearch = async (term) => {
  try {
    const existing = await AsyncStorage.getItem(SEARCH_KEY);
    let searches = existing ? JSON.parse(existing) : [];

    // remove duplicates
    searches = searches.filter((item) => item.place_id !== term.place_id);
    // add new term at the beginning
    searches.unshift(term);
    // limit to 5 recent searches
    if (searches.length > 5) searches = searches.slice(0, 5);

    await AsyncStorage.setItem(SEARCH_KEY, JSON.stringify(searches));
  } catch (e) {
    console.error("Error saving search:", e);
  }
};

export const getRecentSearches = async (search) => {
  try {
    let existing = await AsyncStorage.getItem(SEARCH_KEY);
    existing = existing ? JSON.parse(existing) : [];
    return existing;
  } catch (e) {
    console.error("Error getting searches:", e);
    return [];
  }
};

export const clearSearches = async () => {
  await AsyncStorage.removeItem(SEARCH_KEY);
};
