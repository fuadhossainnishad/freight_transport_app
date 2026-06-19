import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { Country, flagUrl } from "../../domain/constants/countries";
import CountrySelectModal from "./CountrySelectModal";

interface Props {
  value?: Country;
  onChange: (country: Country) => void;
  placeholder?: string;
}

export default function CountryPicker({ value, onChange, placeholder = "Select country" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.field}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        {value ? (
          <View style={styles.row}>
            <Image source={{ uri: flagUrl(value.code) }} style={styles.flag} />
            <Text style={styles.valueText}>{value.name}</Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
        <ChevronDown size={20} color="#6b7280" />
      </TouchableOpacity>

      <CountrySelectModal
        visible={open}
        value={value}
        onChange={onChange}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  flag: { width: 26, height: 18, borderRadius: 3, backgroundColor: "#eee" },
  valueText: { fontSize: 15, color: "#111827", fontWeight: "500" },
  placeholder: { fontSize: 15, color: "#9ca3af" },
});
