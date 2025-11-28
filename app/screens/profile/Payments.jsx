import useUserStore from "@/app/store/useUserStore";
import { allTransactions } from "@/scripts/api/miscApi";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Payments() {
  const navigation = useNavigation();
  const { balance, setBalance, setWalletTransactions } = useUserStore();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    setLoading(true);
    const transactions = await allTransactions({ skipGlobalLoader: true });
    setLoading(false);
    if (transactions.data) {
      setWalletTransactions(transactions.data?.transactions);
      setBalance(transactions.data?.balance);
    } else {
      Alert.alert("Info", transactions?.message);
    }
  };

  return (
    <View style={styles.content}>
      <Text style={styles.sectionLabel}>WALLETS</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("Wallet")}
        style={styles.card}
      >
        <View style={styles.cardLeft}>
          <View style={[styles.iconBg, { backgroundColor: "#ffe6e6" }]}>
            {loading && <ActivityIndicator size="small" color={"red"} />}
            {!loading && (
              <Text style={styles.icon}>
                <Image
                  source={require("@/assets/images/wallet.png")}
                  style={{ width: 40, height: 40, padding: 8 }}
                />
              </Text>
            )}
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Wallet</Text>
            <Text style={styles.cardSubtitle}>
              Balance : ₹{balance.toFixed(2)}
            </Text>
          </View>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>OTHER PAYMENTS</Text>

      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconBg, { backgroundColor: "#e8f5ff" }]}>
            <Text style={styles.icon}>
              <Image
                source={require("@/assets/images/money.png")}
                style={{ width: 45, height: 45, padding: 5 }}
              />
            </Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Cash</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconBg, { backgroundColor: "#e8f5ff" }]}>
            <Text style={styles.icon}>
              <Image
                source={require("@/assets/images/upi.png")}
                style={{ width: 45, height: 45, padding: 5 }}
              />
            </Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>UPI</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },
  header: {
    height: 56,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backBtn: {
    position: "absolute",
    left: 12,
    top: 14,
    padding: 6,
  },
  backText: {
    fontSize: 18,
    color: "#333",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#7a7a7a",
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 1.2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  cardText: {
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#757575",
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: "#9e9e9e",
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
