import TouchableButton from "@/app/component/TouchableButton";
import { commonStyles } from "@/scripts/constants";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { genOtp } from "../../../scripts/api/userApi";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");

  const triggerOtp = async () => {
    try {
      await genOtp(phone);
      navigation.navigate("VerifyOtpScreen", { phone });
    } catch (error) {
      console.log(error);
    }
  };

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height + 200,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "" : ""}
      > */}
      <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
        <View style={commonStyles.container}>
          <View style={styles.header}>
            <Text style={styles.brandText}>Welcome to</Text>
          </View>
          <Image
            source={require("@/assets/images/taxitaxi-logo.png")}
            style={{
              width: "100%",
              height: 300,
            }}
          />
          <View style={[commonStyles.column]} className="flex-1 bg-slate-200">
            <Text style={styles.sectionTitle}>
              Login with your Phone Number
            </Text>
            <TextInput
              textContentType="telephoneNumber"
              placeholder="eg. 9841232587"
              keyboardType="number-pad"
              returnKeyType="done"
              clearButtonMode="always"
              value={phone}
              placeholderTextColor="#929292ff"
              maxLength={10}
              onChangeText={(txt) => {
                setPhone(txt.replaceAll("-", ""));
              }}
              allowFontScaling={false}
              style={[
                commonStyles.input,
                commonStyles.textAlignCenter,
                { backgroundColor: "#fff" },
              ]}
            />
            <View style={commonStyles.row}>
              <TouchableButton
                disabled={phone?.length !== 10}
                onPress={triggerOtp}
                style={[commonStyles.button]}
              >
                <Text style={[commonStyles.buttonText]}>Send OTP</Text>
              </TouchableButton>
            </View>
          </View>
          <Text style={styles.disclaimer}>
            By Continuing, You Agree to the Red Taxi's{" "}
            <Text style={styles.link}>Terms & Conditions</Text> And{" "}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </Animated.View>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: 28,
  },
  welcomeText: {
    fontSize: 16,
    color: "#555",
  },
  brandText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#111",
    marginTop: 4,
  },
  sectionTitle: {
    marginTop: 12,
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    color: "#555",
    marginTop: 18,
    paddingHorizontal: 15,
    lineHeight: 20,
  },
  link: {
    color: "#d12c2c",
    fontWeight: "700",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: { fontSize: 20, marginBottom: 12 },
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    textAlign: "center",
  },
  roleRow: { flexDirection: "row", justifyContent: "center" },
  roleBtn: {
    padding: 10,
    marginHorizontal: 6,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "#e72525ff",
    borderColor: "#fff",
  },
  roleActive: { backgroundColor: "#ddd" },
  hint: { marginTop: 12, color: "#666" },
  textWhite: {
    color: "#fff",
    fontWeight: "500",
  },
});
