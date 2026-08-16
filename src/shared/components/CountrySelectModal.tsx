import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  TextInput,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { X, Check, Search } from "lucide-react-native";
import { COUNTRIES, Country, flagUrl } from "../../domain/constants/countries";

interface Props {
  visible: boolean;
  value?: Country;
  onChange: (country: Country) => void;
  onClose: () => void;
}

/** Shared searchable country list — used by both the Country field and the
 *  phone-number prefix so they open the exact same picker. */
export default function CountrySelectModal({ visible, value, onChange, onClose }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q),
    );
  }, [query]);

  const close = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={close} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{t("components.countrySelect.title")}</Text>
            <TouchableOpacity onPress={close} hitSlop={10}>
              <X size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBox}>
            <Search size={18} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder={t("components.countrySelect.search")}
              placeholderTextColor="#9ca3af"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const selected = item.code === value?.code;
              return (
                <TouchableOpacity
                  style={[styles.optionRow, selected && styles.optionRowSelected]}
                  activeOpacity={0.7}
                  onPress={() => {
                    onChange(item);
                    close();
                  }}
                >
                  <Image source={{ uri: flagUrl(item.code) }} style={styles.flag} />
                  <Text style={styles.optionName}>{item.name}</Text>
                  <Text style={styles.optionDial}>{item.dialCode}</Text>
                  {selected && <Check size={18} color="#036BB4" />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flag: { width: 26, height: 18, borderRadius: 3, backgroundColor: "#eee" },
  modalRoot: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    maxHeight: "75%",
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
    marginBottom: 14,
  },
  sheetTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#111827", paddingVertical: 0 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  optionRowSelected: { backgroundColor: "#F0F7FC" },
  optionName: { flex: 1, fontSize: 15, color: "#111827", fontWeight: "500" },
  optionDial: { fontSize: 14, color: "#6b7280" },
});
