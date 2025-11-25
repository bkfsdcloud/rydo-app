import SignUp from "@/app/screens/SignUp";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity } from "react-native";
import LoginScreen from "../../screens/auth/LoginScreen";
import VerifyOtpScreen from "../../screens/auth/VerifyOtpScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="VerifyOtpScreen"
        component={VerifyOtpScreen}
        options={({ navigation }) => ({
          title: "",
          headerLeft: () => (
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                margin: 10,
                borderRadius: "50%",
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons
                name="arrow-back-outline"
                size={22}
                color={"#000"}
              ></Ionicons>
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={({ navigation }) => ({
          title: "",
          headerLeft: () => (
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                margin: 10,
                borderRadius: "50%",
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons
                name="arrow-back-outline"
                size={22}
                color={"#000"}
              ></Ionicons>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
