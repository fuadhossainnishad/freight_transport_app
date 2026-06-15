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
import { ActiveShipmentsStackParamList } from '../../../navigation/types';
import AppHeader from '../../../shared/components/AppHeader';
import { getShipmentDetailsUseCase } from '../../../domain/usecases/shipment.usecase';

const PLACEHOLDER = require('../../../../assets/images/truck.png');

type RoutePropType = RouteProp<ActiveShipmentsStackParamList, 'ShipperShipmentDetail'>;
type NavigationPropType = NativeStackNavigationProp<ActiveShipmentsStackParamList, 'ShipperShipmentDetail'>;

const STATUS: Record<string, { label: string; bg: string }> = {
  IN_PROGRESS: { label: 'In progress', bg: '#F97316' },
  IN_TRANSIT: { label: 'In transit', bg: '#2563EB' },
  COMPLETED: { label: 'Delivered', bg: '#22C55E' },
  DELIVERED: { label: 'Delivered', bg: '#22C55E' },
  BIDDING: { label: 'Bidding', bg: '#0EA5E9' },
  PENDING: { label: 'Pending', bg: '#64748B' },
  CANCELLED: { label: 'Cancelled', bg: '#EF4444' },
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
        <Text style={{ color: '#6B7280' }}>Shipment not found</Text>
      </SafeAreaView>
    );
  }

  const status = STATUS[data.status] ?? { label: data.status, bg: '#64748B' };
  const image = data.images?.[0] ?? null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppHeader text="Shipment Detail" onpress={() => navigation.goBack()} />

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
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Field label="Shipment title" value={data.title} />
            <Field label="Category" value={data.category} />
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Field label="Description" value={data.description} />
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Field label="Weight" value={data.weight ? `${data.weight} kg` : null} />
            <Field label="Dimensions (L/W/H)" value={data.dimensions} accent />
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Field label="Type of packaging" value={data.packaging} />
          </View>
        </View>

        {/* Pickup & Delivery Details */}
        <Text style={styles.sectionTitle}>Pickup & Delivery Details</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Field label="Pickup Address" value={data.pickup} />
            <Field label="Time Window" value={data.timeWindow} />
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Field label="Delivery Address" value={data.delivery} />
            <Field label="Contact Person" value={data.contactPerson} />
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Field label="Date Preference" value={data.datePreference} />
          </View>
        </View>

        {/* Amount */}
        <Text style={styles.sectionTitle}>Amount</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Field label="Price" value={data.price != null ? `${data.price}` : null} />
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
