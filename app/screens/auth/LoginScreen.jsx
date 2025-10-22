import React, { useContext, useRef, useState } from "react";
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
  const otpRef = useRef(null);

  const { saveToken } = useContext(AuthContext);

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
      otpRef?.current?.focus();
      // Alert.alert('Success', response.data.message);
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
      await saveToken(response.data.data);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.message,
        position: "top",
      });
      // Alert.alert('Success', response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoFocus
        placeholder="Phone"
        keyboardType="numeric"
        // maxLength="10"
        value={phone}
        placeholderTextColor="#888"
        onChangeText={setPhone}
        style={styles.input}
      />
      {generateOtp && (
        <TextInput
          ref={otpRef}
          placeholder="OTP"
          // maxLength="6"
          keyboardType="numeric"
          placeholderTextColor="#888"
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
        />
      )}
      <View style={styles.roleRow}>
        {generateOtp ? (
          <>
            <TouchableOpacity
              onPress={() => verifyOtpI()}
              style={[styles.roleBtn]}
            >
              <Text>Verify</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => resendOtp()}
              style={[styles.roleBtn]}
            >
              <Text>Resend OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={() => triggerOtp()}
            style={[styles.roleBtn]}
          >
            <Text>Generate OTP</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={[styles.roleBtn]}
        >
          <Text>Signup</Text>
        </TouchableOpacity>
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
  },
  roleRow: { flexDirection: "row", marginBottom: 12 },
  roleBtn: {
    padding: 10,
    marginHorizontal: 6,
    borderWidth: 1,
    borderRadius: 6,
  },
  roleActive: { backgroundColor: "#ddd" },
  hint: { marginTop: 12, color: "#666" },
});
