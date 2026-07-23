import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";
import { useTranslation } from "react-i18next";

import { ActiveShipmentsStackParamList } from "../../../navigation/types";
import { getShipmentDetailsUseCase } from "../../../domain/usecases/shipment.usecase";
import { getDriverByIdsUseCase } from "../../../domain/usecases/driver.usecase";
import { Driver } from "../../driver/types";
import ShipmentMapRoute from "../../transporter/components/ShipmentMapRoute";
import { useShipmentOptions } from "../../../shared/i18n/useShipmentOptions";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MODAL_WIDTH = SCREEN_WIDTH * 0.85;
const CARD_IMAGE_HEIGHT = 140;

const truckPlaceholder = require("../../../../assets/images/truck.png");

type RoutePropType = RouteProp<ActiveShipmentsStackParamList, "ShipmentDetails">;
type NavigationPropType = NativeStackNavigationProp<
  ActiveShipmentsStackParamList,
  "ShipmentDetails"
>;

function LicenceIcon({ color = "#036BB4" }: { color?: string }) {
  return (
    <View style={[styles.licenceIconBox, { borderColor: color }]}>
      <View style={[styles.licenceIconLine, { backgroundColor: color, width: 18 }]} />
      <View style={[styles.licenceIconLine, { backgroundColor: color, width: 12, marginTop: 3 }]} />
      <View style={[styles.licenceIconLine, { backgroundColor: color, width: 15, marginTop: 3 }]} />
    </View>
  );
}

function ColSep() {
  return <View style={styles.colSep} />;
}

function Header({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ArrowLeft size={22} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{t("transporter.home.activeShipments")}</Text>
      <View style={{ width: 36 }} />
    </View>
  );
}

