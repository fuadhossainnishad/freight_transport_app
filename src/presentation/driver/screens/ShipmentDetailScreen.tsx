import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import type { ParseKeys } from 'i18next';
import { ArrowLeft, Navigation } from 'lucide-react-native';
import { formatPriceRange } from '../helper/format-price.helper';

// Keys are backend enums — never translate them. Only labelKey is translated.
const STATUS_CONFIG: Record<string, { labelKey: ParseKeys; color: string }> = {
  PENDING: { labelKey: 'driver.status.pending', color: '#F59E0B' },
  IN_PROGRESS: { labelKey: 'driver.status.inProgress', color: '#0071BC' },
  IN_TRANSIT: { labelKey: 'driver.status.inTransit', color: '#8B5CF6' },
  COMPLETED: { labelKey: 'driver.status.completed', color: '#22C55E' },
};

const truckPlaceholder = require('../../../../assets/images/truck.png');

// Empty fields shouldn't render as blank gaps — fall back to an em dash.
const show = (v?: string | number | null) => {
  const s = v == null ? '' : String(v).trim();
  return s.length ? s : '—';
};

const ShipmentDetailScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { shipment } = route.params;

  const statusConfig = STATUS_CONFIG[shipment.status];
  // Unmapped statuses still fall back to the raw backend enum, as before.
  const status = {
    label: statusConfig
      ? t(statusConfig.labelKey)
      : shipment.status ?? t('driver.status.unknown'),
    color: statusConfig?.color ?? '#94A3B8',
  };
  // PENDING / IN_PROGRESS → not started yet, offer to start.
  // IN_TRANSIT → already on the road, offer to re-open the live map.
  // COMPLETED → no action.
  const action =
    shipment.status === 'IN_TRANSIT'
      ? { label: t('driver.shipmentDetail.continueTracking'), showMapIcon: true }
      : shipment.status === 'PENDING' || shipment.status === 'IN_PROGRESS'
        ? { label: t('driver.shipmentDetail.startShipment'), showMapIcon: false }
        : null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('driver.shipmentDetail.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* SHIPMENT IMAGE with status badge overlay */}
        <View style={styles.imageWrap}>
          <Image
            source={shipment.imageUrl ? { uri: shipment.imageUrl } : truckPlaceholder}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{status.label}</Text>
          </View>
        </View>

        {/* SECTION: BASIC INFORMATION */}
        <Text style={styles.sectionTitle}>{t('driver.shipmentDetail.basicInformation')}</Text>
        <View style={styles.gridBox}>
          <View style={styles.gridRow}>
            <View style={[styles.gridCell, styles.borderRight]}>
              <Text style={styles.label}>{t('driver.shipmentDetail.shipmentTitle')}</Text>
              <Text style={styles.value}>{show(shipment.title)}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.label}>{t('driver.shipmentDetail.category')}</Text>
              <Text style={styles.value}>{show(shipment.commodity)}</Text>
            </View>
          </View>

          <View style={[styles.gridCellFull, styles.borderTop]}>
            <Text style={styles.label}>{t('driver.shipmentDetail.description')}</Text>
            <Text style={styles.value}>{show(shipment.description)}</Text>
          </View>

          <View style={[styles.gridRow, styles.borderTop]}>
            <View style={[styles.gridCell, styles.borderRight]}>
              <Text style={styles.label}>{t('driver.shipmentDetail.weight')}</Text>
              <Text style={styles.value}>{show(shipment.weight)}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.label}>{t('driver.shipmentDetail.dimensions')}</Text>
              <Text style={styles.value}>{show(shipment.dimensions)}</Text>
            </View>
          </View>

          <View style={[styles.gridCellFull, styles.borderTop]}>
            <Text style={styles.label}>{t('driver.shipmentDetail.packaging')}</Text>
            <Text style={styles.value}>{show(shipment.packaging)}</Text>
          </View>
        </View>

        {/* SECTION: PICKUP & DELIVERY DETAILS */}
        <Text style={styles.sectionTitle}>{t('driver.shipmentDetail.pickupAndDelivery')}</Text>
        <View style={styles.gridBox}>
          <View style={styles.gridRow}>
            <View style={[styles.gridCell, styles.borderRight]}>
              <Text style={styles.label}>{t('driver.shipmentDetail.pickupAddress')}</Text>
              <Text style={styles.value}>{show(shipment.pickupAddress)}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.label}>{t('driver.shipmentDetail.timeWindow')}</Text>
              <Text style={styles.value}>{show(shipment.timeWindow)}</Text>
            </View>
          </View>
          <View style={[styles.gridRow, styles.borderTop]}>
            <View style={[styles.gridCell, styles.borderRight]}>
              <Text style={styles.label}>{t('driver.shipmentDetail.deliveryAddress')}</Text>
              <Text style={styles.value}>{show(shipment.deliveryAddress)}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.label}>{t('driver.shipmentDetail.contactPerson')}</Text>
              <Text style={styles.value}>{show(shipment.contactPerson)}</Text>
            </View>
          </View>
        </View>

        {/* SECTION: AMOUNT */}
        <Text style={styles.sectionTitle}>{t('driver.shipmentDetail.amount')}</Text>
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>{t('driver.shipmentDetail.agreedPrice')}</Text>
          <Text style={styles.priceValue}>
            {formatPriceRange(shipment.priceMin, shipment.priceMax)}
          </Text>
        </View>

        {/* ACTION BUTTON — start the shipment, or re-open the live map when in transit */}
        {action && (
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => (navigation as any).navigate('LiveTracking', { shipment })}
          >
            {action.showMapIcon && (
              <Navigation size={18} color="#FFFFFF" strokeWidth={2.2} />
            )}
            <Text style={styles.buttonText}>{action.label}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 54,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },
  imageWrap: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: 190,
    backgroundColor: '#F3F4F6',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginRight: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 10,
    color: '#1A1C1E',
    letterSpacing: -0.2,
  },
  gridBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF1F4',
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0A4E80',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 1 },
    }),
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    padding: 14,
  },
  gridCellFull: {
    width: '100%',
    padding: 14,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#EEF1F4',
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#EEF1F4',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C1E',
    lineHeight: 20,
  },
  amountBox: {
    backgroundColor: '#E9F3F9',
    borderWidth: 1,
    borderColor: '#D6E8F8',
    borderRadius: 14,
    padding: 16,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#036BB4',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#036BB4',
    letterSpacing: -0.3,
  },
  primaryButton: {
    backgroundColor: '#0071BC',
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    ...Platform.select({
      ios: {
        shadowColor: '#0071BC',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default ShipmentDetailScreen;
