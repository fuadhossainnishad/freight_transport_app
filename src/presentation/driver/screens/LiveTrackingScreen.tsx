import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, MapPin, Phone, MessageSquare, Truck } from 'lucide-react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { Shipment } from '../types';

const { width, height } = Dimensions.get('window');

type Coord = { latitude: number; longitude: number };

// ── helpers ──────────────────────────────────────────────────────────────────

function decodePolyline(encoded: string): Coord[] {
  const coords: Coord[] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let shift = 0, result = 0, byte: number;
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lat += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lng += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    coords.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return coords;
}

async function geocodeAddress(address: string): Promise<Coord | null> {
  try {
    const res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: { address, key: Config.GOOGLE_MAPS_API_KEY },
    });
    const loc = res.data.results?.[0]?.geometry?.location;
    return loc ? { latitude: loc.lat, longitude: loc.lng } : null;
  } catch {
    return null;
  }
}

function regionFromCoords(p1: Coord, p2: Coord): Region {
  const latDelta = Math.abs(p1.latitude - p2.latitude) * 1.6 + 0.5;
  const lngDelta = Math.abs(p1.longitude - p2.longitude) * 1.6 + 0.5;
  return {
    latitude: (p1.latitude + p2.latitude) / 2,
    longitude: (p1.longitude + p2.longitude) / 2,
    latitudeDelta: Math.max(latDelta, 0.5),
    longitudeDelta: Math.max(lngDelta, 0.5),
  };
}

const STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: 'In Progress',
  IN_TRANSIT: 'In Transit',
  COMPLETED: 'Completed',
  PENDING: 'Pending',
};
const STATUS_COLOR: Record<string, string> = {
  IN_PROGRESS: '#F97316',
  IN_TRANSIT: '#0071BC',
  COMPLETED: '#22C55E',
  PENDING: '#94A3B8',
};

// ── component ─────────────────────────────────────────────────────────────────

const LiveTrackingScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { shipment }: { shipment: Shipment } = route.params;

  const mapRef = useRef<MapView>(null);

  const [pickupCoord, setPickupCoord] = useState<Coord | null>(null);
  const [dropoffCoord, setDropoffCoord] = useState<Coord | null>(null);
  const [truckCoord, setTruckCoord] = useState<Coord | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 9.5,
    longitude: -2.5,
    latitudeDelta: 8,
    longitudeDelta: 8,
  });
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    const init = async () => {
      setResolving(true);
      try {
        // 1. Geocode both addresses in parallel
        const [pickup, dropoff] = await Promise.all([
          geocodeAddress(shipment.pickupAddress),
          geocodeAddress(shipment.deliveryAddress),
        ]);

        const p = pickup ?? { latitude: 5.36, longitude: -4.0 };
        const d = dropoff ?? { latitude: 12.37, longitude: -1.53 };

        setPickupCoord(p);
        setDropoffCoord(d);
        setMapRegion(regionFromCoords(p, d));

        // 2. Fetch road-following directions
        const res = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
          params: {
            origin: `${p.latitude},${p.longitude}`,
            destination: `${d.latitude},${d.longitude}`,
            key: Config.GOOGLE_MAPS_API_KEY,
          },
        });

        const routes = res.data?.routes;
        if (routes?.length > 0) {
          const decoded = decodePolyline(routes[0].overview_polyline.points);
          setRouteCoords(decoded);
          const idx = Math.floor(decoded.length / 3);
          if (decoded[idx]) setTruckCoord(decoded[idx]);
        } else {
          setRouteCoords([p, d]);
          setTruckCoord({ latitude: (p.latitude + d.latitude) / 2, longitude: (p.longitude + d.longitude) / 2 });
        }
      } catch {
        // keep defaults
      } finally {
        setResolving(false);
      }
    };

    init();
  }, [shipment.pickupAddress, shipment.deliveryAddress]);

  const displayRoute = routeCoords.length > 1
    ? routeCoords
    : (pickupCoord && dropoffCoord ? [pickupCoord, dropoffCoord] : []);

  const statusLabel = STATUS_LABEL[shipment.status] ?? shipment.status;
  const statusColor = STATUS_COLOR[shipment.status] ?? '#94A3B8';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* MAP */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={mapRegion}
        customMapStyle={mapStyle}
      >
        {pickupCoord && (
          <Marker coordinate={pickupCoord} title="Pickup" anchor={{ x: 0.5, y: 1 }}>
            <View style={styles.pinPickup}>
              <MapPin size={16} color="#FFF" />
            </View>
          </Marker>
        )}

        {dropoffCoord && (
          <Marker coordinate={dropoffCoord} title="Dropoff" anchor={{ x: 0.5, y: 1 }}>
            <View style={styles.pinDropoff}>
              <MapPin size={16} color="#FFF" />
            </View>
          </Marker>
        )}

        {truckCoord && (
          <Marker coordinate={truckCoord} title="Truck" anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.truckMarker}>
              <Truck size={18} color="#FFF" />
            </View>
          </Marker>
        )}

        {displayRoute.length > 1 && (
          <Polyline
            coordinates={displayRoute}
            strokeColor="#0071BC"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Resolving overlay */}
      {resolving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0071BC" />
        </View>
      )}

      {/* TOP FLOATING HEADER */}
      <SafeAreaView style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>{shipment.title}</Text>
          <View style={[styles.statusChip, { backgroundColor: statusColor + '22' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* BOTTOM TRACKING CARD */}
      <View style={styles.trackingCard}>
        <View style={styles.dragHandle} />

        {/* Route summary */}
        <View style={styles.routeRow}>
          {/* Left icons column */}
          <View style={styles.routeIcons}>
            <View style={styles.dotGray} />
            <View style={styles.routeLine} />
            <View style={styles.dotBlue} />
          </View>

          {/* Addresses */}
          <View style={styles.routeAddresses}>
            <View style={styles.addressBlock}>
              <Text style={styles.addressLabel}>Pickup</Text>
              <Text style={styles.addressValue} numberOfLines={2}>
                {shipment.pickupAddress}
              </Text>
            </View>
            <View style={[styles.addressBlock, { marginTop: 12 }]}>
              <Text style={styles.addressLabel}>Delivery</Text>
              <Text style={styles.addressValue} numberOfLines={2}>
                {shipment.deliveryAddress}
              </Text>
            </View>
          </View>
        </View>

        {/* Extra info row */}
        {(shipment.contactPerson || shipment.timeWindow) && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              {shipment.contactPerson ? (
                <View style={styles.infoCell}>
                  <Text style={styles.infoLabel}>Contact</Text>
                  <Text style={styles.infoValue}>{shipment.contactPerson}</Text>
                </View>
              ) : null}
              {shipment.timeWindow ? (
                <View style={styles.infoCell}>
                  <Text style={styles.infoLabel}>Time Window</Text>
                  <Text style={styles.infoValue}>{shipment.timeWindow}</Text>
                </View>
              ) : null}
            </View>
          </>
        )}

        <View style={styles.divider} />

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.contactBtn}>
            <Phone size={20} color="#64748B" />
            <Text style={styles.contactBtnText}>Call Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactBtn, styles.contactBtnBorder]}>
            <MessageSquare size={20} color="#64748B" />
            <Text style={styles.contactBtnText}>Message</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.endTripBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.endTripText}>Arrival at Destination</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  map: { width, height },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // markers
  pinPickup: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#94A3B8',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF',
    elevation: 4,
  },
  pinDropoff: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#0071BC',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF',
    elevation: 4,
  },
  truckMarker: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#0071BC',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6,
    elevation: 5,
  },

  // header
  headerContainer: {
    position: 'absolute', top: 40, left: 20, right: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#FFF', padding: 12, borderRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  headerInfo: {
    flex: 1, marginLeft: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  headerTitle: { fontSize: 15, fontWeight: '800', color: '#1A1C1E' },
  statusChip: {
    flexDirection: 'row', alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 20, marginTop: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusText: { fontSize: 11, fontWeight: '700' },

  // card
  trackingCard: {
    position: 'absolute', bottom: 0, width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: 24,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 20, elevation: 10,
  },
  dragHandle: {
    width: 40, height: 5, backgroundColor: '#E2E8F0',
    borderRadius: 3, alignSelf: 'center', marginBottom: 20,
  },

  // route section
  routeRow: { flexDirection: 'row', alignItems: 'stretch' },
  routeIcons: { width: 20, alignItems: 'center', paddingTop: 4 },
  dotGray: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#94A3B8' },
  routeLine: { flex: 1, width: 2, backgroundColor: '#CBD5E1', marginVertical: 4, minHeight: 24 },
  dotBlue: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0071BC' },
  routeAddresses: { flex: 1, marginLeft: 12 },
  addressBlock: {},
  addressLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 2 },
  addressValue: { fontSize: 14, fontWeight: '700', color: '#1A1C1E' },

  // info row
  infoRow: { flexDirection: 'row', gap: 16 },
  infoCell: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 13, fontWeight: '700', color: '#1A1C1E' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },

  // action buttons
  actionRow: { flexDirection: 'row', marginBottom: 16 },
  contactBtn: {
    flex: 1, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', paddingVertical: 10,
  },
  contactBtnBorder: { borderLeftWidth: 1, borderLeftColor: '#F1F5F9' },
  contactBtnText: { marginLeft: 8, fontSize: 14, fontWeight: '700', color: '#64748B' },

  endTripBtn: {
    backgroundColor: '#0071BC', height: 56,
    borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  endTripText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});

const mapStyle = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

export default LiveTrackingScreen;
