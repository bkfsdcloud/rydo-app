import React, { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import AuthContext from '../../app/context/AuthContext';

export default function DriverHome() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize:18 }}>Driver Dashboard</Text>
      <Text>Welcome, {user.name}</Text>
      <Button title="Logout" onPress={logout} />
      <Text style={{ marginTop:12 }}>Driver features (accept ride, go online) to be implemented.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', alignItems:'center' }
});
