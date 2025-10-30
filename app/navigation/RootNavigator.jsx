import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import AuthContext from "../context/AuthContext";
import AuthStack from "../navigation/auth/AuthStack";
import DrawerScreens from "../screens/DrawerScreen";
import Favorites from "../screens/profile/Favorites";
import Notifications from "../screens/profile/Notifications";
import Payments from "../screens/profile/Payments";
import Profile from "../screens/profile/Profile";
import ProfileDetails from "../screens/profile/ProfileDetails";
import RideHistory from "../screens/profile/RideHistory";
import RideTracking from "../screens/RideTracking";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
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
    >
      {user ? (
        <>
          <Stack.Screen
            name="MainDrawer"
            component={DrawerScreens}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              title: "Profile",
            }}
          />
          <Stack.Screen
            name="ProfileDetails"
            component={ProfileDetails}
            options={{
              title: "Profile Details",
            }}
          />
          <Stack.Screen
            name="Payments"
            component={Payments}
            options={{ title: "Payments" }}
          />
          <Stack.Screen
            name="RideHistory"
            component={RideHistory}
            options={{ title: "My Rides" }}
          />
          <Stack.Screen
            name="Favorites"
            component={Favorites}
            options={{ title: "Favorites" }}
          />
          <Stack.Screen
            name="Notifications"
            component={Notifications}
            options={{ title: "Notifications" }}
          />
          <Stack.Screen
            name="Tracking"
            component={RideTracking}
            options={{
              StackBarIcon: ({ focused, color, size }) =>
                placeIcon("map-outline", focused, color, size),
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

const placeIcon = (icon, focused, color, size) => {
  return <Ionicons name={icon} size={size} color={color} />;
};
