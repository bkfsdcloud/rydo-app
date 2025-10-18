import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signUp } from '../api/userApi';

export default function SignUp({navigation}) {

    const [user, setUser] = useState({});

    const updateUser = (field, value) => {
        setUser(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (!user.phone) {
              Alert.alert('Error', 'Please provide phone number');
              return;
            }

            const response = await signUp(user);
            if (response.data.status === 'SUCCESS') {
              Alert.alert('Success', response.data.message);
              setUser({});
              navigation.navigate('Login');
            } else {
              Alert.alert('Error', response.data.message);
            }
        } catch (error) {
          console.log(error);
        }
    };

     return (
    <View style={styles.container}>
      <Text style={styles.title}>Rydo SignUp</Text>
      <TextInput
        placeholder="Username"
        name="name"
        placeholderTextColor="#888"
        value={user.name}
        onChangeText={value => updateUser('name', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        name="phone"
        keyboardType="numeric"
        placeholderTextColor="#888"
        value={user.phone}
        onChangeText={value => updateUser('phone', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email [Optional]"
        name="email"
        placeholderTextColor="#888"
        value={user.email}
        onChangeText={value => updateUser('email', value)}
        style={styles.input}
      />

      <View style={styles.roleRow}>

      <TouchableOpacity onPress={() => setUser({})} style={[styles.roleBtn]}>
        <Text>Clear</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSubmit} style={[styles.roleBtn]}>
        <Text>SignUp</Text>
      </TouchableOpacity>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', alignItems:'center', padding:16 },
  title:{ fontSize:20, marginBottom:12 },
  input:{ width:'100%', borderWidth:1, padding:8, marginBottom:12, borderRadius:6 },
  roleRow:{ flexDirection:'row', marginBottom:12 },
  roleBtn:{ padding:10, marginHorizontal:6, borderWidth:1, borderRadius:6 },
  roleActive:{ backgroundColor:'#ddd' },
  hint:{ marginTop:12, color:'#666' }
});