import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

export default function UpiQRScanner({ onScan }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);

    try {
      // UPI QR format → upi://pay?pa=vpa@bank&pn=name...
      const params = new URLSearchParams(data.split("?")[1]);
      const vpa = params.get("pa");

      if (!vpa) {
        Alert.alert("Invalid QR", "UPI ID (pa) not found in QR");
        return;
      }

      onScan(vpa);
    } catch (e) {
      Alert.alert("Error", "Invalid UPI QR code");
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission…</Text>;
  }
  if (hasPermission === false) {
    return <Text>No permission for camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />

      {scanned && (
        <Button title="Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scanner: { flex: 1 },
});
