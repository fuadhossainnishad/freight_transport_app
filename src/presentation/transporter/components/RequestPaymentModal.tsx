import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Globe, Landmark, Truck, Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";

import {
  requestTransporterPayment,
  RequestPaymentPayload,
} from "../../../data/services/transporterPaymentService";
import { TransporterPaymentMethod } from "../../../domain/entities/transporterPayment.entity";
import { ActiveShipmentsStackParamList } from "../../../navigation/types";
import { formatPrice } from "../../../shared/utils/price";
import AppConfig from "../../../shared/config/app.config";

type Nav = NativeStackNavigationProp<
  ActiveShipmentsStackParamList,
  "ActiveShipmentDetailsScreen"
>;

interface Props {
  visible: boolean;
  shipmentId: string;
  shipmentTitle?: string;
  // The agreed shipment price, used to prefill the amount. Null until a bid is
  // accepted, in which case the transporter has to type an amount.
  price?: number | null;
  onClose: () => void;
  onSubmitted?: () => void;
}

const BLUE = "#036BB4";

// An empty .env value would come through as "", which PayDunya treats the same
// as no phone at all — so fall back rather than prefill a blank.
const DEFAULT_PHONE = AppConfig.default_mobile_money_phone?.trim() || "+22670189869";

const METHODS: {
  value: TransporterPaymentMethod;
  titleKey: ParseKeys;
  subKey: ParseKeys;
  icon: any;
}[] = [
  { value: "online", titleKey: "payment.requestModal.methods.onlineTitle", subKey: "payment.requestModal.methods.onlineSub", icon: Globe },
  { value: "bank", titleKey: "payment.requestModal.methods.bankTitle", subKey: "payment.requestModal.methods.bankSub", icon: Landmark },
  { value: "cash", titleKey: "payment.requestModal.methods.cashTitle", subKey: "payment.requestModal.methods.cashSub", icon: Truck },
];

