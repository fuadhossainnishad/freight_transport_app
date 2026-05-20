import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { LocationGate } from "../components/LocationGate";
import DriverHeader from "../components/DriverHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShipmentCard } from "../components/ShipmentCard";
import { useNavigation } from "@react-navigation/native";
import { useDriverShipments } from "../hooks/useDriverShipments";

export default function DriverHomeScreen() {
  return (
    <LocationGate>
      <DriverHomeContent />
    </LocationGate>
  );
}

function DriverHomeContent() {
  const navigation = useNavigation<any>();
  const { shipments, loading, error, refresh } = useDriverShipments();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <DriverHeader />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        <Text style={styles.title}>My Shipments</Text>

        {loading && shipments.length === 0 && (
          <ActivityIndicator size="large" color="#0071BC" style={styles.loader} />
        )}

        {!loading && error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {!loading && !error && shipments.length === 0 && (
          <Text style={styles.emptyText}>No shipments assigned yet.</Text>
        )}

        {shipments.map((item) => (
          <ShipmentCard
            key={item.id}
            shipment={item}
            onPress={() => navigation.navigate("ShipmentDetail", { shipment: item })}
          />
        ))}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#F3F4F6' }} />
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
    padding: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    textAlign: "center",
    marginTop: 40,
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
  },
});
