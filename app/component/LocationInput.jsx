import { ORIGIN } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useRideStore } from "../store/useRideStore";
import useUserStore from "../store/useUserStore";

export default function LocationInput({
  showIcon = true,
  favIcon = false,
  placeholder,
  placeholderTextColor = "grey",
  value,
  editable,
  style,
  icon = "radio-button-on-outline",
  iconColor = "green",
  onChangeText,
  onPress,
  ref,
  searchFor,
  onAddFavourite,
  loading,
}) {
  const { favourites } = useUserStore();
  const { origin, destination } = useRideStore();
  const [isFav, setIsFav] = useState(false);

  const getStyleClass = useCallback(() => {
    if (showIcon && favIcon) {
      return [styles.inputIcon, styles.favInput];
    } else if (showIcon) {
      return styles.inputIcon;
    } else if (favIcon) {
      return styles.favInput;
    } else {
      return styles.input;
    }
  }, []);

  useEffect(() => {
    const refObj = searchFor === ORIGIN ? origin : destination;
    setIsFav(
      favourites?.findIndex((item) => item.place_id === refObj?.place_id) !== -1
    );
  }, [searchFor, origin, destination, favourites]);

  return (
    <View style={styles.container}>
      {showIcon && (
        <Ionicons
          name={icon}
          color={iconColor}
          size={20}
          style={[styles.icon, style]}
        ></Ionicons>
      )}
      <TextInput
        ref={ref}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        editable={editable}
        allowFontScaling={false}
        style={[getStyleClass(), style]}
        value={value}
        onChangeText={onChangeText}
        onPress={onPress}
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        clearButtonMode="while-editing"
      />
      {favIcon && (
        <Ionicons
          name={isFav ? "heart" : "heart-outline"}
          color={isFav ? "red" : "grey"}
          size={20}
          onPress={() => onAddFavourite()}
          style={[styles.favIcon, style]}
        ></Ionicons>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  icon: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    borderRightWidth: 0,
    paddingRight: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  favIcon: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 0,
    paddingLeft: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  favInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 10,
    paddingRight: 0,
    borderRadius: 8,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputIcon: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 10,
    paddingLeft: 0,
    borderRadius: 8,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
});
