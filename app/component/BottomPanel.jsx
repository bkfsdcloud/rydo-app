import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const BottomPanel = forwardRef(
  (
    {
      children,
      snapPoints = [],
      draggable = false,
      index = 0,
      dynamicSizing = true,
      enablePanClose = false,
      onPositionChange,
      onClose,
      detached = false,
    },
    ref
  ) => {
    const handleHeightChange = (h) => {
      onPositionChange && onPositionChange(h);
    };

    return (
      <BottomSheet
        ref={ref}
        enableDynamicSizing={dynamicSizing}
        enablePanDownToClose={enablePanClose}
        snapPoints={snapPoints}
        enableOverDrag={draggable}
        index={index}
        style={styles.sheetContainer}
        onAnimate={(props) => console.log("props", props)}
        onClose={onClose}
        keyboardBehavior="extend"
        detached={detached}
      >
        {enablePanClose && (
          <View style={{ alignSelf: "flex-end", paddingRight: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#bebebeff",
                borderRadius: "50%",
                paddingVertical: 5,
                paddingHorizontal: 5,
              }}
              onPress={onClose}
            >
              <Ionicons name="close-outline" size={22}></Ionicons>
            </TouchableOpacity>
          </View>
        )}
        <BottomSheetView style={{ padding: 20 }}>
          <View
            onLayout={(e) => {
              const h = e.nativeEvent.layout.height;
              handleHeightChange(h);
            }}
          >
            {children}
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

BottomPanel.displayName = "BottomPanel";
export default BottomPanel;

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
});
