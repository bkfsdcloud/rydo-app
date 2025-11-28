import AuthContext from "@/app/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";

export default function useUserStorage() {
  const { user } = useContext(AuthContext);

  const SEARCH_KEY = `recent_searches_${user?.id}`;

  const saveSearch = async (term) => {
    try {
      const existing = await AsyncStorage.getItem(SEARCH_KEY);
      let searches = existing ? JSON.parse(existing) : [];

      searches = searches.filter((item) => item.place_id !== term.place_id);

      searches.unshift(term);

      if (searches.length > 5) searches = searches.slice(0, 5);

      await AsyncStorage.setItem(SEARCH_KEY, JSON.stringify(searches));
    } catch (e) {
      console.error("Error saving search:", e);
    }
  };

  const getRecentSearches = async (search) => {
    try {
      let existing = await AsyncStorage.getItem(SEARCH_KEY);
      existing = existing ? JSON.parse(existing) : [];
      return existing;
    } catch (e) {
      console.error("Error getting searches:", e);
      return [];
    }
  };

  const clearSearches = async () => {
    await AsyncStorage.removeItem(SEARCH_KEY);
  };

  return { saveSearch, getRecentSearches, clearSearches };
}
