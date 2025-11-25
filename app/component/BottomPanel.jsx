import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
      style,
      title,
    },
    ref
  ) => {
    const handleHeightChange = (h) => {
      onPositionChange && onPositionChange(h);
    };

    return (
      <BottomSheet
        handleComponent={() => (
          <View style={styles.handleContainer}>
            {title && (
              <View style={styles.titleContainer}>
                <Text style={{ fontSize: 22, fontWeight: "600" }}>{title}</Text>
              </View>
            )}

            {enablePanClose && (
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close-circle" size={22} color="#333" />
              </TouchableOpacity>
            )}
          </View>
        )}
        ref={ref}
        enableDynamicSizing={dynamicSizing}
        enablePanDownToClose={enablePanClose}
        snapPoints={snapPoints}
        enableOverDrag={draggable}
        index={index}
        style={[styles.sheetContainer, style || {}]}
        onClose={onClose}
        keyboardBehavior="extend"
        detached={detached}
      >
        <BottomSheetView style={styles.sheetViewContainer}>
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
  sheetViewContainer: { padding: 20, paddingTop: 0 },
  handleContainer: {
    width: "100%",
    // height: 70,
    padding: 15,
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    position: "relative",
  },
  stripe: {
    width: 40,
    height: 5,
    backgroundColor: "#000",
    borderRadius: 3,
  },
  closeBtn: {
    height: 50,
    // marginRight: 5,
  },
  titleContainer: {
    height: 50,
    // marginLeft: 5,
  },
});
