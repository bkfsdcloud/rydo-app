import BottomPanel from "@/app/component/BottomPanel";
import TouchableButton from "@/app/component/TouchableButton";
import AuthContext from "@/app/context/AuthContext";
import useUserStore from "@/app/store/useUserStore";
import { allTransactions, makeTransaction } from "@/scripts/api/miscApi";
import { commonStyles } from "@/scripts/constants";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Payments() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { balance, setBalance, setWalletTransactions } = useUserStore();

  const [loading, setLoading] = useState(false);
  const open = () => sheetRef.current?.expand();
  const close = () => sheetRef.current?.close();
  const sheetRef = useRef(null);
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState("UPI");
  const [showAmountBox, setShowAmountBox] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text style={styles.sectionLabel}>WALLETS</Text>

        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Wallet")}
            style={[commonStyles.row]}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.iconBg]}>
                {loading && <ActivityIndicator size="small" color={"red"} />}
                {!loading && (
                  <Text style={styles.icon}>
                    <Image
                      source={require("@/assets/images/wallet.png")}
                      style={{ width: 35, height: 35 }}
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
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          {/* {actionsData.map((item) => ( */}
          <TouchableOpacity style={styles.listItem} onPress={open}>
            <View style={styles.itemIcon}>
              <Image
                source={require("@/assets/images/money-rupee-circle-fill.png")}
                style={{
                  width: 40,
                  height: 40,
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
                style={{ width: 30, height: 30 }}
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
                style={{ width: 30, height: 30 }}
              />
            </View>
            <Text style={styles.itemLabel}>Pay From Wallet</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          {/* ))} */}
        </View>

        <Text style={styles.sectionLabel}>OTHER PAYMENTS</Text>

        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconBg]}>
              <Text style={styles.icon}>
                <Image
                  source={require("@/assets/images/money.png")}
                  style={{ width: 35, height: 35 }}
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
            <View style={[styles.iconBg]}>
              <Text style={styles.icon}>
                <Image
                  source={require("@/assets/images/upi.png")}
                  style={{ width: 35, height: 35 }}
                />
              </Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>UPI</Text>
            </View>
          </View>
        </View>
      </View>
      <BottomPanel
        ref={sheetRef}
        index={-1}
        enablePanClose={true}
        onClose={close}
        title={"Add Balance"}
      >
        <View style={{ flex: 1 }}>
          {user?.role === "DRIVER" && (
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
            </View>
          )}
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
    </SafeAreaView>
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
    paddingVertical: 10,
    paddingHorizontal: 10,
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
  listContainer: {},
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
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
  itemLabel: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },
});
