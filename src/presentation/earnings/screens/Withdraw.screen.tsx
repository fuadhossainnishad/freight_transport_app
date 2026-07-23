import React, { useEffect, useMemo, useState } from "react";
import {
    Text, TouchableOpacity, Alert,
    KeyboardAvoidingView, Platform,
    View, ScrollView, ActivityIndicator, TextInput, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";
import { Wallet, DollarSign, Globe, Truck, Check, ChevronDown } from "lucide-react-native";
import AppHeader from "../../../shared/components/AppHeader";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { EarningsStackParamList } from "../../../navigation/types";
import { formatPrice } from "../../../shared/utils/price";
import {
    getWithdrawalBalance,
    requestWithdrawal,
    RequestWithdrawalPayload,
    WithdrawalPayoutMethod,
} from "../../../data/services/withdrawalService";
import CountryPickerModal from "../components/CountryPickerModal";

type NavigationProp = NativeStackNavigationProp<EarningsStackParamList, "Withdraw">;

const BLUE = "#036BB4";

const METHODS: {
    value: WithdrawalPayoutMethod;
    titleKey: ParseKeys;
    subKey: ParseKeys;
    icon: any;
}[] = [
    { value: "online", titleKey: "earnings.withdraw.methods.onlineTitle", subKey: "earnings.withdraw.methods.onlineSub", icon: Globe },
    { value: "cash", titleKey: "earnings.withdraw.methods.cashTitle", subKey: "earnings.withdraw.methods.cashSub", icon: Truck },
];

const WithdrawScreen: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp>();

    const [balance, setBalance] = useState<number | null>(null);
    const [loadingBalance, setLoadingBalance] = useState(true);

    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<WithdrawalPayoutMethod>("online");

    // online
    const [accountAlias, setAccountAlias] = useState("");
    const [accountHolder, setAccountHolder] = useState("");

    // cash
    const [cashAccountHolder, setCashAccountHolder] = useState("");

    const [countryName, setCountryName] = useState("");
    const [pickerOpen, setPickerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadBalance = async () => {
            try {
                setLoadingBalance(true);
                const res = await getWithdrawalBalance();
                setBalance(res.available_balance);
            } catch (err) {
                console.error("Failed to load withdrawal balance:", err);
                Alert.alert(t("common.error"), t("earnings.withdraw.loadBalanceFailed"));
            } finally {
                setLoadingBalance(false);
            }
        };
        loadBalance();
    }, [t]);

    const amountValid = amount.trim() !== "" && !isNaN(Number(amount)) && Number(amount) > 0;

    const validate = (): string | null => {
        if (!amount.trim()) return t("validation.amountRequired");
        if (isNaN(Number(amount)) || Number(amount) <= 0) return t("validation.amountInvalid");
        if (balance != null && Number(amount) > balance) return t("earnings.withdraw.alerts.amountExceedsBalance");
        if (!countryName) return t("validation.regionRequired");
        if (method === "online" && !accountAlias.trim()) return t("earnings.withdraw.alerts.accountAliasRequired");
        return null;
    };

    const canSubmit = useMemo(() => {
        if (!amountValid || !countryName) return false;
        if (method === "online") return accountAlias.trim() !== "";
        return true;
    }, [amountValid, countryName, method, accountAlias]);

    const buildPayload = (): RequestWithdrawalPayload => {
        const amountNum = Number(amount);
        if (method === "cash") {
            return {
                amount: amountNum,
                region: countryName,
                payout_method: "cash",
                ...(cashAccountHolder.trim() ? { account_holder_name: cashAccountHolder.trim() } : {}),
            };
        }
        return {
            amount: amountNum,
            region: countryName,
            payout_method: "online",
            account_alias: accountAlias.trim(),
            ...(accountHolder.trim() ? { account_holder_name: accountHolder.trim() } : {}),
        };
    };

    const handleSubmit = async () => {
        const error = validate();
        if (error) { Alert.alert(t("validation.validationError"), error); return; }
        try {
            setLoading(true);
            await requestWithdrawal(buildPayload());
            Alert.alert(t("common.success"), t("earnings.withdraw.alerts.requestSubmittedMessage"));
            navigation.goBack();
        } catch (err: any) {
            if (err?.statusCode === 409) {
                Alert.alert(t("earnings.withdraw.alerts.pendingTitle"), t("earnings.withdraw.alerts.pendingMessage"));
            } else {
                Alert.alert(t("common.error"), err?.message || t("common.tryAgain"));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
            <AppHeader text={t("earnings.withdraw.title")} onpress={() => navigation.goBack()} />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Balance card */}
                    <View style={styles.balanceCard}>
                        <View style={styles.balanceIconWrap}>
                            <Wallet size={20} color={BLUE} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.balanceLabel}>{t("earnings.withdraw.availableBalanceLabel")}</Text>
                            {loadingBalance ? (
                                <ActivityIndicator color={BLUE} style={{ marginTop: 6, alignSelf: "flex-start" }} />
                            ) : (
                                <Text style={styles.balanceValue}>{formatPrice(balance)}</Text>
                            )}
                        </View>
                    </View>

                    {/* Amount */}
                    <Text style={styles.sectionLabel}>{t("earnings.withdraw.amountLabel")}</Text>
                    <View style={styles.amountInputWrap}>
                        <DollarSign size={17} color="#9CA3AF" />
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            placeholder={t("earnings.withdraw.amountPlaceholder")}
                            placeholderTextColor="#9CA3AF"
                            style={styles.amountInput}
                        />
                    </View>

                    {/* Payout method */}
                    <Text style={styles.groupLabel}>{t("earnings.withdraw.methodSectionLabel")}</Text>
                    <View style={styles.card}>
                        {METHODS.map((m, idx) => {
                            const Icon = m.icon;
                            const selected = method === m.value;
                            return (
                                <TouchableOpacity
                                    key={m.value}
                                    activeOpacity={0.75}
                                    onPress={() => setMethod(m.value)}
                                    style={[
                                        styles.method,
                                        idx === METHODS.length - 1 && { borderBottomWidth: 0 },
                                        selected && styles.methodSelected,
                                    ]}
                                >
                                    <View style={[styles.methodIconWrap, selected && styles.methodIconWrapSelected]}>
                                        <Icon size={18} color={selected ? BLUE : "#6B7280"} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.methodTitle}>{t(m.titleKey)}</Text>
                                        <Text style={styles.methodSub}>{t(m.subKey)}</Text>
                                    </View>
                                    <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]}>
                                        {selected && <Check size={11} color="#fff" strokeWidth={3} />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Method-specific fields */}
                    {method === "online" && (
                        <View style={styles.detailsCard}>
                            <Text style={styles.detailsHeading}>{t("earnings.withdraw.accountAliasLabel")}</Text>
                            <TextInput
                                value={accountAlias}
                                onChangeText={setAccountAlias}
                                placeholder={t("earnings.withdraw.accountAliasPlaceholder")}
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                            />
                            <Text style={styles.hint}>{t("earnings.withdraw.accountAliasHint")}</Text>

                            <Text style={[styles.detailsHeading, { marginTop: 14 }]}>{t("earnings.withdraw.accountHolderLabel")}</Text>
                            <TextInput
                                value={accountHolder}
                                onChangeText={setAccountHolder}
                                placeholder={t("earnings.withdraw.accountHolderPlaceholder")}
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                            />
                        </View>
                    )}

                    {method === "cash" && (
                        <View style={styles.detailsCard}>
                            <Text style={styles.detailsHeading}>{t("earnings.withdraw.accountHolderLabel")}</Text>
                            <TextInput
                                value={cashAccountHolder}
                                onChangeText={setCashAccountHolder}
                                placeholder={t("earnings.withdraw.accountHolderPlaceholder")}
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                            />
                            <Text style={styles.hint}>{t("earnings.withdraw.cashNote")}</Text>
                        </View>
                    )}

                    {/* Region */}
                    <Text style={styles.groupLabel}>{t("earnings.withdraw.regionLabel")}</Text>
                    <TouchableOpacity
                        onPress={() => setPickerOpen(true)}
                        activeOpacity={0.75}
                        style={styles.regionField}
                    >
                        <Text style={[styles.regionText, !countryName && styles.regionPlaceholder]}>
                            {countryName || t("earnings.withdraw.regionPlaceholder")}
                        </Text>
                        <ChevronDown size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Submit */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading || loadingBalance || !canSubmit}
                        activeOpacity={0.85}
                        style={[styles.submitBtn, (loading || loadingBalance || !canSubmit) && styles.submitBtnDisabled]}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitText}>{t("earnings.withdraw.submitRequest")}</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            <CountryPickerModal
                visible={pickerOpen}
                selected={countryName}
                onSelect={(country) => {
                    setCountryName(country);
                    setPickerOpen(false);
                }}
                onClose={() => setPickerOpen(false)}
            />
        </SafeAreaView>
    );
};

