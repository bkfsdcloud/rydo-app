import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AuthStack from './auth/AuthStack';
import RiderTabs, { AdminTabs, DriverTabs } from './UserTabs';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          {
            user.role === 'CUSTOMER' && <Stack.Screen name="Rider" component={RiderTabs} />
          }
          {
            user.role === 'DRIVER' && <Stack.Screen name="Driver" component={DriverTabs} />
          }
          {
            user.role === 'ADMIN' && <Stack.Screen name="Admin" component={AdminTabs} />
          }
        </>
      ) : (
      <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
