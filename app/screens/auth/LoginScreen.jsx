import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { genOtp, verifyOtp } from "../../../scripts/api/userApi";
import AuthContext from "../../context/AuthContext";

export default function LoginScreen({ navigation }) {
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
      await saveToken(response.data);
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

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          position: "absolute",
          top: 100,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 30 }}>Welcome To</Text>
        <Text style={{ fontSize: 30, fontWeight: "700" }}>Taxi Taxi!</Text>
      </View>
      <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: "500" }}>
        Login with your Phone Number
      </Text>
      <TextInput
        placeholder="Ex. 9841232587"
        keyboardType="number-pad"
        returnKeyType="done"
        clearButtonMode="while-editing"
        value={phone}
        placeholderTextColor="#888"
        maxLength={10}
        onChangeText={setPhone}
        style={styles.input}
      />
      {generateOtp && (
        <TextInput
          placeholder="OTP"
          clearButtonMode="while-editing"
          returnKeyType="done"
          keyboardType="number-pad"
          placeholderTextColor="#888"
          value={otp}
          maxLength={6}
          onChangeText={setOtp}
          style={styles.input}
        />
      )}
      <View style={styles.roleRow}>
        {generateOtp ? (
          <>
            <TouchableOpacity
              onPress={() => verifyOtpI()}
              disabled={otp?.length !== 6}
              style={[
                styles.roleBtn,
                isValidOtp ? { backgroundColor: "grey" } : {},
              ]}
            >
              <Text style={styles.textWhite}>Verify</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => resendOtp()}
              style={[styles.roleBtn]}
            >
              <Text style={styles.textWhite}>Resend OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            disabled={phone?.length !== 10}
            onPress={() => triggerOtp()}
            style={[
              styles.roleBtn,
              isDisabled ? { backgroundColor: "grey" } : {},
            ]}
          >
            <Text style={[styles.textWhite]}>Send OTP</Text>
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={[styles.roleBtn]}
        >
          <Text>Signup</Text>
        </TouchableOpacity> */}
      </View>
      <View style={{ position: "absolute", bottom: 30 }}>
        <Text style={{ fontSize: 12, fontWeight: "600" }}>
          By Continuing, You Agree to Taxi Taxi's{" "}
          <Text style={{ color: "red" }}>Terms & Conditions</Text> And{" "}
          <Text style={{ color: "red" }}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
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
  roleRow: { flexDirection: "row", marginBottom: 12 },
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
