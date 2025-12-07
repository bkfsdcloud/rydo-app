import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const driversData = [
  {
    id: "12345",
    name: "John Appleseed",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "Online",
  },
  {
    id: "67890",
    name: "Jane Doe",
    avatar: "https://i.pravatar.cc/150?img=2",
    status: "On Trip",
  },
  {
    id: "54321",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "Offline",
  },
  {
    id: "98765",
    name: "Sarah Miller",
    avatar: "https://i.pravatar.cc/150?img=4",
    status: "Online",
  },
  {
    id: "11223",
    name: "Michael Brown",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "Suspended",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Online":
      return "#10b981";
    case "On Trip":
      return "#3b82f6";
    case "Offline":
      return "#94a3b8";
    case "Suspended":
      return "#f87171";
    default:
      return "#9ca3af";
  }
};

const DriverManagement = () => {
  const renderDriver = ({ item }) => (
    <TouchableOpacity style={styles.driverCard}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.driverInfo}>
        <Text style={styles.driverName}>{item.name}</Text>
        <Text style={styles.driverId}>ID: {item.id}</Text>
      </View>
      <View style={styles.statusArea}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconBtn}>
          <View style={styles.iconBarContainer}>
            <View style={styles.iconBar} />
            <View style={[styles.iconBar, { width: 14 }]} />
            <View style={styles.iconBar} />
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <View style={styles.plusCircle}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search by name or ID"
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Drivers</Text>
          <Text style={styles.statValue}>152</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Online</Text>
          <Text style={[styles.statValue, { color: "#10b981" }]}>86</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>On Trip</Text>
          <Text style={[styles.statValue, { color: "#3b82f6" }]}>23</Text>
        </View>
      </View>

      <FlatList
        data={driversData}
        keyExtractor={(item) => item.id}
        renderItem={renderDriver}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default DriverManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  iconBtn: {
    padding: 6,
  },
  iconBarContainer: {
    width: 22,
    height: 16,
    justifyContent: "space-between",
  },
  iconBar: {
    height: 3,
    width: 20,
    backgroundColor: "#e11d48",
    borderRadius: 2,
  },
  plusCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#e11d48",
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: "#e11d48",
    fontSize: 18,
    lineHeight: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    letterSpacing: 0.2,
  },
  searchBar: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: "#f0f2f5",
    borderRadius: 14,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 16,
    color: "#9ca3af",
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#111",
  },
  statsRow: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  list: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  driverCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  driverId: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  statusArea: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#374151",
    marginRight: 6,
  },
  chevron: {
    fontSize: 22,
    color: "#cbd5e1",
    marginLeft: 6,
  },
});
