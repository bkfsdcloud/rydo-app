import { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WebSocketTest from '../../component/webSocketTest';
import AuthContext from '../../context/AuthContext';

export default function DriverHome() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <View style={{flex: 0.2,alignItems:'center',flexDirection: 'row',justifyContent:'space-evenly'}}>
        <Text>Welcome, {user.name}</Text>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text>Driver features (accept ride, go online) to be implemented.</Text>
      </View>

      <WebSocketTest></WebSocketTest>
    </>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', alignItems:'center' },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  }
});
