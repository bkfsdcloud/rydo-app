import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PhoneBooking() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        You can View the Support Team Phone Numbers for the Following Cities.
      </Text>
      <View style={{ flex: 1, marginTop: 10 }}>
        <View>
          <Text>Coimbatore</Text>
          <TouchableOpacity style={styles.phoneNumberButton}>
            <Text style={styles.buttonText}>0422-4455667</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  phoneNumberButton: {
    backgroundColor: "#fff",
    borderColor: "red",
    borderWidth: 1,
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "red",
    padding: 5,
    fontWeight: "400",
    fontSize: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: "400",
    paddingTop: 5,
    color: "grey",
  },
});
