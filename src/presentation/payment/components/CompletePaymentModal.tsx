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

const METHODS: { value: PayMethod; title: string; sub: string; icon: any }[] = [
  { value: "online", title: "Mobile Money", sub: "Pay securely with PayDunya", icon: Globe },
  { value: "bank", title: "Bank Transfer", sub: "Transfer directly to our bank account", icon: Landmark },
  { value: "cash", title: "Cash on Delivery", sub: "Pay when shipment is delivered", icon: Truck },
];

export default function CompletePaymentModal({ visible, request, onClose }: Props) {
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
            title: "Complete Payment",
          });
        } else {
          Alert.alert("Unavailable", "The payment link could not be generated. Please try again.");
        }
      } else if (method === "cash") {
        await refresh();
        onClose();
        Alert.alert("Cash payment recorded", result.message ?? "An admin will confirm receipt.");
      } else if (method === "bank") {
        await refresh();
        onClose();
        const b = result.bank_details;
        Alert.alert(
          "Bank transfer details",
          b
            ? `Bank: ${b.bank_name ?? "—"}\nAccount: ${b.account_number ?? "—"}\nHolder: ${b.account_holder ?? "—"}${b.routing_number ? `\nRouting: ${b.routing_number}` : ""}`
            : "Bank details are not available yet. Please contact support.",
        );
      }
    } catch (err: any) {
      Alert.alert("Payment failed", err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const ctaLabel = method === "online" ? "Pay Online" : "Confirm";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>Complete Payment</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Request details */}
            <View style={styles.detailBox}>
              <Text style={styles.detailHeading}>Payment Request Details</Text>
              <Row label="Request ID" value={request.shortId} />
              <Row label="Shipment" value={request.shipmentTitle} />
              <Row label="Route" value={`${request.pickup} → ${request.delivery}`} />
              <Row label="Requested By" value={request.requestedBy} />
            </View>

            {/* Amount */}
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Total Amount to Pay</Text>
              <Text style={styles.amountValue}>${request.amount.toLocaleString()}</Text>
            </View>

            {/* Methods */}
            <Text style={styles.sectionLabel}>Select Payment Method</Text>
            {METHODS.map((m) => {
              const Icon = m.icon;
              const selected = method === m.value;
              return (
                <TouchableOpacity
                  key={m.value}
                  activeOpacity={0.8}
                  onPress={() => setMethod(m.value)}
                  style={[styles.method, selected && styles.methodSelected]}
                >
                  <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]}>
                    {selected && <Check size={12} color="#fff" strokeWidth={3} />}
                  </View>
                  <Icon size={22} color={selected ? BLUE : "#6B7280"} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodTitle}>{m.title}</Text>
                    <Text style={styles.methodSub}>{m.sub}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={submitting} activeOpacity={0.7}>
              <Text style={styles.cancelTxt}>Cancel</Text>
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
