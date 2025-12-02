import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Notifications({ navigation }) {
  const renderItem = ({ item }) => {
    const isNegative = item.type === "RIDE_PAYMENT" || item.amount < 0;
    const amountColor = isNegative ? "#e74c3c" : "#16a085";
    const bgColor = isNegative ? "#f2d5d9" : "#d6f7e6";

    return (
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
          <Ionicons
            name={isNegative ? "car-outline" : "card-outline"}
            size={22}
            color={amountColor}
          ></Ionicons>
        </View>
        <Text style={[styles.rowAmount, { color: amountColor }]}>
          {isNegative ? "-" : "+"}₹
          {item.amount < 0 ? item.amount * -1 : item.amount}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No Notifications
          </Text>
        }
      />
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
