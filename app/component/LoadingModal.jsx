// components/LoadingModal.js
import { useContext } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import LoadingContext from '../context/LoadingContext';

export default function LoadingModal() {
  const { loading } = useContext(LoadingContext);

  return (
    <Modal transparent visible={loading} animationType="fade">
      <View style={styles.container}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderBox: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
  },
});
