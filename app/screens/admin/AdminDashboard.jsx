import { StyleSheet, Text, View } from 'react-native';

export default function AdminDashboard() {
  return (
    <>
      <View style={styles.container}>
        <Text>Admin Dashboard will appear here.</Text>
      </View>
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
