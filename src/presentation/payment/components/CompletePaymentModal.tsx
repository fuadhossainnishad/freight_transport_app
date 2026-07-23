import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { Globe, Landmark, Truck, Check } from "lucide-react-native";

import { PaymentRequest } from "../../../domain/entities/paymentRequest.entity";
import { payNow, PayMethod } from "../../../data/services/paymentRequestService";
import { usePaymentRequests } from "../PaymentRequestsContext";
import { PaymentsStackParamList } from "../../../navigation/types";

type Nav = NativeStackNavigationProp<PaymentsStackParamList, "PaymentRequests">;

interface Props {
  visible: boolean;
  request: PaymentRequest | null;
  onClose: () => void;
}

const BLUE = "#036BB4";

const METHOD_ICONS: Record<PayMethod, any> = { online: Globe, bank: Landmark, cash: Truck };
const METHOD_KEYS = ["online", "bank", "cash"] as const;

export default function CompletePaymentModal({ visible, request, onClose }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const { refresh } = usePaymentRequests();
  const [method, setMethod] = useState<PayMethod>("online");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) setMethod("online");
  }, [visible]);

  if (!request) return null;

  const handleConfirm = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const result = await payNow(request.id, method);

      if (method === "online") {
        if (result.payment_url) {
          onClose();
          navigation.navigate("PayWebView", {
            paymentId: request.id,
            url: result.payment_url,
          });
        } else {
          Alert.alert(t("payment.complete.alerts.unavailableTitle"), t("payment.complete.alerts.unavailableMessage"));
        }
      } else if (method === "cash") {
        await refresh();
        onClose();
        Alert.alert(t("payment.complete.alerts.cashRecordedTitle"), result.message ?? t("payment.complete.alerts.cashRecordedFallback"));
      } else if (method === "bank") {
        await refresh();
        onClose();
        const b = result.bank_details;
        let message = t("payment.complete.alerts.bankDetailsUnavailable");
        if (b) {
          message = t("payment.complete.alerts.bankLine", {
            bank: b.bank_name ?? "—",
            account: b.account_number ?? "—",
            holder: b.account_holder ?? "—",
          });
          if (b.routing_number) {
            message += t("payment.complete.alerts.bankRoutingLine", { routing: b.routing_number });
          }
        }
        Alert.alert(t("payment.complete.alerts.bankDetailsTitle"), message);
      }
    } catch (err: any) {
      Alert.alert(t("payment.complete.alerts.failedTitle"), err?.response?.data?.message || err?.message || t("common.somethingWentWrong"));
    } finally {
      setSubmitting(false);
    }
  };

  const ctaLabel = method === "online" ? t("payment.complete.payOnline") : t("payment.complete.confirm");

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{t("payment.complete.title")}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Request details */}
            <View style={styles.detailBox}>
              <Text style={styles.detailHeading}>{t("payment.complete.detailsHeading")}</Text>
              <Row label={t("payment.complete.requestId")} value={request.shortId} />
              <Row label={t("payment.complete.shipment")} value={request.shipmentTitle} />
              <Row label={t("payment.complete.route")} value={`${request.pickup} → ${request.delivery}`} />
              <Row label={t("payment.complete.requestedBy")} value={request.requestedBy} />
            </View>

            {/* Amount */}
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>{t("payment.complete.totalAmount")}</Text>
              <Text style={styles.amountValue}>${request.amount.toLocaleString()}</Text>
            </View>

            {/* Methods */}
            <Text style={styles.sectionLabel}>{t("payment.complete.selectMethod")}</Text>
            {METHOD_KEYS.map((value) => {
              const Icon = METHOD_ICONS[value];
              const selected = method === value;
              return (
                <TouchableOpacity
                  key={value}
                  activeOpacity={0.8}
                  onPress={() => setMethod(value)}
                  style={[styles.method, selected && styles.methodSelected]}
                >
                  <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]}>
                    {selected && <Check size={12} color="#fff" strokeWidth={3} />}
                  </View>
                  <Icon size={22} color={selected ? BLUE : "#6B7280"} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodTitle}>{t(`payment.complete.methods.${value}Title`)}</Text>
                    <Text style={styles.methodSub}>{t(`payment.complete.methods.${value}Sub`)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={submitting} activeOpacity={0.7}>
              <Text style={styles.cancelTxt}>{t("payment.complete.cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.payBtn, submitting && { opacity: 0.7 }]}
              onPress={handleConfirm}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payTxt}>{ctaLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  title: { fontSize: 18, fontWeight: "800", color: "#0F172A", marginBottom: 14 },

  detailBox: { backgroundColor: "#F8FAFC", borderRadius: 12, padding: 14, gap: 8 },
  detailHeading: { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 2 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  rowLabel: { fontSize: 13, color: "#6B7280" },
  rowValue: { fontSize: 13, color: "#111827", fontWeight: "600", flexShrink: 1, textAlign: "right" },

  amountBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 14,
  },
  amountLabel: { fontSize: 13, color: "#475569" },
  amountValue: { fontSize: 28, fontWeight: "800", color: BLUE, marginTop: 2 },

  sectionLabel: { fontSize: 14, fontWeight: "700", color: "#111827", marginTop: 18, marginBottom: 10 },

  method: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  methodSelected: { borderColor: BLUE, backgroundColor: "#F0F7FC" },
  radio: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  radioOff: { borderWidth: 1.5, borderColor: "#CBD5E1" },
  radioOn: { backgroundColor: BLUE },
  methodTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  methodSub: { fontSize: 12, color: "#6B7280", marginTop: 1 },

  footer: { flexDirection: "row", gap: 12, marginTop: 14 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  cancelTxt: { fontSize: 15, fontWeight: "600", color: "#374151" },
  payBtn: { flex: 1.4, paddingVertical: 14, borderRadius: 999, backgroundColor: BLUE, alignItems: "center" },
  payTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
