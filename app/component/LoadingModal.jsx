// components/LoadingModal.js
import { useContext } from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import LoadingContext from "../context/LoadingContext";

export default function LoadingModal() {
  const { visible, message, button, callback } = useContext(LoadingContext);

  return (
    <Modal transparent visible={visible} animationType="fade">
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
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderBox: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 10,
  },
  message: {
    color: "#fff",
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#ff4d4d",
    marginTop: 20,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  cancelText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
