import { FlatList, StyleSheet, Text, View } from "react-native";

const rides = [
  { id: "1", date: "2025-10-10", from: "Bangalore", to: "Mysore", fare: 1200 },
  { id: "2", date: "2025-10-14", from: "Chennai", to: "Vellore", fare: 900 },
];

export default function RideHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Rides</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{item.date}</Text>
            <Text>{item.from} → {item.to}</Text>
            <Text style={styles.fare}>₹{item.fare}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  date: { fontWeight: "bold", color: "#444" },
  fare: { color: "#2196f3", marginTop: 5 },
});
