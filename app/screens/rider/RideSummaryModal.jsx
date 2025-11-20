// RideSummaryModal.jsx
import { useAlert } from "@/app/context/AlertContext";
import { LocationContext } from "@/app/context/LocationContext";
import { cancelRide, driverStatus } from "@/scripts/api/riderApi";
import { getDistanceKm } from "@/scripts/GeoUtil";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRideStore } from "../../store/useRideStore";

export default function RideSummaryModal({
  onConfirm,
  handleShowAlert,
  handleHideAlert,
}) {
  const paymentModes = ["Cash", "UPI"];
  const { location } = useContext(LocationContext);
  const navigation = useNavigation();
  const { showAlert, hideAlert } = useAlert();

  const {
    status,
    paymentMethod,
    setPaymentMethod,
    category,
    setCategory,
    duration,
    setFare,
    fare,
    distance,
    fares,
    id,
    resetRide,
  } = useRideStore();
  const [reason, setReason] = useState("");
  const [cancellationFee, setCancellationFee] = useState(0);

  const getOpacity = () =>
    id > 0 || !category || !fare ? { opacity: 0.6 } : { opacity: 1 };

  const handleCancel = async () => {
    handleHideAlert();
    if (status === "PENDING" || status === "REQUESTED") {
      const res = await cancelRide({
        rideData: { id, status },
        reason,
        location: { lat: location.lat, lng: location.lng },
      });
      Alert.alert("Info", res?.message);
      resetRide();
      navigation.navigate("RiderHome");
    } else if (status === "ASSIGNED" || status === "ACCEPTED") {
      const res = await cancelRide({
        rideData: { id, status },
        reason,
        cancellationFee,
        location: { lat: location.lat, lng: location.lng },
      });
      if (res?.data) {
        resetRide();
        navigation.navigate("RiderHome");
      }
      Alert.alert("Info", res?.message);
    }
  };

  // function getDistanceKm(start, end) {
  //   const lat1 = start.lat;
  //   const lon1 = start.lng;
  //   const lat2 = end.lat;
  //   const lon2 = end.lng;
  //   const R = 6371; // Earth radius in km
  //   const dLat = (lat2 - lat1) * (Math.PI / 180);
  //   const dLon = (lon2 - lon1) * (Math.PI / 180);
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(lat1 * (Math.PI / 180)) *
  //       Math.cos(lat2 * (Math.PI / 180)) *
  //       Math.sin(dLon / 2) *
  //       Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   return R * c; // Distance in km
  // }

  useEffect(() => {
    if (id === 0) {
      const entries = Object.entries(fares || {});
      const [firstItem, firstValue] = entries[0];
      setCategory(firstItem);
      setFare(firstValue);
      setPaymentMethod("Cash");
    }
  }, [fares]);

  const handleAllCancel = async () => {
    if (status === "PENDING" || status === "REQUESTED") {
      handleShowAlert({
        title: "Info",
        message: `Are you sure want to cancel the ride?`,
        leftText: "No",
        rightText: "Yes",
        onRight: () => handleCancel,
      });
      handleHideAlert();
    } else if (status === "ASSIGNED" || status === "ACCEPTED") {
      const res = await driverStatus({ id });
      if (res.data?.positions) {
        const distance = getDistanceKm(location, res.data.positions);

        console.log("distance: ", distance);
        if (distance < 1) {
          setCancellationFee(50);

          showAlert({
            title: `Charges applicable: ₹50`,
            message: `Driver is nearby Are you sure want to cancel the ride?`,
            leftText: "No",
            rightText: "Yes",
          });
        }
      }
    }
  };

  return (
    <View style={styles.container}>
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
            style={[
              styles.option,
              category === item && styles.selectedOption,
              getOpacity(),
            ]}
            onPress={() => [setCategory(item), setFare(value)]}
            disabled={id > 0}
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
            <Text
              style={[
                styles.fare,
                category === item && styles.optionTextSelected,
              ]}
            >
              ₹{value}
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
              getOpacity(),
            ]}
            onPress={() => setPaymentMethod(method)}
            disabled={id > 0}
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

      {!id && (
        <TouchableOpacity
          style={[styles.button, getOpacity()]}
          onPress={onConfirm}
          disabled={id > 0 || !category || !fare}
        >
          <Text style={styles.buttonText}>Book Ride</Text>
        </TouchableOpacity>
      )}
      {id > 0 &&
        ["REQUESTED", "PENDING", "ASSIGNED", "ACCEPTED"].includes(status) && (
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => {
              handleAllCancel();
            }}
          >
            <Text style={styles.buttonText}>Cancel Ride</Text>
          </TouchableOpacity>
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
  fare: { fontSize: 12, color: "#555", marginBottom: 5 },
  label: { marginTop: 15, fontSize: 16, fontWeight: "500", marginBottom: 8 },
  row: {
    flexDirection: "row",
    gap: 10,
    margin: 3,
  },
  option: {
    flex: 1,
    padding: 3,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOption: { backgroundColor: "#007AFF" },
  optionText: {
    marginTop: 5,
    fontSize: 12,
    color: "#333",
    textTransform: "capitalize",
  },
  optionTextSelected: { color: "#fff" },
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
});
