import React from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
} from "react-native";

interface Props extends TextInputProps {
  error?: string;
}

export default function CustomInput({ error, ...props }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: "#FFF",
  },

  inputError: {
    borderColor: "#ff4d4f",
  },
});