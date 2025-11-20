import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { StyleSheet, View } from "react-native";

const BottomScrollPanel = forwardRef(
  (
    {
      children,
      snapPoints = [],
      draggable = false,
      index = -1,
      dynamicSizing = true,
      enablePanClose = false,
      onPositionChange,
    },
    ref
  ) => {
    const handleHeightChange = (h) => {
      onPositionChange(h);
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
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          <View
            onLayout={(e) => {
              const h = e.nativeEvent.layout.height;
              console.log("Content height: ", h);
              handleHeightChange(h);
            }}
          >
            {children}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

BottomScrollPanel.displayName = "BottomScrollPanel";
export default BottomScrollPanel;

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
