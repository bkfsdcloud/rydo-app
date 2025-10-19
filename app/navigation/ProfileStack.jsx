import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favorites from "../screens/profile/Favorites";
import Notifications from "../screens/profile/Notifications";
import Payments from "../screens/profile/Payments";
import Profile from "../screens/profile/Profile";
import ProfileDetails from "../screens/profile/ProfileDetails";
import RideHistory from "../screens/profile/RideHistory";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#fff" },
        headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="ProfileDetails"
        component={ProfileDetails}
        options={{ title: "Profile Details" }}
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
        
    </Stack.Navigator>
  );
}
