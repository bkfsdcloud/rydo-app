import { commonStyles } from "@/scripts/constants";
import { useState } from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import { updatePaymentStatus } from "../../../scripts/api/paymentApi";

export default function PaymentScreen({ route }) {
  const { rideId, upiId, name, amount } = route.params;

  const [driver, setDriver] = useState(null);

  //   useEffect(() => {
  //     const handleUrl = (event) => {
  //       const url = event.url;

  //       const params = new URLSearchParams(url.split("?")[1]);

  //       const status = params.get("Status");
  //       const txnId = params.get("txnId");
  //     };

  //     Linking.addEventListener("url", handleUrl);
  //     return () => Linking.removeEventListener("url", handleUrl);
  //   }, []);

  //   if (!driver) return <Text>Loading...</Text>;

  const upiUrl = buildUPILink({
    upiId: upiId,
    name: name,
    amount,
  });

  function buildUPILink({ upiId, name, amount }) {
    return `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;
  }

  async function openUPIApp(url) {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) return Alert.alert("No UPI apps found");

      await Linking.openURL(url);
    } catch (e) {
      Alert.alert("Failed", e.message);
    }
  }

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.row}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Pay {name}</Text>
      </View>

      {/* <Image
        source={{ uri: driver.qr_code_url }}
        style={{ width: 250, height: 250, marginVertical: 20 }}
      /> */}

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18 }}>Driver UPI ID: {upiId}</Text>
        <Text style={{ fontSize: 18 }}>UPI Url: {upiUrl}</Text>
      </View>

      <View style={commonStyles.row}>
        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => openUPIApp(upiUrl)}
        >
          <Text style={commonStyles.buttonText}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => updatePaymentStatus({ rideId, status: "SUCCESS" })}
          color="green"
        >
          <Text style={commonStyles.buttonText}>Driver received</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
