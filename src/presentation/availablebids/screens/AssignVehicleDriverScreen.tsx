import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
  Modal,
  Animated,
  Dimensions,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User, Truck, DollarSign, Search, Check,
  ChevronRight, X, Phone, Mail, Hash,
  Gauge, CalendarDays, ArrowLeft,
} from 'lucide-react-native';

import { AvailableBidsStackParamList } from '../../../navigation/types';
import { useAuth } from '../../../app/context/Auth.context';
import { fetchTransporterDrivers } from '../../../data/services/driverService';
import { searchVehicles } from '../../../data/services/vehicleService';
import { createBid } from '../../../data/services/bidService';
import { getSocket } from '../../../data/socket/socketClient';
import { normalizeImageUrl } from '../../../shared/utils/normalizeImageUrl';

type RoutePropType = RouteProp<AvailableBidsStackParamList, 'AssignVehicleDriver'>;
type NavigationPropType = NativeStackNavigationProp<AvailableBidsStackParamList, 'AssignVehicleDriver'>;

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H = SCREEN_H * 0.75;
const BLUE = '#036BB4';
const BLUE_LIGHT = '#EFF6FF';
const BLUE_MID = '#0284c7';

/* ─────────────────────────────────────────────────────
   BOTTOM SHEET
───────────────────────────────────────────────────── */
function BottomSheet({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SHEET_H)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : SHEET_H,
      useNativeDriver: true,
      damping: 20,
      stiffness: 180,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Pressable style={bs.backdrop} onPress={onClose} />

      {/* Sheet */}
      <Animated.View
        style={[bs.sheet, { height: SHEET_H, paddingBottom: insets.bottom + 8, transform: [{ translateY }] }]}
      >
        {/* Handle */}
        <View style={bs.handle} />

        {/* Header */}
        <View style={bs.header}>
          <Text style={bs.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={bs.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {children}
      </Animated.View>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────────
   SEARCH INPUT
───────────────────────────────────────────────────── */
function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <View style={s.searchRow}>
      <Search size={16} color="#9ca3af" style={{ marginRight: 8 }} />
      <TextInput
        style={s.searchInput}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange('')} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          <X size={14} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ─────────────────────────────────────────────────────
   DRIVER CARD (inside sheet)
───────────────────────────────────────────────────── */
function DriverCard({ item, selected, onPress }: { item: any; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.72} style={[s.listCard, selected && s.listCardSelected]}>
      {/* Avatar */}
      <View style={[s.avatarCircle, selected && { backgroundColor: BLUE }]}>
        {item.profile_picture?.[0] ? (
          <Image source={{ uri: normalizeImageUrl(item.profile_picture[0]) }} style={s.avatarImg} />
        ) : (
          <User size={20} color={selected ? '#fff' : '#9ca3af'} />
        )}
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <Text style={[s.cardName, selected && { color: BLUE }]}>{item.driver_name}</Text>
        <View style={s.metaRow}>
          <Phone size={11} color="#9ca3af" />
          <Text style={s.metaText}>{item.phone}</Text>
        </View>
        <View style={s.metaRow}>
          <Mail size={11} color="#9ca3af" />
          <Text style={s.metaText} numberOfLines={1}>{item.email}</Text>
        </View>
      </View>

      {/* Check */}
      {selected
        ? <View style={s.checkCircle}><Check size={14} color="#fff" strokeWidth={3} /></View>
        : <ChevronRight size={16} color="#d1d5db" />
      }
    </TouchableOpacity>
  );
}

/* ─────────────────────────────────────────────────────
   VEHICLE CARD (inside sheet)
───────────────────────────────────────────────────── */
function VehicleCard({ item, selected, onPress }: { item: any; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.72} style={[s.listCard, selected && s.listCardSelected]}>
      {/* Icon */}
      <View style={[s.avatarCircle, { borderRadius: 12 }, selected && { backgroundColor: BLUE }]}>
        <Truck size={20} color={selected ? '#fff' : '#9ca3af'} />
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <Text style={[s.cardName, selected && { color: BLUE }]}>
          {item.vehicle_type} — {item.capicity}T
        </Text>
        <View style={s.metaRow}>
          <Hash size={11} color="#9ca3af" />
          <Text style={s.metaText}>Plate: {item.plate_number}</Text>
        </View>
        <View style={s.metaRow}>
          <Gauge size={11} color="#9ca3af" />
          <Text style={s.metaText}>{item.capicity} tons capacity</Text>
        </View>
        <View style={s.metaRow}>
          <CalendarDays size={11} color="#9ca3af" />
          <Text style={s.metaText}>Year: {item.year_model}</Text>
        </View>
      </View>

      {selected
        ? <View style={s.checkCircle}><Check size={14} color="#fff" strokeWidth={3} /></View>
        : <ChevronRight size={16} color="#d1d5db" />
      }
    </TouchableOpacity>
  );
}

