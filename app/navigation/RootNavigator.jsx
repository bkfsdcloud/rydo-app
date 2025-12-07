import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { TouchableOpacity } from "react-native";
import CarNavigation from "../component/CarNavigation";
import AuthContext from "../context/AuthContext";
import AuthStack from "../navigation/auth/AuthStack";
import Approvals from "../screens/admin/Approvals";
import DocumentManagement from "../screens/admin/DocumentManagement";
import Reports from "../screens/admin/Reports";
import DrawerScreens from "../screens/DrawerScreen";
import PaymentScreen from "../screens/payment/PaymentScreen";
import ChatScreen from "../screens/profile/ChatScreen";
import EditProfile from "../screens/profile/EditProfile";
import Favorites from "../screens/profile/Favorites";
import Notifications from "../screens/profile/Notifications";
import Payments from "../screens/profile/Payments";
import Profile from "../screens/profile/Profile";
import ProfileDetails from "../screens/profile/ProfileDetails";
import RideHistory from "../screens/profile/RideHistory";
import RideHistoryDetail from "../screens/profile/RideHistoryDetail";
import Wallet from "../screens/profile/Wallet";
import PayFromWalletScreen from "../screens/profile/wallet/PayFromWalletScreen";
import WalletTransaction from "../screens/profile/WalletTransaction";
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
      {user?.token ? (
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
            name="EditProfile"
            component={EditProfile}
            options={{
              title: "Edit Profile",
            }}
          />
          <Stack.Screen
            name="ProfileDetails"
            component={ProfileDetails}
            options={{
              title: "Profile",
            }}
          />
          <Stack.Screen
            name="Payments"
            component={Payments}
            options={{ title: "Payment Methods" }}
          />
          <Stack.Screen
            name="PaymentScreen"
            component={PaymentScreen}
            options={{ title: "Payment" }}
          />

          <Stack.Screen
            name="RideHistory"
            component={RideHistory}
            options={{ title: "Ride History" }}
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
            name="Wallet"
            component={Wallet}
            options={{ title: "Wallet" }}
          />
          <Stack.Screen
            name="WalletTransaction"
            component={WalletTransaction}
            options={{ title: "Transaction History" }}
          />

          <Stack.Screen
            name="PayFromWalletScreen"
            component={PayFromWalletScreen}
            options={{ title: "Pay From Wallet" }}
          />
          <Stack.Screen
            name="CarNavigation"
            component={CarNavigation}
            options={{ title: "Navigation" }}
          />

          <Stack.Screen
            name="RideHistoryDetail"
            component={RideHistoryDetail}
            options={{ title: "Ride Details" }}
          />

          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{ title: "User Chat" }}
          />

          <Stack.Screen
            name="Tracking"
            component={RideTracking}
            options={{
              StackBarIcon: ({ focused, color, size }) =>
                placeIcon("map-outline", focused, color, size),
            }}
          />

          <Stack.Screen
            name="Approvals"
            component={Approvals}
            options={{
              title: "Approvals",
            }}
          />
          <Stack.Screen
            name="Reports"
            component={Reports}
            options={{
              title: "Analytics & Reports",
            }}
          />
          <Stack.Screen
            name="DocumentManagement"
            component={DocumentManagement}
            options={{
              title: "Document Management",
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
