import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import RiderHome from '../screens/RiderHome';
import RideTracking from '../screens/RideTracking';
import WebSocketTest from '../utils/webSocketTest';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Rider" component={RiderHome} />
      <Tab.Screen name="Driver" component={WebSocketTest} />
      <Tab.Screen name="Tracking" component={RideTracking} />
    </Tab.Navigator>
  );
}
