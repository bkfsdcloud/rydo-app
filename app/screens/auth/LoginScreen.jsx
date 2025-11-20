import { commonStyles } from "@/scripts/constants";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { genOtp, verifyOtp } from "../../../scripts/api/userApi";
import AuthContext from "../../context/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generateOtp, setGenerateOtp] = useState(false);

  const { saveToken } = useContext(AuthContext);

  const isDisabled = phone.trim().length !== 10;
  const isValidOtp = otp.trim().length !== 6;

  const resendOtp = async () => {
    setGenerateOtp(false);
    setOtp("");
    triggerOtp();
  };

  const triggerOtp = async () => {
    if (!phone) {
      Alert.alert("Error", "Please provide phone number");
      return;
    }
    try {
      const response = await genOtp(phone);
      setGenerateOtp(true);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.message,
        position: "top",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtpI = async () => {
    if (!otp) {
      Alert.alert("Error", "Please provide OTP");
      return;
    }
    try {
      const response = await verifyOtp(phone, otp);
      if (response.data?.token) {
        await saveToken(response.data);
      } else if (response.data.message === "New user") {
        navigation.navigate("SignUp", { phone });
      }
      // Toast.show({
      //   type: "success",
      //   text1: "Success",
      //   text2: response.data.message,
      //   position: "top",
      // });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={commonStyles.container}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.brandText}>Taxi Taxi!</Text>
          </View>
          {/* <Image
            source={require("@/assets/images/car-img-2.png")}
            style={{ height: 300, width: "100%" }}
          ></Image> */}
          <View style={[commonStyles.column]}>
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
              maxLength={11}
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
            {generateOtp && (
              <TextInput
                placeholder="OTP"
                clearButtonMode="always"
                textContentType="oneTimeCode"
                returnKeyType="done"
                keyboardType="number-pad"
                placeholderTextColor="#929292ff"
                value={otp}
                maxLength={6}
                allowFontScaling={false}
                onChangeText={setOtp}
                style={[
                  commonStyles.input,
                  commonStyles.textAlignCenter,
                  { backgroundColor: "#fff" },
                ]}
              />
            )}
            <View style={commonStyles.row}>
              {generateOtp ? (
                <>
                  <TouchableOpacity
                    onPress={() => verifyOtpI()}
                    disabled={otp?.length !== 6}
                    style={[
                      commonStyles.button,
                      isValidOtp ? { backgroundColor: "grey" } : {},
                    ]}
                  >
                    <Text style={commonStyles.buttonText}>Verify</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => resendOtp()}
                    style={[commonStyles.button]}
                  >
                    <Text style={commonStyles.buttonText}>Resend OTP</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  disabled={phone?.length !== 10}
                  onPress={() => triggerOtp()}
                  style={[
                    commonStyles.button,
                    isDisabled ? commonStyles.disabled : {},
                  ]}
                >
                  <Text style={[commonStyles.buttonText]}>Send OTP</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Text style={styles.disclaimer}>
            By Continuing, You Agree to the Red Taxi's{" "}
            <Text style={styles.link}>Terms & Conditions</Text> And{" "}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </>
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
    paddingHorizontal: 20,
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