export default function RequestPaymentModal({
  visible,
  shipmentId,
  shipmentTitle,
  price,
  onClose,
  onSubmitted,
}: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();

  const [method, setMethod] = useState<TransporterPaymentMethod>("online");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reset on each open so a cancelled attempt doesn't leak into the next one.
  useEffect(() => {
    if (!visible) return;
    setMethod("online");
    setAmount(price != null ? String(price) : "");
    setNotes("");
    setPhone(DEFAULT_PHONE);
    setBankName("");
    setAccountNumber("");
    setAccountHolder("");
  }, [visible, price]);

  const parsedAmount = Number(amount);
  const amountValid = amount.trim() !== "" && Number.isFinite(parsedAmount) && parsedAmount > 0;

  // Mirrors the backend's validation refinement, so the CTA is only enabled for
  // a payload the server will accept.
  const canSubmit = useMemo(() => {
    if (!amountValid) return false;
    if (method === "online") return phone.trim() !== "";
    if (method === "bank") {
      return bankName.trim() !== "" && accountNumber.trim() !== "" && accountHolder.trim() !== "";
    }
    return true;
  }, [amountValid, method, phone, bankName, accountNumber, accountHolder]);

  const buildPayload = (): RequestPaymentPayload => {
    const base = {
      shipment_id: shipmentId,
      amount: parsedAmount,
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };

    if (method === "online") {
      return { ...base, payment_method: "online", mobile_money_phone: phone.trim() };
    }
    if (method === "bank") {
      return {
        ...base,
        payment_method: "bank",
        bank_name: bankName.trim(),
        account_number: accountNumber.trim(),
        account_holder: accountHolder.trim(),
      };
    }
    return { ...base, payment_method: "cash" };
  };

  const handleSubmit = async () => {
    if (submitting || !canSubmit) return;
    try {
      setSubmitting(true);
      const payment = await requestTransporterPayment(buildPayload());

      onSubmitted?.();

      if (method === "online") {
        if (payment.paydunyaUrl) {
          onClose();
          navigation.navigate("PayWebView", {
            paymentId: payment.id,
            url: payment.paydunyaUrl,
          });
        } else {
          onClose();
          Alert.alert(
            t("payment.requestModal.alerts.submittedTitle"),
            t("payment.requestModal.alerts.linkFailedMessage"),
          );
        }
        return;
      }

      onClose();
      Alert.alert(
        t("payment.requestModal.alerts.submittedTitle"),
        method === "bank"
          ? t("payment.requestModal.alerts.bankPendingMessage")
          : t("payment.requestModal.alerts.cashPendingMessage"),
      );
    } catch (err: any) {
      Alert.alert(
        t("payment.requestModal.alerts.failedTitle"),
        err?.response?.data?.message || err?.message || t("payment.requestModal.alerts.failedMessage"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{t("payment.requestModal.title")}</Text>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Shipment */}
            <View style={styles.detailBox}>
              <Text style={styles.detailHeading}>{t("payment.requestModal.shipment")}</Text>
              <Text style={styles.shipmentTitle} numberOfLines={2}>
                {shipmentTitle || "—"}
              </Text>
              {price != null && (
                <Text style={styles.agreedPrice}>
                  {t("payment.requestModal.agreedPrice", { price: formatPrice(price) })}
                </Text>
              )}
            </View>

            {/* Amount */}
            <Text style={styles.sectionLabel}>{t("payment.requestModal.amount")}</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder={t("payment.requestModal.enterAmount")}
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
            {amount.trim() !== "" && !amountValid && (
              <Text style={styles.error}>{t("payment.requestModal.amountError")}</Text>
            )}

            {/* Methods */}
            <Text style={styles.sectionLabel}>{t("payment.requestModal.paymentMethod")}</Text>
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
                    <Text style={styles.methodTitle}>{t(m.titleKey)}</Text>
                    <Text style={styles.methodSub}>{t(m.subKey)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Method-specific fields */}
            {method === "online" && (
              <>
                <Text style={styles.sectionLabel}>{t("payment.requestModal.mobileMoneyNumber")}</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder={DEFAULT_PHONE}
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
                <Text style={styles.hint}>
                  {t("payment.requestModal.mobileMoneyHint")}
                </Text>
              </>
            )}

            {method === "bank" && (
              <>
                <Text style={styles.sectionLabel}>{t("payment.requestModal.bankName")}</Text>
                <TextInput
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="Ecobank"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
                <Text style={styles.sectionLabel}>{t("payment.requestModal.accountNumber")}</Text>
                <TextInput
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  keyboardType="numeric"
                  placeholder="1234567890"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
                <Text style={styles.sectionLabel}>{t("payment.requestModal.accountHolder")}</Text>
                <TextInput
                  value={accountHolder}
                  onChangeText={setAccountHolder}
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                />
              </>
            )}

            {/* Notes */}
            <Text style={styles.sectionLabel}>{t("payment.requestModal.notes")}</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder={t("payment.requestModal.notesPlaceholder")}
              placeholderTextColor="#9CA3AF"
              multiline
              style={[styles.input, styles.notesInput]}
            />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={submitting}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelTxt}>{t("payment.requestModal.cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.payBtn, (submitting || !canSubmit) && { opacity: 0.5 }]}
              onPress={handleSubmit}
              disabled={submitting || !canSubmit}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payTxt}>
                  {method === "online"
                    ? t("payment.requestModal.continueToPaydunya")
                    : t("payment.requestModal.submitRequest")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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

  detailBox: { backgroundColor: "#F8FAFC", borderRadius: 12, padding: 14 },
  detailHeading: { fontSize: 12, fontWeight: "700", color: "#6B7280", marginBottom: 4 },
  shipmentTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  agreedPrice: { fontSize: 13, color: "#475569", marginTop: 4 },

  sectionLabel: { fontSize: 14, fontWeight: "700", color: "#111827", marginTop: 16, marginBottom: 8 },

  input: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 15,
    color: "#111827",
  },
  notesInput: { minHeight: 72, textAlignVertical: "top" },
  error: { fontSize: 12, color: "#DC2626", marginTop: 6 },
  hint: { fontSize: 12, color: "#6B7280", marginTop: 6 },

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
