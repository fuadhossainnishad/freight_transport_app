import React, { useRef, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, WebViewNavigation } from "react-native-webview";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { X } from "lucide-react-native";

import { PaymentsStackParamList } from "../../../navigation/types";
import { usePaymentRequests } from "../PaymentRequestsContext";

type Rt = RouteProp<PaymentsStackParamList, "PayWebView">;
type Nav = NativeStackNavigationProp<PaymentsStackParamList, "PayWebView">;

const BLUE = "#036BB4";

// PayDunya redirects the browser to the store return/cancel URLs when the user
// finishes or aborts. We watch for those paths to close the WebView.
const isSuccessUrl = (url: string) => /payment\/(success|bank-success)/i.test(url);
const isCancelUrl = (url: string) => /payment\/(cancel|bank-cancel)/i.test(url);

export default function PayWebViewScreen() {
  const route = useRoute<Rt>();
  const navigation = useNavigation<Nav>();
  const { refresh } = usePaymentRequests();
  const { url, title } = route.params;

  const [loading, setLoading] = useState(true);
  const handled = useRef(false);

  const finish = (outcome: "success" | "cancel") => {
    if (handled.current) return;
    handled.current = true;
    // The authoritative status comes from the server webhook; just refresh.
    refresh();
    navigation.goBack();
    if (outcome === "success") {
      Alert.alert("Payment submitted", "We'll confirm your payment shortly.");
    }
  };

  const onNavChange = (navState: WebViewNavigation) => {
    const u = navState.url || "";
    if (isSuccessUrl(u)) finish("success");
    else if (isCancelUrl(u)) finish("cancel");
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10} style={styles.closeBtn}>
          <X size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title ?? "Payment"}</Text>
        <View style={styles.closeBtn} />
      </View>

      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: url }}
          onNavigationStateChange={onNavChange}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
        />
        {loading && (
          <View style={styles.loader} pointerEvents="none">
            <ActivityIndicator size="large" color={BLUE} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  closeBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "700", color: "#111827" },
  loader: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
});
