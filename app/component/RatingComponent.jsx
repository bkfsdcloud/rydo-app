import { commonStyles } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { rateRide } from "../../scripts/api/miscApi";
import AuthContext from "../context/AuthContext";
import useMessageStore from "../store/useMessageStore";

export default function RatingComponent({
  rideId,
  riderId,
  driverId,
  onClose,
}) {
  const [rating, setRating] = useState(0);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [feedback, setFeedback] = useState("");

  const { user: userInfo } = useContext(AuthContext);
  const { both, driver, user } = useMessageStore();
  // const { id, driverId, riderId } = useRideStore();
  // const { rideInfo } = useUserStore();

  const filteredMessages = [
    ...both,
    ...(userInfo?.role === "DRIVER" ? driver : user),
  ];

  const toggleMessage = (id) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const onSubmit = async () => {
    const body = {
      rideId: rideId,
      ratedId: user?.role === "DRIVER" ? riderId : driverId,
      rating,
      feedback,
      messages: selectedMessages,
    };
    console.log("Rating body : ", body);
    const response = await rateRide(body);
    if (response?.data) {
      onClose();
      // Alert.alert("Info", response?.message);
    }
  };

  return (
    <View style={{ padding: 10 }}>
      {/* <View style={{ paddingBottom: 10 }}>
        <Text style={commonStyles.title}>Rate Your Ride</Text>
      </View> */}
      {/* ⭐ Rating Selector */}
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={32}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Messages */}
      <Text style={commonStyles.title}>Reason</Text>

      <FlatList
        data={filteredMessages}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleMessage(item.id)}
            style={{
              padding: 10,
              margin: 5,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: selectedMessages.includes(item.id) ? "blue" : "#ccc",
            }}
          >
            <Text>{item.message}</Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        placeholder="Additional feedback (optional)"
        placeholderTextColor={"grey"}
        value={feedback}
        onChangeText={setFeedback}
        style={{
          padding: 10,
          marginTop: 15,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
        }}
      />

      <TouchableOpacity
        onPress={onSubmit}
        style={{
          marginTop: 20,
          padding: 14,
          backgroundColor: "black",
          borderRadius: 8,
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
