import LocationContext from "@/app/context/LocationContext";
import useUserStore from "@/app/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthContext from "../../context/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const { location } = useContext(LocationContext);
  const navigation = useNavigation();
  const { driverStatus } = useUserStore();

  const menuItems = [
    {
      id: "1",
      title: "Profile",
      icon: "person-outline",
      route: "ProfileDetails",
    },
    { id: "2", title: "My Rides", icon: "car-outline", route: "RideHistory" },
    { id: "3", title: "Payments", icon: "card-outline", route: "Payments" },
    {
      id: "4",
      title: "Notifications",
      icon: "notifications-outline",
      route: "Notifications",
    },
    // { id: "5", title: "Favorites", icon: "heart-outline", route: "Favorites" },
  ];

  const handleItemPress = (route) => {
    if (route) navigation.navigate(route);
  };

  function getColor(name) {
    const colors = ["#6C63FF", "#FF6F91", "#FF9671", "#FFC75F", "#0089BA"];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View
              style={[
                styles.avatarContainer,
                {
                  width: 50,
                  height: 50,
                  borderRadius: 50 / 2,
                  backgroundColor: getColor(user?.name),
                },
              ]}
            >
              <Text style={[styles.avatarText, { fontSize: 50 / 2 }]}>
                {user?.name.charAt(0)}
              </Text>
            </View>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.name}>{user?.name}</Text>
              <Text style={styles.role}>+91 {user?.phone}</Text>
            </View>
          </View>

          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleItemPress(item.route)}
              >
                <Ionicons name={item.icon} size={22} color="#333" />
                <Text style={styles.menuText}>{item.title}</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#999"
                  style={styles.arrow}
                />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  role: { color: "#666", marginTop: 4 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: "#333" },
  arrow: { marginLeft: "auto" },
  separator: { height: 10 },
  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#E53935",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 30,
  },
  logoutText: { color: "#fff", fontSize: 16, marginLeft: 8, fontWeight: "600" },
});
