import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LocationPick from "../screens/LocationPick";
import LocationSearch from "../screens/LocationSearch";
import PhoneBooking from "../screens/PhoneBooking";
import RideBooking from "../screens/rider/RideBooking";
import RiderHome from "../screens/rider/RiderHome";

const Stack = createNativeStackNavigator();

export default function RiderStack() {
  return (
    <Stack.Navigator
      initialRouteName="RiderHome"
      screenOptions={{
        headerBackButtonDisplayMode: "generic",
        headerStyle: { backgroundColor: "#fff" },
        headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      }}
    >
      <Stack.Screen
        name="RiderHome"
        component={RiderHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LocationSearch"
        component={LocationSearch}
        options={{ title: "Choose Pick Up Location", headerShown: true }}
      />
      <Stack.Screen
        name="LocationPick"
        component={LocationPick}
        options={{ title: "Select Location" }}
      />
      <Stack.Screen
        name="PhoneBooking"
        component={PhoneBooking}
        options={{ title: "Phone Booking" }}
      />
      <Stack.Screen
        name="RideBooking"
        component={RideBooking}
        options={{ title: "Ride Booking", headerShown: false }}
      />
      {/* <Stack.Screen
        name="ReviewBooking"
        component={ReviewBooking}
        options={{ title: "One Way Trip", headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
}
