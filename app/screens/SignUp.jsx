import { createWallet } from "@/scripts/api/miscApi";
import { commonStyles } from "@/scripts/constants";
import { useRoute } from "@react-navigation/native";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { signUp } from "../../scripts/api/userApi";
import BottomPanel from "../component/BottomPanel";
import AuthContext from "../context/AuthContext";

export default function SignUp({ navigation }) {
  const { saveToken } = useContext(AuthContext);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const updateUser = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const route = useRoute();
  const sheetRef = useRef(null);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function initNotifications() {
      // const result = await registerForPushNotificationsAsync();
      if (route.params?.phone) {
        updateUser("phone", route.params?.phone);
      }
      // if (result) {
      //   updateUser("deviceId", result.token);
      //   console.log(`Registered with ${result.provider} token:`, result.token);
      // }
    }
    initNotifications();
    sheetRef.current.expand();

    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height + 50,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const handleSubmit = async () => {
    try {
      if (!newUser.name) {
        Alert.alert("Error", "Username is required");
        return;
      }
      if (!newUser.email) {
        Alert.alert("Error", "Email ID is required");
        return;
      }

      const response = await signUp({
        ...newUser,
        role: "RIDER",
      });
      console.log("status: ", response.status);
      if (response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: response.data.message,
          position: "top",
        });
        createWallet({});
        await saveToken(response.data);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
      <BottomPanel ref={sheetRef} title={"Profile Details"}>
        <View style={styles.container}>
          <TextInput
            placeholder="Username"
            name="name"
            autoCorrect={false}
            keyboardType="name-phone-pad"
            clearButtonMode="always"
            placeholderTextColor="#888"
            value={newUser.name}
            onChangeText={(value) => updateUser("name", value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Email ID"
            name="email"
            autoCorrect={false}
            keyboardType="email-address"
            clearButtonMode="always"
            placeholderTextColor="#888"
            value={newUser.email}
            onChangeText={(value) => updateUser("email", value)}
            style={styles.input}
          />

          <View style={commonStyles.row}>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[commonStyles.button]}
            >
              <Text style={commonStyles.textWhite}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomPanel>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 20, marginBottom: 12 },
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
  },
  createBtn: {
    flexDirection: "row",
    backgroundColor: "#e72525ff",
    flex: 1,
    borderColor: "#fff",
    padding: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 6,
  },
  btnRow: {
    flex: 1,
    marginTop: 20,
  },
  row: { justifyContent: "space-around", alignSelf: "flex-start" },
});
