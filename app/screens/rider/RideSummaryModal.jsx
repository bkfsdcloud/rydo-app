// RideSummaryModal.jsx
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRideStore } from "../../store/useRideStore";

export default function RideSummaryModal({ visible, onClose, onConfirm }) {
  // const transportModes = ["Car"];
  const categories = {
    Car: ["Standard", "Premium", "Luxury", "Executive"],
  };
  const paymentModes = ["Cash", "UPI"];

  const {
    transportMode,
    paymentMethod,
    setPaymentMethod,
    category,
    setCategory,
    fare,
    distance,
  } = useRideStore();

  return (
    // <Modal
    //   isVisible={true}
    //   onBackdropPress={onClose}
    //   style={styles.modal}
    //   swipeDirection="down"
    //   onSwipeComplete={onClose}
    //   propagateSwipe
    // >
    <View style={styles.container}>
      {/* <View style={styles.handle} /> */}

      {/* Ride Info */}
      <Text style={styles.heading}>Trip Summary</Text>
      <Text style={styles.subText}>Distance: {distance}</Text>
      <Text style={styles.subText}>Fare: ₹{fare}</Text>

      {/* Transport Options */}
      {/* <Text style={styles.label}>Select Transport</Text>
      <View style={styles.row}>
        {transportModes.map((mode) => (
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
      </View> */}
      {/* Vehicle Category */}
      <View style={styles.row}>
        {categories[transportMode]?.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.option, category === item && styles.selectedOption]}
            onPress={() => setCategory(item)}
          >
            <Ionicons
              name={"car-outline"}
              size={20}
              color={category === item ? "#fff" : "#333"}
            />
            <Text
              style={[
                styles.optionText,
                category === item && styles.optionTextSelected,
              ]}
            >
              {item}
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
    // </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: "flex-end", margin: 0 },
  container: {
    backgroundColor: "#fff",
    padding: 10,
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
  row: {
    flexDirection: "row",
    gap: 10,
    margin: 3,
  },
  option: {
    flex: 1,
    padding: 5,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOption: { backgroundColor: "#007AFF" },
  optionText: { marginTop: 5, fontSize: 12, color: "#333" },
  optionTextSelected: { color: "#fff" },
  button: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
