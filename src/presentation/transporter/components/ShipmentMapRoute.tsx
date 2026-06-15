import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Truck } from 'lucide-react-native';
import { geocodeAddress, Coord } from '../../../shared/utils/geocode';
import {
  fetchRoute,
  fromGeoJson,
  isValidCoord,
  sanitizePath,
  pushPoint,
} from '../../../shared/utils/tracking';
import { connectSocket } from '../../../data/socket/socketClient';
import { SOCKET_EVENTS } from '../../../domain/constants/socketEvents';
import axiosClient from '../../../shared/config/axios.config';
import TruckIcon from '../../../../assets/icons/truck3.svg';
import BoxIcon from '../../../../assets/icons/box3.svg';

const STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: 'In Progress',
  IN_TRANSIT: 'In Transit',
  COMPLETED: 'Completed',
  PENDING: 'Pending',
};
const STATUS_BG: Record<string, string> = {
  IN_PROGRESS: '#F97316',
  IN_TRANSIT: '#0071BC',
  COMPLETED: '#22C55E',
  PENDING: '#94A3B8',
};

/* ── Pickup pin: white card, blue accent, truck icon ── */
function PickupMarker() {
  return (
    <View style={pin.wrapper}>
      <View style={pin.pickupCard}>
        <View style={pin.pickupIconBg}>
          <TruckIcon width={16} height={16} />
        </View>
        <Text style={pin.pickupLabel}>Pickup</Text>
      </View>
      <View style={pin.tailPickup} />
    </View>
  );
}

/* ── Delivery pin: white card, orange accent, box/factory icon ── */
function DeliveryMarker() {
  return (
    <View style={pin.wrapper}>
      <View style={pin.deliveryCard}>
        <View style={pin.deliveryIconBg}>
          <BoxIcon width={16} height={16} />
        </View>
        <Text style={pin.deliveryLabel}>Delivery</Text>
      </View>
      <View style={pin.tailDelivery} />
    </View>
  );
}

type LatLng = { latitude: number; longitude: number };

type Props = {
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  // Live, read-only tracking (shipper/transporter). When `live` is set and the
  // shipment is IN_TRANSIT, the map shows the driver's live position + driven
  // trail, sourced from the same socket events the driver screen emits.
  shipmentId?: string;
  live?: boolean;
  // Prefer backend-stored coordinates over geocoding the address strings.
  pickupCoord?: LatLng;
  deliveryCoord?: LatLng;
  fullscreen?: boolean;
  showBadge?: boolean;
};

