import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState({
    title: "",
    message: "",
    leftButtonTitle: "Cancel",
    rightButtonTitle: "OK",
  });

  // 🔥 Store callbacks in a ref to avoid freezes
  const callbackRef = useRef({
    onLeft: () => {},
    onRight: () => {},
  });

  const hideAlert = useCallback(() => {
    setVisible(false);
  }, []);

  const showAlert = useCallback((config) => {
    // Save callbacks into ref (NOT state)
    callbackRef.current = {
      onLeft: config.onLeft || hideAlert,
      onRight: config.onRight || hideAlert,
    };

    // Update only UI text, safe to store in state
    setOptions({
      title: config.title || "",
      message: config.message || "",
      leftButtonTitle: config.leftText || "Cancel",
      rightButtonTitle: config.rightText || "OK",
    });

    setVisible(true);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}

      <Modal visible={visible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              width: "80%",
              padding: 20,
            }}
          >
            {options.title ? (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                {options.title}
              </Text>
            ) : null}

            {options.message ? (
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 20,
                  color: "#444",
                }}
              >
                {options.message}
              </Text>
            ) : null}

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  callbackRef.current.onLeft(); // SAFE callback
                  hideAlert();
                }}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  backgroundColor: "#eee",
                  borderRadius: 8,
                  marginRight: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "600" }}>
                  {options.leftButtonTitle}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  callbackRef.current.onRight(); // SAFE callback
                  hideAlert();
                }}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  backgroundColor: "#007BFF",
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {options.rightButtonTitle}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