export default WithdrawScreen;

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#fff" },
    scrollContent: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 40 },

    balanceCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        backgroundColor: "#F0F7FC",
        borderWidth: 1,
        borderColor: "#DCEBF8",
        borderRadius: 18,
        padding: 16,
        marginBottom: 24,
    },
    balanceIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    balanceLabel: { fontSize: 12, color: "#5B7A94", fontWeight: "600" },
    balanceValue: { fontSize: 24, fontWeight: "800", color: BLUE, marginTop: 2 },

    sectionLabel: { fontSize: 13, fontWeight: "700", color: "#111827", marginBottom: 8 },
    groupLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#9CA3AF",
        letterSpacing: 0.4,
        textTransform: "uppercase",
        marginTop: 22,
        marginBottom: 10,
    },

    amountInputWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        paddingHorizontal: 14,
        backgroundColor: "#fff",
    },
    amountInput: {
        flex: 1,
        paddingVertical: Platform.OS === "ios" ? 14 : 12,
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },

    card: {
        borderWidth: 1,
        borderColor: "#EEF1F4",
        borderRadius: 16,
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    method: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F3F5",
    },
    methodSelected: { backgroundColor: "#F7FBFE" },
    methodIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    methodIconWrapSelected: { backgroundColor: "#E4F1FB" },
    methodTitle: { fontSize: 14.5, fontWeight: "700", color: "#111827" },
    methodSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
    radio: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    radioOff: { borderWidth: 1.5, borderColor: "#D1D5DB" },
    radioOn: { backgroundColor: BLUE },

    detailsCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        padding: 16,
        marginTop: 12,
    },
    detailsHeading: { fontSize: 12.5, fontWeight: "700", color: "#374151", marginBottom: 8 },
    input: {
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === "ios" ? 13 : 10,
        fontSize: 14.5,
        color: "#111827",
        backgroundColor: "#fff",
    },
    hint: { fontSize: 11.5, color: "#9CA3AF", marginTop: 6 },

    regionField: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 15,
    },
    regionText: { fontSize: 14.5, color: "#111827", fontWeight: "600" },
    regionPlaceholder: { color: "#9CA3AF", fontWeight: "400" },

    submitBtn: {
        marginTop: 28,
        borderRadius: 999,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: BLUE,
        shadowColor: BLUE,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    submitBtnDisabled: { backgroundColor: "#CBD5E1", shadowOpacity: 0 },
    submitText: { color: "#fff", fontSize: 15.5, fontWeight: "700" },
});
