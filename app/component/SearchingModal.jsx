import { commonStyles } from "@/scripts/constants";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useCallback, useState } from "react";
import { Modal, Text, View } from "react-native";
import { useRideStore } from "../store/useRideStore";
import CancelComponent from "./CancelComponent";
import TouchableButton from "./TouchableButton";

export default function SearchingModal({ visible }) {
  const navigation = useNavigation();
  const [showCancelTab, setShowCancelTab] = useState(false);
  const { resetRide, status } = useRideStore();

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

  return (
    <Modal visible={status === "PENDING" || status === "REQUESTED"} transparent>
      <CancelComponent
        visible={showCancelTab}
        onClose={handleCancel}
      ></CancelComponent>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.6)",
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 20, marginBottom: 12, color: "#fff" }}>
          Searching for drivers...
        </Text>

        <LottieView
          source={require("@/assets/animations/search.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <View style={commonStyles.row}>
          <TouchableButton
            style={[commonStyles.button]}
            onPress={() => setShowCancelTab(true)}
          >
            <Text style={[commonStyles.buttonText]}>Cancel Ride</Text>
          </TouchableButton>
        </View>
      </View>
    </Modal>
  );
}
