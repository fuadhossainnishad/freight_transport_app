import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActiveShipmentsStackParamList } from '../../../navigation/types';
import AppHeader from '../../../shared/components/AppHeader';
import ShipmentMapRoute from '../../transporter/components/ShipmentMapRoute';
import { getShipmentDetailsUseCase } from '../../../domain/usecases/shipment.usecase';
import DocsIcon from '../../../../assets/icons/docs.svg';
import ArrowRightIcon from '../../../../assets/icons/Arrow_right.svg';

const { width } = Dimensions.get('window');

type RoutePropType = RouteProp<ActiveShipmentsStackParamList, 'ActiveShipmentDetailsScreen'>;
type NavigationPropType = NativeStackNavigationProp<ActiveShipmentsStackParamList, 'ActiveShipmentDetailsScreen'>;

const PLACEHOLDER_TRUCK = require('../../../../assets/images/truck.png');

function ExpandIcon() {
  const S = 7; const T = 2; const C = '#fff';
  return (
    <View style={{ width: 18, height: 18 }}>
      {/* top-left */}
      <View style={{ position: 'absolute', top: 0, left: 0, width: S, height: T, backgroundColor: C }} />
      <View style={{ position: 'absolute', top: 0, left: 0, width: T, height: S, backgroundColor: C }} />
      {/* top-right */}
      <View style={{ position: 'absolute', top: 0, right: 0, width: S, height: T, backgroundColor: C }} />
      <View style={{ position: 'absolute', top: 0, right: 0, width: T, height: S, backgroundColor: C }} />
      {/* bottom-left */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: S, height: T, backgroundColor: C }} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: T, height: S, backgroundColor: C }} />
      {/* bottom-right */}
      <View style={{ position: 'absolute', bottom: 0, right: 0, width: S, height: T, backgroundColor: C }} />
      <View style={{ position: 'absolute', bottom: 0, right: 0, width: T, height: S, backgroundColor: C }} />
    </View>
  );
}

