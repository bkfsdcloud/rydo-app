// RideSummaryModal.jsx
import CancelComponent from "@/app/component/CancelComponent";
import TouchableButton from "@/app/component/TouchableButton";
import { createRide } from "@/scripts/api/riderApi";
import { commonStyles } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRideStore } from "../../store/useRideStore";

export default function RideSummaryModal({ onShowBottomPanel }) {
  const navigation = useNavigation();
  const [showCancelTab, setShowCancelTab] = useState(false);

  const {
    destination,
    origin,
    status,
    setStatus,
    paymentMethod,
    category,
    setCategory,
    duration,
    setFare,
    fare,
    distance,
    fares,
    id,
    setId,
    distanceKm,
    resetRide,
    durationMin,
    transportMode,
    setCommissionAmount,
    commissionAmount,
    setDriverEarning,
    driverEarning,
  } = useRideStore();

  const isDisabled = useCallback(() => id > 0, [id]);

  const handleCancel = useCallback(
    async (ack) => {
      setShowCancelTab(false);
      if (ack) {
        resetRide();
        navigation.navigate("RiderHome");
      }
    },
    [resetRide, navigation]
  );

  const handleBookRide = useCallback(async () => {
    const body = {
      fareEstimated: fare,
      pickupLat: origin.coords.lat,
      pickupLng: origin.coords.lng,
      dropLat: destination.coords.lat,
      dropLng: destination.coords.lng,
      distanceKm: distanceKm,
      pickupLocation: origin.description,
      dropLocation: destination.description,
      duration: durationMin,
      transportMode,
      category,
      paymentMethod,
      commissionAmount,
      driverEarning,
    };
    const res = await createRide(body);
    if (res.data) {
      setId(res.data?.id);
      setStatus(res.data?.status);
      Alert.alert("Ride Created", res.message);
    }
  }, [
    fare,
    origin,
    destination,
    distanceKm,
    durationMin,
    transportMode,
    category,
    paymentMethod,
    setId,
    setStatus,
    commissionAmount,
    driverEarning,
  ]);

  const handleSelectCategory = useCallback((item, value) => {
    setCategory(item);
    setFare(value?.fare);
    setCommissionAmount(value?.commissionAmount);
    setDriverEarning(value?.driverEarning);
  }, []);

  return (
    <View style={styles.container}>
      <CancelComponent
        visible={showCancelTab}
        onClose={handleCancel}
      ></CancelComponent>
      <Text style={styles.heading}>Trip Summary</Text>
      <View style={styles.row}>
        <Text style={styles.subText}>Distance: {distance}</Text>
        <Text style={styles.subText}>Duration: {duration}</Text>
      </View>

      {/* Vehicle Category */}
      <View style={styles.row}>
        {Object.entries(fares || {}).map(([item, value]) => (
          <TouchableOpacity
            key={item}
            style={[styles.option, category === item && styles.selectedOption]}
            disabled={isDisabled()}
            onPress={() => handleSelectCategory(item, value)}
          >
            <Ionicons
              name={"car-outline"}
              size={20}
              color={category === item ? "#333" : "grey"}
            />
            <Text
              style={[
                styles.optionText,
                category === item && styles.optionTextSelected,
              ]}
            >
              {item}
            </Text>
            <Text
              style={[styles.fare, category === item && styles.fareSelected]}
            >
              ₹{value?.fare}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sectionSpace} />
      <View style={styles.pillRow}>
        <TouchableButton
          style={styles.pill}
          onPress={() =>
            isDisabled() ? null : onShowBottomPanel("PAYMENT_METHOD")
          }
        >
          <Text style={styles.pillIcon}>
            <Ionicons
              name={
                paymentMethod === "Cash"
                  ? "cash-outline"
                  : paymentMethod === "UPI"
                  ? "qr-code-outline"
                  : "card-outline"
              }
              size={22}
              color={"#333"}
            />
          </Text>
          <Text>{paymentMethod}</Text>
        </TouchableButton>
        <TouchableButton style={styles.pill}>
          <Text style={styles.pillIcon}>
            <Ionicons name={"person-outline"} size={22} color={"#333"} />
          </Text>
          <Text>Personal</Text>
        </TouchableButton>
      </View>

      {(!id || id === 0) && (
        <TouchableButton
          style={[commonStyles.button, isDisabled()]}
          onPress={handleBookRide}
          disabled={isDisabled()}
        >
          <Text style={commonStyles.buttonText}>Book Ride</Text>
        </TouchableButton>
      )}
      {id > 0 && ["ASSIGNED", "ACCEPTED"].includes(status) && (
        <TouchableButton
          style={[commonStyles.button]}
          onPress={() => setShowCancelTab(true)}
        >
          <Text style={[commonStyles.buttonText]}>Cancel Ride</Text>
        </TouchableButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: "flex-end", margin: 0 },
  container: {
    backgroundColor: "#fff",
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
  subText: { fontSize: 15, color: "#555", marginBottom: 5, fontWeight: "500" },
  fare: {
    fontSize: 12,
    color: "#f0860dff",
    marginBottom: 5,
    fontWeight: "600",
  },
  fareSelected: { color: "#f01717ff" },
  label: { marginTop: 15, fontSize: 16, fontWeight: "500", marginBottom: 8 },
  row: {
    flexDirection: "row",
    gap: 10,
    margin: 3,
  },
  option: {
    flex: 1,
    padding: 3,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ff9900ff",
    borderWidth: 1,
  },
  selectedOption: { backgroundColor: "#f8d678ff" },
  optionText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textTransform: "capitalize",
  },
  optionTextSelected: { color: "#000" },
  button: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  pillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 6,
  },
  pill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    marginHorizontal: 6,
  },
  pillIcon: { fontSize: 16 },
  pillArrow: { fontSize: 12, color: "#aaa", marginTop: 2 },
  sectionSpace: { height: 8 },
});
