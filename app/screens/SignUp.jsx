import { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { signUp } from '../../scripts/api/userApi';

export default function SignUp({navigation}) {

    const [user, setUser] = useState({});
    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const updateUser = (field, value) => {
        setUser(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (!user.phone) {
              Alert.alert('Error', 'Please provide phone number');
              return;
            }

            const response = await signUp({...user, role: isEnabled ? 'CUSTOMER' : 'DRIVER'});
            if (response.data.status === 'SUCCESS') {
              // Alert.alert('Success', response.data.message);
              Toast.show({type: 'success', text1: 'Success', text2: response.data.message, position: 'top', });
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
      <View style={styles.row}>
      <Text>Rider</Text>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      </View>

      <View style={styles.roleRow}>

      <TouchableOpacity onPress={() => [setUser({}), Toast.show({type: 'success', text1: 'Success', text2: 'Test', position: 'top', })]} style={[styles.roleBtn]}>
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
  hint:{ marginTop:12, color:'#666' },
  row: {justifyContent: 'space-around', alignSelf: 'flex-start'},
});