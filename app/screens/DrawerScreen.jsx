import { createDrawerNavigator } from "@react-navigation/drawer";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import RiderStacks, { AdminStacks, DriverStacks } from "../navigation/UserTabs";
import Profile from "../screens/profile/Profile";

const Drawer = createDrawerNavigator();

export default function DrawerScreens() {
  const { user } = useContext(AuthContext);

  const getTabs = () => {
    console.log("Role : ", user?.role);
    switch (user?.role) {
      case "RIDER":
        return RiderStacks;
      case "DRIVER":
        return DriverStacks;
      default:
        return AdminStacks;
    }
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <Profile {...props} />}
      screenOptions={{
        drawerType: "slide",
        swipeEnabled: true,
        headerShown: false,
      }}
    >
      <Drawer.Screen name="HomeTabs" component={getTabs()} />
    </Drawer.Navigator>
  );
}
