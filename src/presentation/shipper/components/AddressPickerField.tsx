/**
 * AddressPickerField.tsx
 *
 * A tappable field that shows a selected address or a placeholder.
 * Visually distinguishes the selected vs empty state clearly.
 */

import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AddressLocation } from "../types"

type Props = {
  placeholder: string
  value?: AddressLocation | null
  handlePress: () => void
}

export default function AddressPickerField({ placeholder, value, handlePress }: Props) {
  const hasValue = Boolean(value?.address)

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={handlePress}
        style={[styles.field, hasValue && styles.fieldSelected]}
      >
        {/* Pin icon indicator */}
        <View style={[styles.dot, hasValue && styles.dotSelected]} />

        <Text
          style={[styles.text, !hasValue && styles.placeholder]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {hasValue ? value!.address : placeholder}
        </Text>

        {/* Chevron right */}
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#AEAEAE",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  fieldSelected: {
    borderColor: "#036BB4",
    backgroundColor: "#f0f7ff",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#AEAEAE",
    flexShrink: 0,
  },
  dotSelected: {
    backgroundColor: "#036BB4",
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: "#1a1a1a",
    lineHeight: 20,
  },
  placeholder: {
    color: "#9ca3af",
  },
  chevron: {
    fontSize: 20,
    color: "#AEAEAE",
    lineHeight: 22,
  },
})