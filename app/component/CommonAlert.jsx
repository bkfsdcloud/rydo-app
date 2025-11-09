import { Modal, Text, TouchableOpacity, View } from "react-native";

const CommonAlert = ({
  visible,
  title,
  message,
  leftButtonTitle = "Cancel",
  rightButtonTitle = "OK",
  onLeftPress,
  onRightPress,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onLeftPress}
    >
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
          {title && (
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              {title}
            </Text>
          )}

          {message && (
            <Text
              style={{
                fontSize: 16,
                color: "#444",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {message}
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={onLeftPress}
              style={{
                flex: 1,
                paddingVertical: 10,
                backgroundColor: "#eee",
                borderRadius: 8,
                marginRight: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "600", color: "#333" }}>
                {leftButtonTitle}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onRightPress}
              style={{
                flex: 1,
                paddingVertical: 10,
                backgroundColor: "#007BFF",
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "600", color: "#fff" }}>
                {rightButtonTitle}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommonAlert;
