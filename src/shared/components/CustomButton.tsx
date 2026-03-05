import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
}

export default function CustomButton({
  title,
  onPress,
  loading,
  style,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.button, style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    backgroundColor: "#111",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});