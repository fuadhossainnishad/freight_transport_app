import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertCircle } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { LocationGate } from "../components/LocationGate";
import DriverHeader from "../components/DriverHeader";
import { ShipmentCard } from "../components/ShipmentCard";
import { EmptyShipments } from "../components/EmptyShipments";
import { useDriverShipments } from "../hooks/useDriverShipments";

export default function DriverHomeScreen() {
  return (
    <LocationGate>
      <DriverHomeContent />
    </LocationGate>
  );
}

function DriverHomeContent() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { shipments, loading, error, refresh } = useDriverShipments();

  const count = shipments.length;
  const hasShipments = count > 0;
  const initialLoading = loading && count === 0;

  // i18next picks the plural form per locale — a `count === 1` ternary would be
  // wrong in French, where 0 takes the singular.
  const subtitle = hasShipments
    ? t("driver.home.activeDeliveries", { count })
    : t("driver.home.noShipments");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <DriverHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor="#036BB4"
            colors={["#036BB4"]}
          />
        }
      >
        {/* Title block */}
        <Text style={styles.title}>{t("driver.home.title")}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {/* States */}
        {initialLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#036BB4" />
            <Text style={styles.centerStateText}>{t("driver.home.loading")}</Text>
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <View style={styles.errorIcon}>
              <AlertCircle size={26} color="#EF4444" strokeWidth={2} />
            </View>
            <Text style={styles.errorTitle}>{t("driver.home.loadErrorTitle")}</Text>
            {/* `error` is a raw axios/network message — English and outside i18n. */}
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              activeOpacity={0.85}
              onPress={refresh}
            >
              <Text style={styles.retryText}>{t("driver.home.tryAgain")}</Text>
            </TouchableOpacity>
          </View>
        ) : !hasShipments ? (
          <EmptyShipments onRefresh={refresh} refreshing={loading} />
        ) : (
          <View style={styles.list}>
            {shipments.map((item) => (
              <ShipmentCard
                key={item.id}
                shipment={item}
                onPress={() =>
                  navigation.navigate("ShipmentDetail", { shipment: item })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.bottomInset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1C1E",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 4,
    marginBottom: 22,
  },
  list: {
    flex: 1,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 56,
    paddingHorizontal: 8,
  },
  centerStateText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  errorIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1A1C1E",
  },
  errorText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    maxWidth: 300,
  },
  retryButton: {
    marginTop: 22,
    paddingVertical: 11,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: "#036BB4",
  },
  retryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bottomInset: {
    backgroundColor: "#F3F4F6",
  },
});
