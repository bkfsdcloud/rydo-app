import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AppTabs from './AppTabs';
import AuthStack from './auth/AuthStack';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="App" component={AppTabs} />
      ) : (
      <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