export default function ShipmentMapRoute({
  pickupAddress,
  deliveryAddress,
  status,
  shipmentId,
  live = false,
  pickupCoord,
  deliveryCoord,
  fullscreen = false,
  showBadge = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const [pickup, setPickup] = useState<Coord | null>(null);
  const [dropoff, setDropoff] = useState<Coord | null>(null);
  const [route, setRoute] = useState<Coord[]>([]);
  const [loading, setLoading] = useState(true);
  // Live driver position + driven trail (only used in `live` mode).
  const [truck, setTruck] = useState<Coord | null>(null);
  const [drivenPath, setDrivenPath] = useState<Coord[]>([]);
  const mapRef = useRef<MapView>(null);
  const socketRef = useRef<any>(null);

  const isInTransit = status === 'IN_TRANSIT';

  // ── Resolve pickup/delivery coords + planned route ──────────────────────────
  // Prefer backend coordinates; geocode the address strings only as a fallback.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const [p, d] = await Promise.all([
        isValidCoord(pickupCoord) ? Promise.resolve(pickupCoord) : geocodeAddress(pickupAddress),
        isValidCoord(deliveryCoord) ? Promise.resolve(deliveryCoord) : geocodeAddress(deliveryAddress),
      ]);
      if (cancelled) return;
      setPickup(p);
      setDropoff(d);
      if (p && d) {
        const r = await fetchRoute(p, d);
        if (!cancelled) {
          setRoute(r);
          setTimeout(() => {
            mapRef.current?.fitToCoordinates(r.length > 1 ? r : [p, d], {
              edgePadding: { top: 80, right: 48, bottom: 80, left: 48 },
              animated: true,
            });
          }, 400);
        }
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [pickupAddress, deliveryAddress, pickupCoord, deliveryCoord]);

  // ── Live: seed last-known position + driven history from REST ───────────────
  // The backend returns an empty history unless the ride is IN_TRANSIT, so the
  // trail naturally appears only during the ride and vanishes once completed.
  useEffect(() => {
    if (!live || !shipmentId) return;
    if (!isInTransit) {
      // Not an active ride — make sure no stale truck/trail is shown.
      setTruck(null);
      setDrivenPath([]);
      return;
    }
    let cancelled = false;
    axiosClient
      .get(`/map/shipment/${shipmentId}/location`)
      .then(({ data }) => {
        if (cancelled) return;
        const payload = data?.data;
        if (payload?.current_location?.coordinates) {
          setTruck(fromGeoJson(payload.current_location.coordinates));
        }
        if (payload?.location_history?.coordinates?.length) {
          setDrivenPath(sanitizePath(payload.location_history.coordinates.map(fromGeoJson)));
        }
      })
      .catch(() => { /* endpoint not live yet — wait for socket updates */ });
    return () => { cancelled = true; };
  }, [live, shipmentId, isInTransit]);

  // ── Live: subscribe to the driver's position updates (read-only) ────────────
  useEffect(() => {
    if (!live || !shipmentId || !isInTransit) return;
    let mounted = true;

    const onLocationUpdate = (d: { shipmentId: string; latitude: number; longitude: number }) => {
      if (!mounted || d.shipmentId !== shipmentId) return;
      const coord: Coord = { latitude: d.latitude, longitude: d.longitude };
      if (!isValidCoord(coord)) return;
      setTruck(coord);
      setDrivenPath(prev => pushPoint(prev, coord));
      // Follow the truck without resetting the viewer's zoom level.
      mapRef.current?.animateCamera({ center: coord }, { duration: 400 });
    };

    connectSocket().then(socket => {
      if (!mounted) return;
      socketRef.current = socket;
      socket.on(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE, onLocationUpdate);
      socket.emit(SOCKET_EVENTS.JOIN_TRACKING_ROOM, { shipmentId });
    });

    return () => {
      mounted = false;
      const socket = socketRef.current;
      if (socket) {
        socket.emit(SOCKET_EVENTS.LEAVE_TRACKING_ROOM, { shipmentId });
        // Pass the exact same reference so we don't remove listeners owned elsewhere.
        socket.off(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE, onLocationUpdate);
      }
    };
  }, [live, shipmentId, isInTransit]);

  const label = STATUS_LABEL[status] ?? status;
  const badgeBg = STATUS_BG[status] ?? '#94A3B8';
  const center = pickup ?? { latitude: 23.8103, longitude: 90.4125 };
  const badgeTop = fullscreen ? insets.top + 12 : 10;
  const showTruck = live && isInTransit && !!truck;

  return (
    <View style={fullscreen ? styles.containerFullscreen : styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider="google"
        initialRegion={{ ...center, latitudeDelta: 0.08, longitudeDelta: 0.08 }}
        showsCompass={false}
        showsTraffic={false}
      >
        {pickup && (
          <Marker coordinate={pickup} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
            <PickupMarker />
          </Marker>
        )}
        {dropoff && (
          <Marker coordinate={dropoff} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
            <DeliveryMarker />
          </Marker>
        )}
        {route.length > 1 && (
          <Polyline coordinates={route} strokeWidth={4} strokeColor="#036BB4" />
        )}

        {/* Live driven trail (solid blue) — only during an active ride */}
        {showTruck && drivenPath.length > 1 && (
          <Polyline coordinates={drivenPath} strokeWidth={5} strokeColor="#0071BC" />
        )}

        {/* Live driver marker */}
        {showTruck && truck && (
          <Marker coordinate={truck} anchor={{ x: 0.5, y: 0.5 }} title="Driver" tracksViewChanges={false}>
            <View style={styles.truckMarker}>
              <Truck size={20} color="#FFF" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Status badge */}
      {showBadge && (
        <View style={[styles.badge, { backgroundColor: badgeBg, top: badgeTop }]}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>{label}</Text>
        </View>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color="#036BB4" />
        </View>
      )}
    </View>
  );
}

/* ─── Pin styles ────────────────────────────────────── */
const BLUE = '#036BB4';
const ORANGE = '#F97316';

const pin = StyleSheet.create({
  wrapper: { alignItems: 'center' },

  pickupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: BLUE,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
    shadowColor: BLUE,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  pickupIconBg: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupLabel: {
    color: BLUE,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: ORANGE,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
    shadowColor: ORANGE,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  deliveryIconBg: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryLabel: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  tailPickup: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: BLUE,
  },
  tailDelivery: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: ORANGE,
  },
});

/* ─── Container / overlay styles ───────────────────── */
const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 14,
  },
  containerFullscreen: {
    flex: 1,
  },
  badge: {
    position: 'absolute',
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  truckMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0071BC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#0071BC',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
});