/* ─────────────────────────────────────────────────────
   SELECTOR BUTTON (on the main form)
───────────────────────────────────────────────────── */
function SelectorButton({
  icon,
  label,
  sublabel,
  onPress,
  hasValue,
  onClear,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onPress: () => void;
  hasValue: boolean;
  onClear: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.78} style={[s.selector, hasValue && s.selectorFilled]}>
      <View style={[s.selectorIconBox, hasValue && { backgroundColor: BLUE }]}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.selectorLabel, hasValue && { color: BLUE, fontWeight: '700' }]}>{label}</Text>
        {sublabel && <Text style={s.selectorSub} numberOfLines={1}>{sublabel}</Text>}
      </View>
      {hasValue ? (
        <TouchableOpacity onPress={onClear} style={s.clearBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <X size={14} color="#6b7280" />
        </TouchableOpacity>
      ) : (
        <ChevronRight size={18} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );
}

/* ─────────────────────────────────────────────────────
   MAIN SCREEN
───────────────────────────────────────────────────── */
export default function AssignVehicleDriverScreen() {
  const navigation = useNavigation<NavigationPropType>();
  const route = useRoute<RoutePropType>();
  const { shipmentId } = route.params;
  const { user } = useAuth();
  const transporterId = user?.transporter_id!;

  /* data */
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  /* sheet state */
  const [driverSheetOpen, setDriverSheetOpen] = useState(false);
  const [vehicleSheetOpen, setVehicleSheetOpen] = useState(false);
  const [driverQuery, setDriverQuery] = useState('');
  const [vehicleQuery, setVehicleQuery] = useState('');

  /* selections */
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ driver?: string; vehicle?: string; price?: string }>({});

  /* load all on mount */
  useEffect(() => {
    fetchTransporterDrivers(transporterId, '', 1, 100)
      .then((res) => setDrivers(res?.data?.drivers ?? []))
      .catch(() => setDrivers([]))
      .finally(() => setLoadingDrivers(false));

    searchVehicles(transporterId)
      .then((data) => setVehicles(data ?? []))
      .catch(() => setVehicles([]))
      .finally(() => setLoadingVehicles(false));
  }, [transporterId]);

  /* client-side filter */
  const filteredDrivers = useMemo(() => {
    const q = driverQuery.toLowerCase();
    if (!q) return drivers;
    return drivers.filter(
      (d) => d.driver_name?.toLowerCase().includes(q) || d.phone?.includes(q) || d.email?.toLowerCase().includes(q),
    );
  }, [drivers, driverQuery]);

  const filteredVehicles = useMemo(() => {
    const q = vehicleQuery.toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter(
      (v) => v.vehicle_type?.toLowerCase().includes(q) || v.plate_number?.toLowerCase().includes(q),
    );
  }, [vehicles, vehicleQuery]);

  const isFormValid = !!(selectedDriver && selectedVehicle && price && Number(price) > 0);

  const validate = () => {
    const e: typeof errors = {};
    if (!selectedDriver) e.driver = 'Please select a driver';
    if (!selectedVehicle) e.vehicle = 'Please select a vehicle';
    if (!price) e.price = 'Price is required';
    else if (isNaN(Number(price)) || Number(price) <= 0) e.price = 'Enter a valid amount';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);
      const res = await createBid({
        transporter_id: transporterId,
        shipment_id: shipmentId,
        driver_id: selectedDriver._id,
        vehicle_id: selectedVehicle._id,
        bid_amount: Number(price),
      });
      getSocket()?.emit('new_bid', res?.data);
      Alert.alert('Success', 'Bid placed successfully');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message ?? err?.message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Place a Bid</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── STEP LABELS ── */}
          <Text style={s.stepHint}>Fill in all three fields to submit your bid</Text>

          {/* ── DRIVER SELECTOR ── */}
          <Text style={s.fieldLabel}>Driver</Text>
          <SelectorButton
            icon={<User size={18} color={selectedDriver ? '#fff' : '#9ca3af'} />}
            label={selectedDriver ? selectedDriver.driver_name : 'Select a driver'}
            sublabel={selectedDriver ? selectedDriver.phone : undefined}
            hasValue={!!selectedDriver}
            onPress={() => setDriverSheetOpen(true)}
            onClear={() => { setSelectedDriver(null); setErrors((p) => ({ ...p, driver: undefined })); }}
          />
          {errors.driver && <Text style={s.errorText}>{errors.driver}</Text>}

          {/* ── VEHICLE SELECTOR ── */}
          <Text style={[s.fieldLabel, { marginTop: 16 }]}>Vehicle</Text>
          <SelectorButton
            icon={<Truck size={18} color={selectedVehicle ? '#fff' : '#9ca3af'} />}
            label={selectedVehicle ? `${selectedVehicle.vehicle_type} — ${selectedVehicle.capicity}T` : 'Select a vehicle'}
            sublabel={selectedVehicle ? `Plate: ${selectedVehicle.plate_number}` : undefined}
            hasValue={!!selectedVehicle}
            onPress={() => setVehicleSheetOpen(true)}
            onClear={() => { setSelectedVehicle(null); setErrors((p) => ({ ...p, vehicle: undefined })); }}
          />
          {errors.vehicle && <Text style={s.errorText}>{errors.vehicle}</Text>}

          {/* ── BID AMOUNT ── */}
          <Text style={[s.fieldLabel, { marginTop: 16 }]}>Bid Amount</Text>
          <View style={[s.priceBox, errors.price && { borderColor: '#ef4444' }]}>
            <DollarSign size={18} color={price ? BLUE : '#9ca3af'} style={{ marginRight: 6 }} />
            <TextInput
              style={s.priceInput}
              value={price}
              onChangeText={(t) => { setPrice(t); setErrors((p) => ({ ...p, price: undefined })); }}
              placeholder="Enter your bid"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>
          {errors.price && <Text style={s.errorText}>{errors.price}</Text>}

          {/* ── SUMMARY CARD ── */}
          {(selectedDriver || selectedVehicle || price) ? (
            <View style={s.summaryCard}>
              <Text style={s.summaryHeading}>Bid Summary</Text>

              {selectedDriver && (
                <View style={s.summaryRow}>
                  <User size={13} color="#9ca3af" />
                  <Text style={s.summaryLabel}>Driver</Text>
                  <Text style={s.summaryValue}>{selectedDriver.driver_name}</Text>
                </View>
              )}
              {selectedVehicle && (
                <View style={s.summaryRow}>
                  <Truck size={13} color="#9ca3af" />
                  <Text style={s.summaryLabel}>Vehicle</Text>
                  <Text style={s.summaryValue}>
                    {selectedVehicle.vehicle_type} · Plate {selectedVehicle.plate_number}
                  </Text>
                </View>
              )}
              {price ? (
                <View style={s.summaryRow}>
                  <DollarSign size={13} color="#9ca3af" />
                  <Text style={s.summaryLabel}>Amount</Text>
                  <Text style={[s.summaryValue, { color: BLUE, fontWeight: '800' }]}>${price}</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* ── SUBMIT ── */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isFormValid || submitting}
            activeOpacity={0.85}
            style={[s.submitBtn, (!isFormValid || submitting) && s.submitDisabled]}
          >
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.submitText}>Place Bid</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── DRIVER BOTTOM SHEET ── */}
      <BottomSheet visible={driverSheetOpen} onClose={() => setDriverSheetOpen(false)} title="Select Driver">
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <SearchBar value={driverQuery} onChange={setDriverQuery} placeholder="Search by name, phone or email…" />
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          {loadingDrivers ? (
            <ActivityIndicator color={BLUE} style={{ marginTop: 24 }} />
          ) : filteredDrivers.length === 0 ? (
            <View style={s.emptyState}>
              <User size={32} color="#d1d5db" />
              <Text style={s.emptyText}>No drivers found</Text>
            </View>
          ) : (
            filteredDrivers.map((item) => (
              <DriverCard
                key={item._id}
                item={item}
                selected={selectedDriver?._id === item._id}
                onPress={() => {
                  setSelectedDriver(selectedDriver?._id === item._id ? null : item);
                  setErrors((p) => ({ ...p, driver: undefined }));
                  setDriverSheetOpen(false);
                  setDriverQuery('');
                }}
              />
            ))
          )}
        </ScrollView>
      </BottomSheet>

      {/* ── VEHICLE BOTTOM SHEET ── */}
      <BottomSheet visible={vehicleSheetOpen} onClose={() => setVehicleSheetOpen(false)} title="Select Vehicle">
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <SearchBar value={vehicleQuery} onChange={setVehicleQuery} placeholder="Search by type or plate…" />
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          {loadingVehicles ? (
            <ActivityIndicator color={BLUE} style={{ marginTop: 24 }} />
          ) : filteredVehicles.length === 0 ? (
            <View style={s.emptyState}>
              <Truck size={32} color="#d1d5db" />
              <Text style={s.emptyText}>No vehicles found</Text>
            </View>
          ) : (
            filteredVehicles.map((item) => (
              <VehicleCard
                key={item._id}
                item={item}
                selected={selectedVehicle?._id === item._id}
                onPress={() => {
                  setSelectedVehicle(selectedVehicle?._id === item._id ? null : item);
                  setErrors((p) => ({ ...p, vehicle: undefined }));
                  setVehicleSheetOpen(false);
                  setVehicleQuery('');
                }}
              />
            ))
          )}
        </ScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
}