export default function ShipmentDetailsScreen() {
  const navigation = useNavigation<NavigationPropType>();
  const route = useRoute<RoutePropType>();
  const { shipmentId } = route.params;
  const { t } = useTranslation();
  const { categoryLabel } = useShipmentOptions();

  const [shipment, setShipment] = useState<any>(null);
  const [driver, setDriver] = useState<Driver | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [imgPage, setImgPage] = useState(0);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getShipmentDetailsUseCase(shipmentId);
      setShipment(data);

      if (data.driverId) {
        try {
          const d = await getDriverByIdsUseCase(data.driverId);
          setDriver(d);
        } catch {
          setDriver(null);
        }
      } else {
        setDriver(null);
      }
    } catch (err) {
      console.error("ShipmentDetails fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.screen}>
        <Header onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0071BC" />
        </View>
      </SafeAreaView>
    );
  }

  if (!shipment) {
    return (
      <SafeAreaView edges={["top"]} style={styles.screen}>
        <Header onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.emptyText}>{t("transporter.activeShipmentDetail.shipmentNotFound")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const licenceImages = [driver?.licenseFront, driver?.licenseBack].filter(
    Boolean
  ) as string[];
  const driverLoading = !!shipment.driverId && driver === undefined;
  const driverNotFound = !!shipment.driverId && driver === null;
  const imageUri = shipment.images?.[0] ?? null;

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <Header onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── SHIPMENT PREVIEW CARD ─────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>{t("transporter.home.activeShipments")}</Text>

        <View style={styles.previewCard}>
          <View style={styles.activeDot} />
          <View style={styles.previewImageBox}>
            <Image
              source={imageUri ? { uri: imageUri } : truckPlaceholder}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.previewInfo}>
            <Text style={styles.previewTitle} numberOfLines={1}>
              {shipment.title ?? t("transporter.home.shipmentFallbackTitle")}
            </Text>
            <Text style={styles.previewCategory} numberOfLines={1}>
              {categoryLabel(shipment.category)}
            </Text>
          </View>
        </View>

        {/* ── DRIVER DETAILS ────────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>{t("transporter.activeShipmentDetail.driverDetailsTitle")}</Text>

        <View style={styles.driverCard}>
          {driverLoading ? (
            <ActivityIndicator color="#036BB4" style={{ paddingVertical: 16 }} />
          ) : driverNotFound ? (
            <Text style={styles.emptyDriverText}>{t("transporter.activeShipmentDetail.driverNotFound")}</Text>
          ) : !shipment.driverId ? (
            <Text style={styles.emptyDriverText}>{t("transporter.activeShipmentDetail.noDriverAssigned")}</Text>
          ) : (
            <View style={styles.driverRow}>
              <View style={styles.col}>
                <Text style={styles.colLabel}>{t("transporter.activeShipmentDetail.name")}</Text>
                <Text style={styles.colValue} numberOfLines={2}>
                  {driver?.name ?? shipment.driver?.name ?? "—"}
                </Text>
              </View>

              <ColSep />

              <View style={styles.col}>
                <Text style={styles.colLabel}>{t("transporter.activeShipmentDetail.phone")}</Text>
                <Text style={styles.colValue} numberOfLines={1}>
                  {driver?.phone ?? shipment.driver?.phone ?? "—"}
                </Text>
              </View>

              <ColSep />

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

        {/* ── MAP ───────────────────────────────────────────────────────────── */}
        <ShipmentMapRoute
          shipmentId={shipmentId}
          pickupAddress={shipment.pickup}
          deliveryAddress={shipment.delivery}
          pickupCoord={shipment.pickupCoord}
          deliveryCoord={shipment.deliveryCoord}
          status={shipment.status}
          live
        />

        {/* ── SHIPMENT DETAILS CARD ─────────────────────────────────────────── */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>{t("transporter.activeShipmentDetail.shipmentDetailsTitle")}</Text>

        <View style={styles.detailsCard}>
          <Image
            source={imageUri ? { uri: imageUri } : truckPlaceholder}
            style={styles.detailsImage}
            resizeMode={imageUri ? "cover" : "contain"}
          />

          <View style={styles.detailsBody}>
            <Text style={styles.detailsTitle} numberOfLines={2}>
              {shipment.title}
            </Text>
            {(shipment.packaging || shipment.description) ? (
              <Text style={styles.detailsDesc} numberOfLines={2}>
                {shipment.packaging || shipment.description}
              </Text>
            ) : null}

            <View style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoCell}>
                <Text style={styles.infoLabel}>{t("transporter.activeShipmentDetail.pickupAddress")}</Text>
                <Text style={styles.infoValue} numberOfLines={2}>
                  {shipment.pickup || "—"}
                </Text>
              </View>
              <View style={styles.infoCell}>
                <Text style={styles.infoLabel}>{t("transporter.activeShipmentDetail.deliveryAddress")}</Text>
                <Text style={styles.infoValue} numberOfLines={2}>
                  {shipment.delivery || "—"}
                </Text>
              </View>
            </View>

            {shipment.contactPerson ? (
              <View style={[styles.infoGrid, { marginTop: 12 }]}>
                <View style={styles.infoCell}>
                  <Text style={styles.infoLabel}>{t("transporter.activeShipmentDetail.contactPerson")}</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>
                    {shipment.contactPerson}
                  </Text>
                </View>
                <View style={styles.infoCell}>
                  <Text style={styles.infoLabel}>{t("transporter.activeShipmentDetail.contactNumber")}</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>
                    {driver?.phone ?? shipment.driver?.phone ?? "—"}
                  </Text>
                </View>
              </View>
            ) : null}

            {(shipment.weight || shipment.category) ? (
              <>
                <View style={styles.divider} />
                <View style={styles.infoGrid}>
                  {shipment.category ? (
                    <View style={styles.infoCell}>
                      <Text style={styles.infoLabel}>{t("transporter.activeShipmentDetail.category")}</Text>
                      <Text style={styles.infoValue}>{categoryLabel(shipment.category)}</Text>
                    </View>
                  ) : null}
                  {shipment.weight ? (
                    <View style={styles.infoCell}>
                      <Text style={styles.infoLabel}>{t("transporter.activeShipmentDetail.weight")}</Text>
                      <Text style={styles.infoValue}>{shipment.weight}</Text>
                    </View>
                  ) : null}
                </View>
              </>
            ) : null}

            <View style={styles.divider} />

            <TouchableOpacity
              onPress={() => navigation.navigate("ShipmentTracking", { shipmentId })}
              style={styles.viewDetailsBtn}
              activeOpacity={0.75}
            >
              <Text style={styles.viewDetailsBtnText}>{t("transporter.activeShipmentDetail.viewFullDetails")}</Text>
              <ArrowRight size={15} color="#0071BC" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── LIQUID GLASS LICENCE MODAL ────────────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
          <Pressable onPress={() => {}} style={{ width: MODAL_WIDTH }}>
            <LinearGradient
              colors={["rgba(255,255,255,0.55)", "rgba(200,230,255,0.25)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassRing}
            >
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

                {licenceImages.length > 1 && (
                  <View style={styles.pageRow}>
                    {licenceImages.map((_, i) => (
                      <View
                        key={i}
                        style={[styles.pageDot, i === imgPage && styles.pageDotActive]}
                      />
                    ))}
                  </View>
                )}

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginTop: 20,
    marginBottom: 10,
  },

  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  activeDot: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F97316",
    zIndex: 1,
  },
  previewImageBox: {
    width: "100%",
    height: CARD_IMAGE_HEIGHT,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: SCREEN_WIDTH - 48,
    height: CARD_IMAGE_HEIGHT - 16,
  },
  previewInfo: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  previewCategory: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },

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
  emptyDriverText: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
    paddingVertical: 8,
  },

  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  detailsImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#f3f4f6",
  },
  detailsBody: {
    padding: 14,
  },
  detailsTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  detailsDesc: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 17,
  },
  divider: {
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

  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#0071BC",
    borderRadius: 12,
    paddingVertical: 11,
  },
  viewDetailsBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0071BC",
  },

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

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(10, 20, 40, 0.72)",
    justifyContent: "center",
    alignItems: "center",
  },
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
