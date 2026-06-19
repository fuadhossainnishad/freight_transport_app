import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { RefreshCw } from "lucide-react-native";
import { EmptyShipmentsIllustration } from "./DriverIllustrations";

interface Props {
  onRefresh: () => void;
  refreshing?: boolean;
}

export const EmptyShipments = ({ onRefresh, refreshing = false }: Props) => {
  return (
    <View style={styles.wrapper}>
      <EmptyShipmentsIllustration size={184} />

      <Text style={styles.title}>No deliveries yet</Text>
      <Text style={styles.subtitle}>
        When a transporter assigns you a shipment, it shows up here. Pull down to
        refresh anytime.
      </Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={onRefresh}
        disabled={refreshing}
      >
        <RefreshCw size={16} color="#036BB4" strokeWidth={2.4} />
        <Text style={styles.buttonText}>
          {refreshing ? "Refreshing…" : "Refresh"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1A1C1E",
    letterSpacing: -0.3,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: "#E9F3F9",
    borderWidth: 1,
    borderColor: "#D6E8F8",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#036BB4",
  },
});
