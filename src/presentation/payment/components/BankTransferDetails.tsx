import React from "react";
import { View, Text, Modal, Pressable, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Landmark } from "lucide-react-native";

import { BankDetails } from "../../../domain/entities/paymentRequest.entity";

const BLUE = "#036BB4";

interface Props {
  visible: boolean;
  details?: BankDetails | null;
  /** Shown above the account, so the shipper knows which request they are paying. */
  reference?: string;
  amount?: string;
  onClose: () => void;
}

/**
 * The company's receiving account for a manual bank transfer.
 *
 * This used to be an Alert.alert, which was a dead end: pay-now flips the
 * request to bank_pending, isPayable() excludes that status, so the Pay Now
 * button disappears and the sheet could never be reopened. Dismissing the alert
 * lost the account number permanently and the transfer became impossible to
 * complete.
 *
 * Values are `selectable` so they can be long-pressed and copied — the project
 * has no clipboard module, and adding a native one would force a rebuild.
 */
export default function BankTransferDetails({ visible, details, reference, amount, onClose }: Props) {
  const { t } = useTranslation();

  const rows: { label: string; value?: string }[] = [
    { label: t("payment.bankDetails.bankName"), value: details?.bank_name },
    { label: t("payment.bankDetails.accountNumber"), value: details?.account_number },
    { label: t("payment.bankDetails.accountHolder"), value: details?.account_holder },
    { label: t("payment.bankDetails.routingNumber"), value: details?.routing_number },
    { label: t("payment.bankDetails.bankAddress"), value: details?.bank_address },
  ].filter((r) => typeof r.value === "string" && r.value.trim() !== "");

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.titleRow}>
            <Landmark size={20} color={BLUE} />
            <Text style={styles.title}>{t("payment.bankDetails.title")}</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {(reference || amount) && (
              <View style={styles.refBox}>
                {!!amount && (
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>{t("payment.bankDetails.amount")}</Text>
                    <Text selectable style={styles.rowValueStrong}>{amount}</Text>
                  </View>
                )}
                {!!reference && (
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>{t("payment.bankDetails.reference")}</Text>
                    <Text selectable style={styles.rowValue}>{reference}</Text>
                  </View>
                )}
              </View>
            )}

            {rows.length === 0 ? (
              <Text style={styles.unavailable}>{t("payment.bankDetails.unavailable")}</Text>
            ) : (
              <>
                <View style={styles.detailBox}>
                  {rows.map((r) => (
                    <View key={r.label} style={styles.fieldBlock}>
                      <Text style={styles.rowLabel}>{r.label}</Text>
                      <Text selectable style={styles.fieldValue}>{r.value}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.hint}>{t("payment.bankDetails.copyHint")}</Text>
              </>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.closeTxt}>{t("payment.bankDetails.close")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  title: { fontSize: 18, fontWeight: "800", color: "#0F172A" },

  refBox: { backgroundColor: "#EFF6FF", borderRadius: 12, padding: 14, gap: 8, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  rowLabel: { fontSize: 13, color: "#6B7280" },
  rowValue: { fontSize: 13, color: "#111827", fontWeight: "600", flexShrink: 1, textAlign: "right" },
  rowValueStrong: { fontSize: 16, color: BLUE, fontWeight: "800" },

  detailBox: { backgroundColor: "#F8FAFC", borderRadius: 12, padding: 14, gap: 14 },
  fieldBlock: { gap: 3 },
  fieldValue: { fontSize: 16, color: "#111827", fontWeight: "700" },

  hint: { fontSize: 12, color: "#6B7280", marginTop: 10, textAlign: "center" },
  unavailable: { fontSize: 14, color: "#B91C1C", paddingVertical: 12 },

  closeBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
  },
  closeTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
