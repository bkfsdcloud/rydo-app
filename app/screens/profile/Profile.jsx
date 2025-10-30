import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthContext from "../../context/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const menuItems = [
    {
      id: "1",
      title: "Profile Details",
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
    { id: "5", title: "Favorites", icon: "heart-outline", route: "Favorites" },
  ];

  const handleItemPress = (route) => {
    if (route) navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user?.avatarUrl || "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />
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

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 20 },
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