export default function ActiveShipmentDetailsScreen() {
  const navigation = useNavigation<NavigationPropType>();
  const route = useRoute<RoutePropType>();
  const { shipmentId } = route.params;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mapExpanded, setMapExpanded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getShipmentDetailsUseCase(shipmentId);
        setData(res);
      } catch (err) {
        console.error('ActiveShipmentDetails fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shipmentId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#036BB4" />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Shipment not found</Text>
      </SafeAreaView>
    );
  }

  const { title, description, pickup, delivery, pickupCoord, deliveryCoord, contactPerson, driver, vehicle, images } = data;

  const vehicleImageUri: string | null = vehicle?.images?.[0] ?? null;
  const shipmentImages: string[] = images?.length ? images : [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader text="Active Shipments" onpress={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Page title */}
        <Text className="px-4 pt-2 pb-3 text-lg font-bold text-gray-900">Active Shipments</Text>

        {/* ── Vehicle card ── */}
        <View className="mx-4 mb-5 bg-white rounded-2xl border border-gray-100 overflow-hidden"
          style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
          <View className="items-center px-4 pt-4 pb-3">
            <Image
            //   source={vehicleImageUri ? { uri: vehicleImageUri } : PLACEHOLDER_TRUCK}
              source={PLACEHOLDER_TRUCK}
              style={{ width: '80%', height: 160 }}
              className="rounded-xl"
              resizeMode="cover"
            />
          </View>
          <View className="px-4 pb-4">
            <Text className="text-base font-bold text-gray-900">
              {vehicle?.number ?? vehicle?.type ?? 'Vehicle'}
            </Text>
            <Text className="text-sm text-gray-400 mt-0.5">{vehicle?.type ?? ''}</Text>
          </View>
        </View>

        {/* ── Driver Details ── */}
        {driver && (
          <View className="mx-4 mb-5">
            <Text className="text-base font-bold text-gray-900 mb-3">Driver Details</Text>
            <View className="rounded-2xl border border-gray-200 overflow-hidden">
              {/* Table header */}
              <View className="flex-row bg-gray-50 border-b border-gray-200">
                <Text className="flex-1 px-3 py-2.5 text-xs text-gray-500 font-semibold">Name</Text>
                <Text className="flex-1 px-3 py-2.5 text-xs text-gray-500 font-semibold text-center">Phone</Text>
                <Text className="flex-1 px-3 py-2.5 text-xs text-gray-500 font-semibold text-right">Driving Licence</Text>
              </View>
              {/* Table row */}
              <View className="flex-row items-center">
                <Text className="flex-1 px-3 py-3 text-sm font-semibold text-gray-800" numberOfLines={1}>
                  {driver.name}
                </Text>
                <Text className="flex-1 px-3 py-3 text-sm text-gray-600 text-center" numberOfLines={1}>
                  {driver.phone}
                </Text>
                <View className="flex-1 px-3 py-3 items-end">
                  <View className="w-8 h-8 bg-blue-50 rounded-lg items-center justify-center">
                    <DocsIcon width={18} height={18} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ── Map with status badge ── */}
        <View className="mx-4 mb-5">
          <View style={{ position: 'relative' }}>
            <ShipmentMapRoute
              shipmentId={shipmentId}
              pickupAddress={pickup}
              deliveryAddress={delivery}
              pickupCoord={pickupCoord}
              deliveryCoord={deliveryCoord}
              status={data.status ?? 'IN_PROGRESS'}
              live
            />
            {/* Expand button — four-corner expand icon */}
            <TouchableOpacity
              onPress={() => setMapExpanded(true)}
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#036BB4',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#036BB4',
                shadowOpacity: 0.4,
                shadowRadius: 6,
                elevation: 6,
              }}
            >
              <ExpandIcon />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Fullscreen map modal ── */}
        <Modal
          visible={mapExpanded}
          animationType="slide"
          onRequestClose={() => setMapExpanded(false)}
        >
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
          <View style={{ flex: 1 }}>
            <ShipmentMapRoute
              shipmentId={shipmentId}
              pickupAddress={pickup}
              deliveryAddress={delivery}
              pickupCoord={pickupCoord}
              deliveryCoord={deliveryCoord}
              status={data.status ?? 'IN_PROGRESS'}
              live
              fullscreen
            />
            {/* Close button — wide pill at the bottom */}
            <TouchableOpacity
              onPress={() => setMapExpanded(false)}
              style={{
                position: 'absolute',
                bottom: 36,
                alignSelf: 'center',
                left: width * 0.5 - 80,
                width: 160,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                backgroundColor: '#036BB4',
                paddingVertical: 14,
                borderRadius: 999,
                shadowColor: '#036BB4',
                shadowOpacity: 0.35,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff', letterSpacing: 0.3 }}>
                Close map
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* ── Shipment Details ── */}
        <View className="mx-4">
          <Text className="text-base font-bold text-gray-900 mb-3">Shipment Details</Text>

          {/* Image carousel */}
          {shipmentImages.length > 0 && (
            <View className="mb-4">
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x / (width - 32),
                  );
                  setActiveImageIndex(index);
                }}
              >
                {shipmentImages.map((item, i) => (
                  <Image
                    key={i}
                    source={{ uri: item }}
                    defaultSource={PLACEHOLDER_TRUCK}
                    style={{ width: width - 32, height: 180 }}
                    className="rounded-2xl"
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
              {/* Pagination dots */}
              {shipmentImages.length > 1 && (
                <View className="flex-row justify-center mt-2 gap-1">
                  {shipmentImages.map((_: any, i: number) => (
                    <View
                      key={i}
                      style={{
                        width: i === activeImageIndex ? 16 : 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: i === activeImageIndex ? '#036BB4' : '#D1D5DB',
                      }}
                    />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Title & description */}
          <Text className="text-base font-bold text-gray-900">{title}</Text>
          <Text className="text-sm text-gray-500 mt-1 mb-4">{description}</Text>

          {/* Pickup / Delivery */}
          <View className="flex-row mb-4">
            <View className="flex-1">
              <Text className="text-xs text-gray-400 mb-1">Pickup Address</Text>
              <Text className="text-sm font-medium text-gray-800">{pickup}</Text>
            </View>
            <View className="w-px bg-gray-200 mx-3" />
            <View className="flex-1">
              <Text className="text-xs text-gray-400 mb-1">Delivery Address</Text>
              <Text className="text-sm font-medium text-gray-800">{delivery}</Text>
            </View>
          </View>

          {/* Contact */}
          <View className="flex-row mb-6">
            <View className="flex-1">
              <Text className="text-xs text-gray-400 mb-1">Contact Person</Text>
              <Text className="text-sm font-bold text-gray-900">
                {contactPerson ?? driver?.name ?? '—'}
              </Text>
            </View>
            <View className="w-px bg-gray-200 mx-3" />
            <View className="flex-1">
              <Text className="text-xs text-gray-400 mb-1">Contact Person Number</Text>
              <Text className="text-sm font-medium text-gray-800">{driver?.phone ?? '—'}</Text>
            </View>
          </View>

          {/* View full details button */}
          <TouchableOpacity
            className="border border-gray-300 rounded-full py-4 flex-row items-center justify-center gap-2"
            onPress={() => (navigation as any).navigate('ShipmentDetails', { shipmentId })}
          >
            <Text className="text-gray-700 font-medium text-sm">View full details</Text>
            <ArrowRightIcon width={16} height={16} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
