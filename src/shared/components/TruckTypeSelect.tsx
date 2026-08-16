import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";
import {
  Truck,
  Package,
  Wrench,
  ChevronDown,
  X,
  Check,
} from "lucide-react-native";

export interface TruckTypeOption {
  /** Translation key — `value` stays the untranslated API enum. */
  labelKey: ParseKeys;
  value: string;
}

interface Props {
  value?: string;
  data: TruckTypeOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

// Map a truck-type value to a representative icon.
const iconFor = (value: string, color: string) => {
  switch (value) {
    case "LIGHT_COMMERCIAL_VEHICLE":
      return <Package size={20} color={color} />;
    case "CONSTRUCTION_EQUIPMENT":
      return <Wrench size={20} color={color} />;
    default:
      return <Truck size={20} color={color} />;
  }
};

export default function TruckTypeSelect({
  value,
  data,
  onChange,
  placeholder,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selected = data.find((d) => d.value === value);
  const resolvedPlaceholder = placeholder ?? t("components.truckTypeSelect.placeholder");

  return (
    <>
      <TouchableOpacity
        style={styles.field}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        <View style={styles.row}>
          {iconFor(value ?? "", selected ? "#036BB4" : "#9ca3af")}
          <Text style={selected ? styles.valueText : styles.placeholder}>
            {selected ? t(selected.labelKey) : resolvedPlaceholder}
          </Text>
        </View>
        <ChevronDown size={20} color="#6b7280" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{t("components.truckTypeSelect.title")}</Text>
              <TouchableOpacity onPress={() => setOpen(false)} hitSlop={10}>
                <X size={22} color="#111827" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={data}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSel = item.value === value;
                return (
                  <TouchableOpacity
                    style={[styles.optionRow, isSel && styles.optionRowSelected]}
                    activeOpacity={0.7}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    {iconFor(item.value, isSel ? "#036BB4" : "#374151")}
                    <Text style={styles.optionLabel}>{t(item.labelKey)}</Text>
                    {isSel && <Check size={18} color="#036BB4" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
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
  valueText: { fontSize: 15, color: "#111827", fontWeight: "500" },
  placeholder: { fontSize: 15, color: "#9ca3af" },

  modalRoot: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sheetTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  optionRowSelected: { backgroundColor: "#F0F7FC" },
  optionLabel: { flex: 1, fontSize: 15, color: "#111827", fontWeight: "500" },
});
