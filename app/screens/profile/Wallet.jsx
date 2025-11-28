import BottomPanel from "@/app/component/BottomPanel";
import TouchableButton from "@/app/component/TouchableButton";
import AuthContext from "@/app/context/AuthContext";
import useUserStore from "@/app/store/useUserStore";
import { allTransactions, makeTransaction } from "@/scripts/api/miscApi";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Wallet() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { balance, setBalance, setWalletTransactions } = useUserStore();
  const sheetRef = useRef(null);
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [showAmountBox, setShowAmountBox] = useState(false);

  const open = () => sheetRef.current?.expand();
  const close = () => sheetRef.current?.close();

  const handleAddBalance = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return Alert.alert("Enter valid amount");
    }

    setShowAmountBox(false);
    setLoading(true);
    try {
      const res = await makeTransaction({
        amount: parseFloat(amount),
        type: "RECHARGE",
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

  const setRawAmount = (amount) => {
    setShowAmountBox(false);
    setAmount(amount);
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    const transactions = await allTransactions();
    if (transactions.data) {
      setWalletTransactions(transactions.data?.transactions);
      setBalance(transactions.data?.balance);
    } else {
      Alert.alert("Info", transactions?.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.card}>
        {/* <ImageBackground
          source={require("@/assets/images/1.png")}
          style={{ height: 200, width: 350, position: "absolute" }}
        /> */}
        <View style={styles.yellowShape} />
        <View style={styles.cardHeader}>
          <Text style={styles.title}>Wallet</Text>
          <View style={styles.infoDot}>
            <Text style={styles.infoText}>i</Text>
          </View>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.availableLabel}>Available Balance</Text>
          <Text style={styles.amount}>₹ {balance.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ACTIONS</Text>
      </View>

      <View style={styles.listContainer}>
        {/* {actionsData.map((item) => ( */}
        <TouchableOpacity style={styles.listItem} onPress={open}>
          <View style={styles.itemIcon}>
            <Image
              source={require("@/assets/images/money-rupee-circle-fill.png")}
              style={{
                width: 45,
                height: 45,
                tintColor: "orange",
              }}
            />
          </View>
          <Text style={styles.itemLabel}>Recharge</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate("WalletTransaction")}
        >
          <View style={styles.itemIcon}>
            <Image
              source={require(`@/assets/images/transactions.png`)}
              style={{ width: 35, height: 35 }}
            />
          </View>
          <Text style={styles.itemLabel}>Transactions History</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate("PayFromWalletScreen")}
        >
          <View style={styles.itemIcon}>
            <Image
              source={require(`@/assets/images/business.png`)}
              style={{ width: 35, height: 35 }}
            />
          </View>
          <Text style={styles.itemLabel}>Pay From Wallet</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        {/* ))} */}
      </View>
      <BottomPanel
        ref={sheetRef}
        index={-1}
        enablePanClose={true}
        onClose={close}
        title={"Add Balance"}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setMethod("UPI")}
              style={{
                backgroundColor: method === "UPI" ? "#007AFF" : "#eee",
                padding: 12,
                borderRadius: 8,
                marginRight: 10,
              }}
            >
              <Text style={{ color: method === "UPI" ? "#fff" : "#333" }}>
                UPI
              </Text>
            </TouchableOpacity>
            {user?.role === "DRIVER" && (
              <TouchableOpacity
                onPress={() => setMethod("Cash")}
                style={{
                  backgroundColor: method === "Cash" ? "#007AFF" : "#eee",
                  padding: 12,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: method === "Cash" ? "#fff" : "#333" }}>
                  Cash
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={{ marginBottom: 10, fontSize: 16 }}>Amount:</Text>
          {showAmountBox && (
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="number-pad"
              returnKeyType="done"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 8,
                marginBottom: 20,
              }}
            />
          )}
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            {[100, 200, 500, 1000].map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setRawAmount(m)}
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
            <TouchableButton
              onPress={() => {
                setShowAmountBox(true);
                setAmount(0);
              }}
              style={{
                backgroundColor: showAmountBox ? "#007AFF" : "#eee",
                padding: 12,
                borderRadius: 8,
                marginRight: 10,
              }}
            >
              <Text style={{ color: showAmountBox ? "#fff" : "#333" }}>
                Other
              </Text>
            </TouchableButton>
          </View>

          {/* Submit */}
          <TouchableButton
            disabled={loading || amount <= 0}
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
          </TouchableButton>
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
    marginTop: 10,
  },
  yellowShape: {
    position: "absolute",
    left: 0,
    top: 10,
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
