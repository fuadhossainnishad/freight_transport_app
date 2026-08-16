import { memo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ArrowRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Shipment } from "../../../domain/entities/shipment.entity";
import { Driver } from "../../driver/types";
import ShipmentMapRoute from "./ShipmentMapRoute";

const truckPlaceholder = require("../../../../assets/images/truck.png");

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_WIDTH = SCREEN_WIDTH * 0.85;

// ── Driving licence icon ──────────────────────────────────────────────────────
function LicenceIcon({ color = "#036BB4" }: { color?: string }) {
  return (
    <View style={[styles.licenceIconBox, { borderColor: color }]}>
      <View style={[styles.licenceIconLine, { backgroundColor: color, width: 18 }]} />
      <View style={[styles.licenceIconLine, { backgroundColor: color, width: 12, marginTop: 3 }]} />
      <View style={[styles.licenceIconLine, { backgroundColor: color, width: 15, marginTop: 3 }]} />
    </View>
  );
}

// ── Separator ─────────────────────────────────────────────────────────────────
function ColSep() {
  return <View style={styles.colSep} />;
}

type Props = {
  shipment: Shipment;
  // undefined = still loading, null = not found, Driver = loaded
  driver: Driver | null | undefined;
  onViewDetails: () => void;
};

export const ActiveShipmentDetail = memo(function ActiveShipmentDetail({
  shipment,
  driver,
  onViewDetails,
}: Props) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [imgPage, setImgPage] = useState(0);

  const licenceImages = [driver?.licenseFront, driver?.licenseBack].filter(
    Boolean
  ) as string[];

  // undefined = still in-flight, null = 404 not found
  const driverLoading = shipment.driverId && driver === undefined;
  const driverNotFound = shipment.driverId && driver === null;

  return (
    <View style={styles.wrapper}>

      {/* ── DRIVER DETAILS CARD ──────────────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>{t("transporter.activeShipmentDetail.driverDetailsTitle")}</Text>

      <View style={styles.driverCard}>
        {driverLoading ? (
          <ActivityIndicator color="#036BB4" style={{ paddingVertical: 16 }} />
        ) : driverNotFound ? (
          <Text style={styles.emptyText}>{t("transporter.activeShipmentDetail.driverNotFound")}</Text>
        ) : !shipment.driverId ? (
          <Text style={styles.emptyText}>{t("transporter.activeShipmentDetail.noDriverAssigned")}</Text>
        ) : (
          <View style={styles.driverRow}>
            {/* Name */}
            <View style={styles.col}>
              <Text style={styles.colLabel}>{t("transporter.activeShipmentDetail.name")}</Text>
              <Text style={styles.colValue} numberOfLines={2}>{driver?.name}</Text>
            </View>

            <ColSep />

            {/* Phone */}
            <View style={styles.col}>
              <Text style={styles.colLabel}>{t("transporter.activeShipmentDetail.phone")}</Text>
              <Text style={styles.colValue} numberOfLines={1}>{driver?.phone}</Text>
            </View>

            <ColSep />

            {/* Driving Licence */}
            <View style={[styles.col, { alignItems: "center" }]}>
              <Text style={styles.colLabel}>{t("transporter.activeShipmentDetail.drivingLicence")}</Text>
              <TouchableOpacity
                onPress={() => licenceImages.length > 0 && setModalVisible(true)}
                activeOpacity={0.75}
                disabled={licenceImages.length === 0}
              >
                <LicenceIcon color={licenceImages.length > 0 ? "#036BB4" : "#9ca3af"} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* ── MAP ──────────────────────────────────────────────────────────────── */}
      <ShipmentMapRoute
        shipmentId={shipment.id}
        pickupAddress={shipment.pickup}
        deliveryAddress={shipment.delivery}
        pickupCoord={shipment.pickupCoord}
        deliveryCoord={shipment.deliveryCoord}
        status={shipment.status}
        live
      />

      {/* ── SHIPMENT DETAILS CARD ────────────────────────────────────────────── */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{t("transporter.activeShipmentDetail.shipmentDetailsTitle")}</Text>

      <View style={styles.shipmentCard}>
        {/* Image */}
        <Image
          source={shipment.images?.[0] ? { uri: shipment.images[0] } : truckPlaceholder}
          style={styles.shipmentImage}
          resizeMode={shipment.images?.[0] ? "cover" : "contain"}
        />

        {/* Title + description */}
        <View style={styles.shipmentBody}>
          <Text style={styles.shipmentTitle} numberOfLines={2}>{shipment.title}</Text>
          {(shipment.packaging || shipment.description) ? (
            <Text style={styles.shipmentDesc} numberOfLines={2}>
              {shipment.packaging || shipment.description}
            </Text>
          ) : null}

          <View style={styles.shipmentDivider} />

          {/* Row 1: Pickup | Delivery */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>{t("transporter.activeShipmentDetail.pickupAddress")}</Text>
              <Text style={styles.infoValue} numberOfLines={2}>{shipment.pickup || "—"}</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>{t("transporter.activeShipmentDetail.deliveryAddress")}</Text>
              <Text style={styles.infoValue} numberOfLines={2}>{shipment.delivery || "—"}</Text>
            </View>
          </View>

          {/* Row 2: Contact person | Contact number */}
          {(shipment.contactPerson) ? (
            <View style={[styles.infoGrid, { marginTop: 12 }]}>
              <View style={styles.infoCell}>
                <Text style={styles.infoLabel}>{t("transporter.activeShipmentDetail.contactPerson")}</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{shipment.contactPerson}</Text>
              </View>
              <View style={styles.infoCell}>
                <Text style={styles.infoLabel}>{t("transporter.activeShipmentDetail.contactPersonNumber")}</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{driver?.phone ?? "—"}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.shipmentDivider} />

          {/* View full details button */}
          <TouchableOpacity
            onPress={onViewDetails}
            style={styles.detailsBtn}
            activeOpacity={0.75}
          >
            <Text style={styles.detailsBtnText}>{t("transporter.activeShipmentDetail.viewFullDetails")}</Text>
            <ArrowRight size={15} color="#0071BC" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── LIQUID GLASS LICENCE MODAL ───────────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
          <Pressable onPress={() => {}} style={styles.modalOuter}>
            {/* Outer glow ring */}
            <LinearGradient
              colors={["rgba(255,255,255,0.55)", "rgba(200,230,255,0.25)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassRing}
            >
              {/* Inner glass card */}
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.97)",
                  "rgba(235,247,255,0.95)",
                  "rgba(220,240,255,0.92)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassCard}
              >
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{t("transporter.activeShipmentDetail.drivingLicence")}</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Page indicator */}
                {licenceImages.length > 1 && (
                  <View style={styles.pageRow}>
                    {licenceImages.map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.pageDot,
                          i === imgPage && styles.pageDotActive,
                        ]}
                      />
                    ))}
                  </View>
                )}

                {/* Images */}
                <FlatList
                  data={licenceImages}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(_, i) => String(i)}
                  onMomentumScrollEnd={(e) => {
                    const page = Math.round(
                      e.nativeEvent.contentOffset.x / (MODAL_WIDTH - 32)
                    );
                    setImgPage(page);
                  }}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item }}
                      style={styles.licenceImage}
                      resizeMode="contain"
                    />
                  )}
                />

                {/* Label */}
                <Text style={styles.imgLabel}>
                  {licenceImages.length > 1
                    ? imgPage === 0
                      ? t("transporter.activeShipmentDetail.frontSide")
                      : t("transporter.activeShipmentDetail.backSide")
                    : t("transporter.activeShipmentDetail.licence")}
                </Text>
              </LinearGradient>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },

  // ── driver card ──
  driverCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  col: {
    flex: 1,
  },
  colSep: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 10,
  },
  colLabel: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "600",
    marginBottom: 5,
  },
  colValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  emptyText: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
    paddingVertical: 8,
  },

  // ── shipment details card ──
  shipmentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  shipmentImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#f3f4f6",
  },
  shipmentBody: {
    padding: 14,
  },
  shipmentTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  shipmentDesc: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 17,
  },
  shipmentDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 12,
  },
  infoCell: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9ca3af",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 18,
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#0071BC",
    borderRadius: 12,
    paddingVertical: 11,
  },
  detailsBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0071BC",
  },

  // ── licence icon ──
  licenceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
  },
  licenceIconLine: {
    height: 2.5,
    borderRadius: 2,
  },

  // ── modal backdrop ──
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(10, 20, 40, 0.72)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOuter: {
    width: MODAL_WIDTH,
  },

  // ── liquid glass ──
  glassRing: {
    borderRadius: 28,
    padding: 1.5,
    shadowColor: "#0071BC",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 20,
  },
  glassCard: {
    borderRadius: 27,
    paddingTop: 18,
    paddingBottom: 22,
    paddingHorizontal: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
  },

  // ── modal header ──
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(15,23,42,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
  },

  // ── page dots ──
  pageRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 10,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0,113,188,0.25)",
  },
  pageDotActive: {
    width: 18,
    backgroundColor: "#0071BC",
  },

  // ── licence image ──
  licenceImage: {
    width: MODAL_WIDTH - 32,
    height: 210,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
  },
  imgLabel: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    letterSpacing: 0.3,
  },
});
