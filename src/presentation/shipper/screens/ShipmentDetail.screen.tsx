import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { ParseKeys } from 'i18next';
import { ActiveShipmentsStackParamList } from '../../../navigation/types';
import AppHeader from '../../../shared/components/AppHeader';
import { useShipmentOptions } from '../../../shared/i18n/useShipmentOptions';
import { getShipmentDetailsUseCase } from '../../../domain/usecases/shipment.usecase';

const PLACEHOLDER = require('../../../../assets/images/truck.png');

type RoutePropType = RouteProp<ActiveShipmentsStackParamList, 'ShipperShipmentDetail'>;
type NavigationPropType = NativeStackNavigationProp<ActiveShipmentsStackParamList, 'ShipperShipmentDetail'>;

// Keys are backend enums — never translate them. Only labelKey is translated.
const STATUS: Record<string, { labelKey: ParseKeys; bg: string }> = {
  IN_PROGRESS: { labelKey: 'shipper.status.inProgress', bg: '#F97316' },
  IN_TRANSIT: { labelKey: 'shipper.status.inTransit', bg: '#2563EB' },
  COMPLETED: { labelKey: 'shipper.status.delivered', bg: '#22C55E' },
  DELIVERED: { labelKey: 'shipper.status.delivered', bg: '#22C55E' },
  BIDDING: { labelKey: 'shipper.status.bidding', bg: '#0EA5E9' },
  PENDING: { labelKey: 'shipper.status.pending', bg: '#64748B' },
  CANCELLED: { labelKey: 'shipper.status.cancelled', bg: '#EF4444' },
};

// One labelled field inside a card. `accent` renders the value in red (used for dimensions).
function Field({
  label,
  value,
  accent,
}: {
  label: string;
  value?: string | number | null;
  accent?: boolean;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={[styles.fieldLabel, accent && { color: '#EF4444' }]}>{label}</Text>
      <Text style={[styles.fieldValue, accent && { color: '#EF4444' }]}>{value ?? '-'}</Text>
    </View>
  );
}

export default function ShipmentDetailScreen() {
  const { t } = useTranslation();
  // data.category / data.packaging arrive from the API as English values.
  const { categoryLabel, packagingLabel } = useShipmentOptions();
  const navigation = useNavigation<NavigationPropType>();
  const route = useRoute<RoutePropType>();
  const { shipmentId } = route.params;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getShipmentDetailsUseCase(shipmentId);
        setData(res);
      } catch (err) {
        console.error('ShipmentDetail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shipmentId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#036BB4" />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: '#6B7280' }}>{t('shipper.detail.notFound')}</Text>
      </SafeAreaView>
    );
  }

  // Unmapped statuses still fall back to the raw backend enum, as before.
  const statusConfig = STATUS[data.status];
  const status = {
    label: statusConfig ? t(statusConfig.labelKey) : data.status,
    bg: statusConfig?.bg ?? '#64748B',
  };
  const image = data.images?.[0] ?? null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppHeader text={t('shipper.detail.title')} onpress={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Status badge */}
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{status.label}</Text>
        </View>

        {/* Shipment image */}
        <Image
          source={image ? { uri: image } : PLACEHOLDER}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Basic Information */}
        <Text style={styles.sectionTitle}>{t('shipper.detail.basicInformation')}</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Field label={t('shipper.detail.shipmentTitle')} value={data.title} />
            {/* Stored English value -> translated label. */}
            <Field label={t('shipper.detail.category')} value={categoryLabel(data.category)} />
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Field label={t('shipper.detail.description')} value={data.description} />
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Field
              label={t('shipper.detail.weight')}
              value={data.weight ? t('shipper.detail.weightValue', { value: data.weight }) : null}
            />
            <Field label={t('shipper.detail.dimensions')} value={data.dimensions} accent />
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Field label={t('shipper.detail.packaging')} value={packagingLabel(data.packaging)} />
          </View>
        </View>

        {/* Pickup & Delivery Details */}
        <Text style={styles.sectionTitle}>{t('shipper.detail.pickupAndDelivery')}</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Field label={t('shipper.detail.pickupAddress')} value={data.pickup} />
            <Field label={t('shipper.detail.timeWindow')} value={data.timeWindow} />
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Field label={t('shipper.detail.deliveryAddress')} value={data.delivery} />
            <Field label={t('shipper.detail.contactPerson')} value={data.contactPerson} />
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Field label={t('shipper.detail.datePreference')} value={data.datePreference} />
          </View>
        </View>

        {/* Amount */}
        <Text style={styles.sectionTitle}>{t('shipper.detail.amount')}</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Field label={t('shipper.detail.price')} value={data.price != null ? `${data.price}` : null} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 14,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  heroImage: { width: '100%', height: 190, borderRadius: 14, backgroundColor: '#F1F5F9' },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 20, marginBottom: 10 },

  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  cardRow: { flexDirection: 'row', gap: 12 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },

  fieldLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 6 },
  fieldValue: { fontSize: 15, fontWeight: '700', color: '#111827' },
});
