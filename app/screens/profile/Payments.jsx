import { StyleSheet, Text, View } from "react-native";

export default function Payments() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payments</Text>
      <Text>Your saved payment methods and recent transactions will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
});
