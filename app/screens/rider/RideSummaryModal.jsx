// RideSummaryModal.jsx
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

export default function RideSummaryModal({
  visible,
  onClose,
  onConfirm,
  distance,
  fare,
  transportMode,
  setTransportMode,
  paymentMethod,
  setPaymentMethod,
}) {
  const vehicles = ["Car"];
  const paymentModes = ["Cash", "UPI", "Card"];

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      swipeDirection="down"
      onSwipeComplete={onClose}
      propagateSwipe
    >
      <View style={styles.container}>
        <View style={styles.handle} />

        {/* Ride Info */}
        <Text style={styles.heading}>Trip Summary</Text>
        <Text style={styles.subText}>Distance: {distance}</Text>
        <Text style={styles.subText}>Fare: ₹{fare}</Text>

        {/* Transport Options */}
        <Text style={styles.label}>Select Transport</Text>
        <View style={styles.row}>
          {vehicles.map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.option,
                transportMode === mode && styles.selectedOption,
              ]}
              onPress={() => setTransportMode(mode)}
            >
              <Ionicons
                name={mode === "Car" ? "car-outline" : "bicycle-outline"}
                size={22}
                color={transportMode === mode ? "#fff" : "#333"}
              />
              <Text
                style={[
                  styles.optionText,
                  transportMode === mode && styles.optionTextSelected,
                ]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.row}>
          {paymentModes.map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.option,
                paymentMethod === method && styles.selectedOption,
              ]}
              onPress={() => setPaymentMethod(method)}
            >
              <Ionicons
                name={
                  method === "Cash"
                    ? "cash-outline"
                    : method === "UPI"
                    ? "qr-code-outline"
                    : "card-outline"
                }
                size={22}
                color={paymentMethod === method ? "#fff" : "#333"}
              />
              <Text
                style={[
                  styles.optionText,
                  paymentMethod === method && styles.optionTextSelected,
                ]}
              >
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.button} onPress={onConfirm}>
          <Text style={styles.buttonText}>Book Ride</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: "flex-end", margin: 0 },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 15,
  },
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  subText: { fontSize: 15, color: "#555", marginBottom: 5 },
  label: { marginTop: 15, fontSize: 16, fontWeight: "500", marginBottom: 8 },
  row: { flexDirection: "row", gap: 10 },
  option: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOption: { backgroundColor: "#007AFF" },
  optionText: { marginTop: 5, fontSize: 14, color: "#333" },
  optionTextSelected: { color: "#fff" },
  button: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
