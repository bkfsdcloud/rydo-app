import { StyleSheet, Text, View } from "react-native";

export default function Notifications({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.empty}>
        <Text style={{ fontSize: 22, fontWeight: "400" }}>
          No Notifications
        </Text>
      </View>
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
  empty: {
    justifyContent: "center",
    alignItems: "center",
  },
});
