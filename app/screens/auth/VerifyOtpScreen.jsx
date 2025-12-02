import TouchableButton from "@/app/component/TouchableButton";
import AuthContext from "@/app/context/AuthContext";
import { genOtp, verifyOtp } from "@/scripts/api/userApi";
import { commonStyles } from "@/scripts/constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VerifyOtpScreen = () => {
  const route = useRoute();
  const { phone } = route.params;
  const navigation = useNavigation();

  const [time, setTime] = useState(30);
  const timeValueRef = useRef(null);
  const timerRef = useRef(null);

  const { saveToken } = useContext(AuthContext);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    if (!timerRef.current) startTimer();
    return () => {
      if (timerRef.current) {
        console.log("Clearing otp timer");
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timeValueRef.current = 30;
    timerRef.current = setInterval(() => {
      if (timeValueRef.current > 0) {
        timeValueRef.current -= 1;
        setTime(timeValueRef.current);
      } else {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 1000);
  }, []);

  const onChangeText = (text, idx) => {
    if (text && text.length > 0) {
      const v = text.charAt(0);
      const nextOtp = otp.slice();
      nextOtp[idx] = v;
      setOtp(nextOtp);
      if (idx < 5) {
        inputRefs[idx + 1].current && inputRefs[idx + 1].current.focus();
      }
    } else {
      // handle deletion
      const nextOtp = otp.slice();
      nextOtp[idx] = "";
      setOtp(nextOtp);
    }
  };

  const handleKeyPress =
    (idx) =>
    ({ nativeEvent }) => {
      if (nativeEvent.key === "Backspace" && otp[idx] === "" && idx > 0) {
        inputRefs[idx - 1].current && inputRefs[idx - 1].current.focus();
      }
    };

  const triggerOtp = async () => {
    try {
      startTimer();
      const response = await genOtp(phone);
      if (response.data.message) {
        setOtp(["", "", "", "", "", ""]);
        Alert.alert("Infomation", response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOtpValue = () => {
    return otp.join("");
  };

  const verifyOtpInt = async () => {
    try {
      const response = await verifyOtp(phone, getOtpValue());
      if (response.data?.token) {
        await saveToken(response.data);
        return;
      } else if (response.data.message === "New user") {
        navigation.replace("SignUp", { phone });
        return;
      }
      Alert.alert("Infomation", response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      > */}
      <View style={styles.container}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Please Enter the OTP Sent to your Phone.
        </Text>

        <View style={styles.otpRow}>
          {otp.map((val, i) => (
            <TextInput
              key={i}
              ref={inputRefs[i]}
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              value={val}
              onChangeText={(text) => onChangeText(text, i)}
              onKeyPress={handleKeyPress(i)}
              returnKeyType="done"
              textAlign="center"
            />
          ))}
        </View>

        <View style={styles.bottomSpacer} />

        <View style={styles.bottomBar}>
          <TouchableButton
            style={commonStyles.button}
            disabled={time !== 0}
            onPress={triggerOtp}
          >
            <Text style={styles.buttonText}>
              Resend OTP {time > 0 ? `(${time}s)` : ""}
            </Text>
          </TouchableButton>
          <TouchableButton
            style={commonStyles.button}
            disabled={getOtpValue()?.length !== 6}
            onPress={verifyOtpInt}
          >
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableButton>
        </View>
      </View>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginHorizontal: 16,
    color: "#111",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 16,
    marginTop: 6,
  },
  otpRow: {
    marginTop: 18,
    marginHorizontal: 10,
    flexDirection: "row",
  },
  otpBox: {
    width: 45,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    textAlignVertical: "center",
    textAlign: "center",
    marginHorizontal: 5,
    fontSize: 20,
    color: "#000",
  },
  bottomBar: {
    flexDirection: "row",
    flex: 1,
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  btnGrey: {
    flex: 1,
    height: 56,
    backgroundColor: "#d0d0d0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  btnGreyText: {
    color: "#fff",
    fontWeight: "600",
  },
  btnRed: {
    flex: 1,
    height: 56,
    backgroundColor: "#e53935",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnRedText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 12,
  },
});
