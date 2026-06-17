import React from "react";
import { Text, TouchableOpacity, View, StyleSheet, ViewStyle } from "react-native";
import { Check } from "lucide-react-native";

interface Props {
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onPress: () => void;
  /** "grid" = icon on top, centered (2-up grid). "row" = icon left, full width. */
  layout?: "grid" | "row";
  /** When false, the icon/illustration is rendered without the tinted chip
   *  background (use for larger illustrations rather than small glyphs). */
  chip?: boolean;
  style?: ViewStyle;
}

const BLUE = "#036BB4";

/**
 * Professional selectable card used across the profile wizard. Replaces the
 * old flat `bg-black/10` boxes with a clean bordered card, a tinted icon chip,
 * and a clear selected state.
 */
export default function WizardOptionCard({
  label,
  sublabel,
  icon,
  selected,
  onPress,
  layout = "grid",
  chip = true,
  style,
}: Props) {
  const isRow = layout === "row";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        isRow ? styles.rowCard : styles.gridCard,
        selected && styles.cardSelected,
        style,
      ]}
    >
      {icon ? (
        chip ? (
          <View
            style={[
              styles.iconChip,
              !isRow && styles.gridIconChip,
              selected && styles.iconChipSelected,
            ]}
          >
            {icon}
          </View>
        ) : (
          <View style={!isRow && styles.gridIconChip}>{icon}</View>
        )
      ) : null}

      <View style={isRow ? styles.rowTextWrap : styles.gridTextWrap}>
        <Text style={[styles.label, isRow && styles.rowLabel]} numberOfLines={2}>
          {label}
        </Text>
        {sublabel ? (
          <Text style={[styles.sublabel, isRow && styles.rowSublabel]}>{sublabel}</Text>
        ) : null}
      </View>

      {isRow && (
        <View style={[styles.radio, selected ? styles.radioSelected : styles.radioDefault]}>
          {selected && <Check size={13} color="#fff" strokeWidth={3} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#fff",
    // subtle elevation
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  gridCard: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 132,
  },
  rowCard: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  cardSelected: {
    borderColor: BLUE,
    borderWidth: 1.5,
    backgroundColor: "#F0F7FC",
  },
  iconChip: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
  },
  gridIconChip: { marginBottom: 12 },
  iconChipSelected: { backgroundColor: "#DBEAFE" },
  gridTextWrap: { alignItems: "center" },
  rowTextWrap: { flex: 1, gap: 2 },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  rowLabel: { textAlign: "left" },
  sublabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
    textAlign: "center",
  },
  rowSublabel: { textAlign: "left" },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDefault: { borderWidth: 1.5, borderColor: "#D1D5DB" },
  radioSelected: { backgroundColor: BLUE },
});
