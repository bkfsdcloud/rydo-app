// components/LoadingModal.js
import { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LoadingContext } from '../context/LoadingContext';

export default function LoadingModal() {
  const { loading } = useContext(LoadingContext);

  return (
    <Modal transparent visible={loading}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
