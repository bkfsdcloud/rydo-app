import { StyleSheet, TouchableOpacity } from "react-native";

export default function TouchableButton({
  disabled,
  style,
  children,
  ...rest
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[style, disabled && styles.disabled]}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.4,
    backgroundColor: "grey",
  },
});
