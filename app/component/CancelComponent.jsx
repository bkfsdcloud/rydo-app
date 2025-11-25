import { commonStyles } from "@/scripts/constants";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  cancelRide,
  driverStatus,
  updateStatus,
} from "../../scripts/api/riderApi";
import useMessageStore from "../store/useMessageStore";
import { useRideStore } from "../store/useRideStore";

import { makeTransaction } from "@/scripts/api/miscApi";
import { getDistanceKm } from "@/scripts/GeoUtil";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import LocationContext from "../context/LocationContext";

export default function CancelComponent({ visible, onClose }) {
  const { reasons, rejectReasons } = useMessageStore();
  const { id, status, origin } = useRideStore();
  const { user } = useContext(AuthContext);
  const { location } = useContext(LocationContext);

  const [selectedMessage, setSelectedMessage] = useState(0);
  const [cancellationFee, setCancellationFee] = useState(0);

  const isRejectFlow = () => status === "REQUESTED" && user?.role === "DRIVER";

  useEffect(() => {
    if (!visible) return;
    handleAllCancel();
  }, [status, id]);

  const handleAllCancel = useCallback(async () => {
    if (status === "ARRIVED" || status === "ASSIGNED") {
      const res = await driverStatus({ id });

      if (res.data?.positions) {
        const distance = getDistanceKm(
          location,
          user?.role === "DRIVER" ? origin?.coords : res.data?.positions
        );

        if (distance < 1) {
          setCancellationFee(50);
        }
      }
    }
  }, [status, id, user?.role, origin?.coords, location]);

  const handleCancel = async () => {
    if (isRejectFlow()) {
      await updateStatus({
        rideData: { id, reason: selectedMessage, status: "REJECTED" },
      });
    } else {
      if (status === "REQUESTED" || status === "PENDING") {
        await cancelRide({
          rideData: { id, status },
          reason: selectedMessage,
        });
      } else if (status === "ARRIVED" || status === "ASSIGNED") {
        await cancelRide({
          rideData: { id, status },
          reason: selectedMessage,
          cancellationFee,
        });
        const walletPayload = {
          referenceId: id,
          amount: -cancellationFee,
          type: "ADMIN_ADJUSTMENT",
          paymentMethod: "WALLET",
          remarks: `Ride Cancellation charge`,
        };

        makeTransaction(walletPayload);
      }
    }
    onClose(true);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            width: "80%",
            padding: 15,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={commonStyles.column}>
              <Text style={[commonStyles.title, { paddingTop: 0 }]}>
                Reason:
              </Text>
              {cancellationFee > 0 && (
                <Text style={[commonStyles.title, { marginBottom: 5 }]}>
                  Charges applicable: ₹{cancellationFee}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => onClose()}
              style={{
                padding: 10,
                paddingRight: 0,
                paddingTop: 0,
                backgroundColor: "#fff",
                borderRadius: 8,
              }}
            >
              <Ionicons name="close-circle" size={20}></Ionicons>
            </TouchableOpacity>
          </View>

          <Dropdown
            style={styles.dropdown}
            data={isRejectFlow() ? rejectReasons : reasons}
            labelField="reason"
            renderItem={(item, selected) => (
              <View style={{ flex: 1 }}>
                <Text
                  style={{ padding: 10, fontWeight: selected ? "600" : "400" }}
                >
                  {item?.reason}
                </Text>
              </View>
            )}
            valueField="id"
            placeholder="Select Reason"
            value={selectedMessage}
            onChange={(item) => setSelectedMessage(item.id)}
          />

          <TouchableOpacity
            onPress={handleCancel}
            disabled={!selectedMessage}
            style={[
              commonStyles.button,
              {
                flex: 0,
                opacity: !selectedMessage ? 0.5 : 1,
                backgroundColor: "#000",
              },
            ]}
          >
            <Text style={commonStyles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
});
