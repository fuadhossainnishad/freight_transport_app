import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { Country, flagUrl } from "../../domain/constants/countries";
import CountrySelectModal from "./CountrySelectModal";

interface Props {
  country?: Country;
  value: string;
  onChangeText: (text: string) => void;
  onCountryChange?: (country: Country) => void;
  error?: boolean;
}

/**
 * Phone input whose dial-code prefix and flag are driven by the selected
 * country (kept in sync with the CountryPicker). The text field holds only the
 * national number (digits); the dial code is shown as a fixed prefix.
 *
 * Tapping the flag / dial-code prefix opens the same country list so the user
 * can switch countries directly from here too.
 */
export default function PhoneNumberInput({
  country,
  value,
  onChangeText,
  onCountryChange,
  error,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  // Cap input at the longest number the selected country accepts, so the user
  // physically cannot type more digits than the country allows.
  const maxDigits = country?.phoneLengths.length
    ? Math.max(...country.phoneLengths)
    : undefined;

  return (
    <View style={[styles.container, error && styles.containerError]}>
      <TouchableOpacity
        style={styles.prefix}
        activeOpacity={0.7}
        disabled={!onCountryChange}
        onPress={() => setPickerOpen(true)}
      >
        {country ? (
          <>
            <Image source={{ uri: flagUrl(country.code) }} style={styles.flag} />
            <Text style={styles.dialCode}>{country.dialCode}</Text>
          </>
        ) : (
          <Text style={styles.dialCode}>+__</Text>
        )}
        {onCountryChange && <ChevronDown size={16} color="#6b7280" />}
      </TouchableOpacity>

      <View style={styles.divider} />

      <TextInput
        style={styles.input}
        placeholder="XX XX XX XX"
        placeholderTextColor="#9ca3af"
        keyboardType="phone-pad"
        value={value}
        maxLength={maxDigits}
        // keep only digits in the national number, capped to the country's max
        onChangeText={(t) => {
          let digits = t.replace(/[^\d]/g, "");
          if (maxDigits) digits = digits.slice(0, maxDigits);
          onChangeText(digits);
        }}
      />

      {onCountryChange && (
        <CountrySelectModal
          visible={pickerOpen}
          value={country}
          onChange={onCountryChange}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  containerError: { borderColor: "#ef4444" },
  prefix: { flexDirection: "row", alignItems: "center", gap: 6 },
  flag: { width: 26, height: 18, borderRadius: 3, backgroundColor: "#eee" },
  dialCode: { fontSize: 15, color: "#111827", fontWeight: "600" },
  divider: { width: 1, height: 24, backgroundColor: "#E5E7EB", marginHorizontal: 12 },
  input: { flex: 1, fontSize: 15, color: "#111827", paddingVertical: 0 },
});
