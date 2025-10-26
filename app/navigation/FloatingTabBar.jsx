import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function FloatingTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.floatingTab}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        const iconName =
          route.name === "Home"
            ? "home-outline"
            : route.name === "RideRequests"
            ? "car-outline"
            : "person-outline";

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tabButton, isFocused && styles.activeTab]}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? "#fff" : "#555"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingTab: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#111",
    borderRadius: 40,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  activeTab: {
    backgroundColor: "#1e90ff",
    borderRadius: 30,
  },
});