/* ─────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────── */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },

  scroll: { padding: 16, paddingBottom: 40 },

  stepHint: { fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 18 },

  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 },

  /* Selector */
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  selectorFilled: { borderColor: BLUE, backgroundColor: BLUE_LIGHT },
  selectorIconBox: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center',
  },
  selectorLabel: { fontSize: 14, fontWeight: '500', color: '#9ca3af' },
  selectorSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  clearBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center',
  },

  /* Price */
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingHorizontal: 14,
    height: 54,
  },
  priceInput: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111827' },

  /* Summary */
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginTop: 20,
    gap: 10,
  },
  summaryHeading: { fontSize: 13, fontWeight: '800', color: '#111827', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryLabel: { fontSize: 12, color: '#9ca3af', fontWeight: '600', width: 56 },
  summaryValue: { flex: 1, fontSize: 13, fontWeight: '600', color: '#374151' },

  /* Submit */
  submitBtn: {
    backgroundColor: BLUE,
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: BLUE,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  submitDisabled: { backgroundColor: '#93c5fd', shadowOpacity: 0, elevation: 0 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.4 },

  errorText: { fontSize: 12, color: '#ef4444', marginTop: 5 },

  /* List cards (inside sheet) */
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#f1f5f9',
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  listCardSelected: { borderColor: BLUE, backgroundColor: BLUE_LIGHT },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 44, height: 44 },
  cardName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  metaText: { fontSize: 12, color: '#6b7280' },
  checkCircle: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center', justifyContent: 'center',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 4,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },

  emptyState: { alignItems: 'center', paddingVertical: 32, gap: 10 },
  emptyText: { fontSize: 14, color: '#9ca3af', fontWeight: '500' },
});

/* ── Bottom sheet styles ── */
const bs = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 20,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: { fontSize: 16, fontWeight: '800', color: '#111827' },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center',
  },
});
