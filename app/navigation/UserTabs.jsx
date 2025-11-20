import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import RiderStack from "../navigation/RiderStack";
import AdminDashboard from "../screens/admin/AdminDashboard";
import DriverHome from "../screens/driver/DriverHome";

const Stack = createNativeStackNavigator();

export default function RiderStacks() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RiderStack"
        component={RiderStack}
        options={{
          headerShown: false,
          StackBarIcon: ({ focused, color, size }) =>
            placeIcon("golf-outline", focused, color, size),
        }}
      />
    </Stack.Navigator>
  );
}

export function DriverStacks() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Driver"
        component={DriverHome}
        options={{
          headerShown: false,
          StackBarIcon: ({ focused, color, size }) =>
            placeIcon("car-outline", focused, color, size),
        }}
      />
    </Stack.Navigator>
  );
}

export function AdminStacks() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{
          StackBarIcon: ({ focused, color, size }) =>
            placeIcon("settings-outline", focused, color, size),
        }}
      />
    </Stack.Navigator>
  );
}

const placeIcon = (icon, focused, color, size) => {
  return <Ionicons name={icon} size={size} color={color} />;
};
