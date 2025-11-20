import BottomPanel from "@/app/component/BottomPanel";
import { allTransactions, makeTransaction } from "@/scripts/api/miscApi";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Wallet() {
  const navigation = useNavigation();
  const [wallet, setWallet] = useState({
    balance: 0,
    walletId: 0,
    transactions: [],
  });
  const sheetRef = useRef(null);
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState("CASH");
  const [loading, setLoading] = useState(false);

  const open = () => sheetRef.current?.expand();
  const close = () => sheetRef.current?.close();

  const handleAddBalance = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return Alert.alert("Enter valid amount");
    }

    setLoading(true);
    try {
      const res = await makeTransaction({
        amount: parseFloat(amount),
        type: "CREDIT",
        paymentMethod: method,
      });

      if (res.data) {
        Alert.alert("Success", `₹${amount} added via ${method.toUpperCase()}`);
      } else {
        Alert.alert("Error", res.message || "Unable to add balance");
      }
      fetchWallet();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
      close();
    }
  };

  const actionsData = [
    {
      id: "recharge",
      label: "Recharge",
      icon: "💳",
      onPress: () => open(),
    },
    {
      id: "history",
      label: "Transactions History",
      icon: "🧾",
      onPress: () => navigation.navigate("WalletTransaction"),
    },
    {
      id: "pay",
      label: "Pay From Wallet",
      icon: "🧾",
      onPress: () => navigation.navigate("PayFromWalletScreen"),
    },
  ];

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

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.card}>
        <View style={styles.yellowShape} />
        <View style={styles.cardHeader}>
          <Text style={styles.title}>Wallet</Text>
          <View style={styles.infoDot}>
            <Text style={styles.infoText}>i</Text>
          </View>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.availableLabel}>Available Balance</Text>
          <Text style={styles.amount}>₹ {wallet.balance.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ACTIONS</Text>
      </View>

      <View style={styles.listContainer}>
        {actionsData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.listItem}
            onPress={item.onPress}
          >
            <View style={styles.itemIcon}>
              <Text style={styles.itemIconText}>{item.icon}</Text>
            </View>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
      <BottomPanel
        ref={sheetRef}
        index={-1}
        enablePanClose={true}
        onClose={close}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
            Add Balance
          </Text>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 8,
              marginBottom: 20,
            }}
          />

          {/* Payment method selection */}
          <Text style={{ marginBottom: 10, fontSize: 16 }}>Amount:</Text>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            {/* {["UPI", "CASH"].map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setMethod(m)}
                style={{
                  backgroundColor: method === m ? "#007AFF" : "#eee",
                  padding: 12,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: method === m ? "#fff" : "#333" }}>
                  {m.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))} */}
            {[100, 200, 500, 1000].map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setAmount(m)}
                style={{
                  backgroundColor: amount === m ? "#007AFF" : "#eee",
                  padding: 12,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: amount === m ? "#fff" : "#333" }}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Submit */}
          <TouchableOpacity
            disabled={loading}
            onPress={handleAddBalance}
            style={{
              backgroundColor: "#34C759",
              padding: 14,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
            >
              {loading ? "Processing..." : "Add Balance"}
            </Text>
          </TouchableOpacity>
        </View>
      </BottomPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f7",
  },
  topBar: {
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 20,
    paddingTop: 28,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  yellowShape: {
    position: "absolute",
    left: -20,
    top: -20,
    width: 120,
    height: 120,
    backgroundColor: "#ffd56a",
    borderTopRightRadius: 60,
    borderBottomRightRadius: 60,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  infoDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  infoText: {
    color: "#e74c3c",
    fontSize: 12,
    fontWeight: "700",
  },
  balanceContainer: {
    marginTop: 12,
  },
  availableLabel: {
    color: "#9a9a9a",
    fontSize: 14,
  },
  amount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginTop: 6,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#8e8e8e",
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  itemIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#e74c3c",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginRight: 12,
  },
  itemIconText: {
    fontSize: 16,
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },
  chevron: {
    color: "#9e9e9e",
    fontSize: 18,
  },
});

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
//   paymentView: {
//     boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   paymentIcon: { padding: 15, paddingRight: 10 },
//   paymentText: {
//     padding: 15,
//     paddingLeft: 0,
//     fontWeight: "500",
//     fontSize: 16,
//   },
// });
