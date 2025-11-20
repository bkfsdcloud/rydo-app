import { allTransactions, makeTransaction } from "@/scripts/api/miscApi";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PayFromWalletScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    const transactions = await allTransactions();
    if (transactions.data) {
      setBalance(transactions?.data.balance);
    }
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0)
      return Alert.alert("Enter valid amount");
    if (parseFloat(amount) > balance)
      return Alert.alert("Insufficient balance");

    setLoading(true);
    try {
      const res = await makeTransaction({
        amount: parseFloat(amount),
        type: "DEBIT",
        paymentMethod: "ADMIN_ADJUSTMENT",
      });

      if (res?.data) {
        Alert.alert("Payment Successful", `Paid ₹${amount} from wallet`);
        navigation.replace("Payments");
      } else {
        Alert.alert("Error", res?.message || "Payment failed");
      }
    } catch (err) {
      Alert.alert("Error", "Network issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Pay from Wallet
      </Text>
      <Text style={{ marginBottom: 20, color: "#555" }}>
        Available Balance: ₹{balance.toFixed(2)}
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

      <TouchableOpacity
        disabled={loading}
        onPress={handlePayment}
        style={{
          backgroundColor: "#007AFF",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <Text
          style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
