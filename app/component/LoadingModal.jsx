// components/LoadingModal.js
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { useLoading } from "../context/LoadingContext";

export default function LoadingModal() {
  const { loadingCount } = useLoading();

  return (
    <Modal transparent visible={loadingCount > 0} animationType="fade">
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
