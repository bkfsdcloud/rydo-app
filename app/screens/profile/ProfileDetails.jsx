import AuthContext from "@/app/context/AuthContext";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ProfileDetails() {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Information</Text>
      <View style={styles.groupContainer}>
      <View style={styles.row}>
         <Text style={styles.label}>Name </Text>
         <Text style={styles.data}>{user.name}</Text>
      </View>
      <View style={styles.row}>
         <Text style={styles.label}>Email </Text>
         <Text style={{...styles.data, color: !user.email ? 'grey': '#000'}}>{user.email || 'Not Set'}</Text>
      </View>
      <View style={styles.row}>
         <Text style={styles.label}>Phone </Text>
         <Text style={styles.data}>+91 {user.phone}</Text>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: 'center' },
  row: {justifyContent: 'space-around',borderBottomWidth: 1,borderColor: 'grey', padding: 10},
  groupContainer: {borderWidth: 1, borderColor: '#fff', borderRadius: '25'},
  label: {fontSize: 10, color: 'grey'},
  data: {fontWeight: "500"}
});
