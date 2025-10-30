import { createDrawerNavigator } from "@react-navigation/drawer";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import {
  default as AdminTabs,
  default as DriverTabs,
  default as RiderTabs,
} from "../navigation/UserTabs";
import Profile from "../screens/profile/Profile";

const Drawer = createDrawerNavigator();

export default function DrawerScreens() {
  const { user } = useContext(AuthContext);

  const getTabs = () => {
    switch (user?.role) {
      case "CUSTOMER":
        return RiderTabs;
      case "DRIVER":
        return DriverTabs;
      default:
        return AdminTabs;
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
