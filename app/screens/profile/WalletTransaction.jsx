import { allTransactions } from "@/scripts/api/miscApi";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function WalletTransaction() {
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    const transactions = await allTransactions();
    if (transactions.data) {
      setWallet(transactions.data);
    } else {
      Alert.alert("Info", transactions?.message);
    }
  };

  const renderItem = ({ item }) => {
    const isNegative = item.type === "DEBIT";
    const amountColor = isNegative ? "#e74c3c" : "#16a085";
    const emoji = item.type === "DEBIT" ? "💳" : "💸";
    const bgColor = item.type === "DEBIT" ? "#f2d5d9" : "#d6f7e6";

    return (
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
          {/* <Text style={styles.iconText}>{emoji}</Text> */}
          <Ionicons
            name={isNegative ? "car-outline" : "card-outline"}
            size={22}
            color={amountColor}
          ></Ionicons>
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.rowTitle}>{item.type}</Text>
          <Text style={styles.rowDate}>
            {moment(item.created_at).format("MMM DD, YYYY HH:mm A")}
          </Text>
        </View>
        <Text style={[styles.rowAmount, { color: amountColor }]}>
          {isNegative ? "-" : "+"}₹{item.amount}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* <View style={styles.chips}>
        <View style={[styles.chip, styles.activeChip]}>
          <Text style={styles.chipTextActive}>All</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>Debit</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>Credit</Text>
        </View>
      </View> */}

      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      <FlatList
        data={wallet?.transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f6f6",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#f7f6f6",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 2,
  },
  backText: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceInfo: {
    flexDirection: "column",
  },
  balanceLabel: {
    color: "#d35454",
    fontSize: 14,
    marginBottom: 6,
  },
  balanceValue: {
    fontSize: 34,
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 22,
    elevation: 2,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  chips: {
    marginHorizontal: 16,
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f0caca",
    backgroundColor: "#fff",
  },
  activeChip: {
    backgroundColor: "#fbe5e5",
    borderColor: "#f5a3a3",
  },
  chipText: {
    fontSize: 14,
    color: "#555",
  },
  chipTextActive: {
    fontSize: 14,
    color: "#e54b4b",
    fontWeight: "600",
  },
  sectionTitle: {
    marginTop: 18,
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: "700",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
  },
  rowInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  rowDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  rowAmount: {
    fontSize: 15,
    fontWeight: "600",
  },
});
