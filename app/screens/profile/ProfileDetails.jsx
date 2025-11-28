import AuthContext from "@/app/context/AuthContext";
import useUserStore from "@/app/store/useUserStore";
import { updateLastLocation } from "@/scripts/api/userApi";
import { commonStyles } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileDetails() {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const { driverStatus } = useUserStore();

  const updateAndLogout = async () => {
    if (user?.role === "DRIVER") {
      const body = {
        lat: location.lat,
        lng: location.lng,
        status: driverStatus || "ACTIVE",
      };
      await updateLastLocation(body);
    }
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.groupContainer}>
        <View style={commonStyles.row}>
          <Text style={styles.title}>Personal Information</Text>
          <Ionicons
            name="create-outline"
            color={"red"}
            size={22}
            onPress={() => navigation.navigate("EditProfile")}
          />
        </View>
        <View style={[styles.row]}>
          <Text style={styles.label}>Name </Text>
          <Text style={styles.data}>{user.name}</Text>
        </View>
        <View style={styles.splitter}></View>
        <View style={[styles.row]}>
          <Text style={styles.label}>Email </Text>
          <Text
            style={{ ...styles.data, color: !user.email ? "grey" : "#000" }}
          >
            {user.email || "Not Set"}
          </Text>
        </View>
        <View style={styles.splitter}></View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone </Text>
          <Text style={styles.data}>+91 {user.phone}</Text>
        </View>
      </View>
      <View style={styles.groupContainer}>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.cardItem]} onPress={updateAndLogout}>
            <Ionicons
              name="log-out-outline"
              size={22}
              color="#000"
              style={styles.cardIcon}
            />
            <Text style={styles.cardItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.splitter}></View>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.cardItem]} onPress={() => {}}>
            <Ionicons
              name="trash-outline"
              style={styles.cardIcon}
              size={20}
              color="#000"
            />
            <Text style={[styles.cardItemText, commonStyles.textColorRed]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#ecebebff" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  row: {
    justifyContent: "space-around",
    borderColor: "grey",
    padding: 10,
  },
  groupContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    padding: 10,
  },
  splitter: {
    borderBottomWidth: 1,
    borderBottomColor: "#c4c3c3ff",
  },
  label: { fontSize: 10, color: "grey" },
  data: { fontWeight: "500" },
  card: {},
  cardItem: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
  },
  cardItemText: {
    color: "#000",
    marginTop: 3,
    fontWeight: "500",
  },
  cardIcon: {
    marginRight: 10,
  },
});
