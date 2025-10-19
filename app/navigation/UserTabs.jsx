import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import ProfileStack from '../navigation/ProfileStack';
import AdminDashboard from '../screens/admin/AdminDashboard';
import DriverHome from '../screens/driver/DriverHome';
import RiderHome from '../screens/rider/RiderHome';
import RideTracking from '../screens/RideTracking';

const Tab = createBottomTabNavigator();

export default function RiderTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Ride" component={RiderHome} options={{tabBarIcon: ({ focused, color, size }) => placeIcon('golf-outline',focused, color, size)}} />
      <Tab.Screen name="Tracking" component={RideTracking} options={{tabBarIcon: ({ focused, color, size }) => placeIcon('map-outline',focused, color, size)}}/>
      <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ unmountOnBlur: true, title: 'Profile', headerShown: false, tabBarIcon: ({ focused, color, size }) => placeIcon('person-outline',focused, color, size)}} />
    </Tab.Navigator>
  );
}

export function DriverTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Driver" component={DriverHome} options={{tabBarIcon: ({ focused, color, size }) => placeIcon('car-outline',focused, color, size)}}/>
      <Tab.Screen name="Tracking" component={RideTracking} options={{tabBarIcon: ({ focused, color, size }) => placeIcon('map-outline',focused, color, size)}}/>
      <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Profile', headerShown: false, tabBarIcon: ({ focused, color, size }) => placeIcon('person-outline',focused, color, size)}} />
    </Tab.Navigator>
  );
}

export function AdminTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={AdminDashboard} options={{tabBarIcon: ({ focused, color, size }) => placeIcon('settings-outline',focused, color, size)}}/>
      <Tab.Screen name="Tracking" component={RideTracking} options={{tabBarIcon: ({ focused, color, size }) => placeIcon('map-outline',focused, color, size)}}/>
      <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Profile', headerShown: false, tabBarIcon: ({ focused, color, size }) => placeIcon('person-outline',focused, color, size)}} />
    </Tab.Navigator>
  );
}

const placeIcon = (icon, focused, color, size) => {
   return ( <Ionicons
                  name={icon}
                  size={size}
                  color={color}
                />
              );
};