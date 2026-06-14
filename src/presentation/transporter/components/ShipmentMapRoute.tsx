import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { decodePolyline } from '../../../shared/utils/map';
import { geocodeAddress, Coord } from '../../../shared/utils/geocode';
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

async function fetchRoute(origin: Coord, dest: Coord): Promise<Coord[]> {
  try {
    const coords = `${origin.longitude},${origin.latitude};${dest.longitude},${dest.latitude}`;
    const res = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${coords}`,
      { params: { overview: 'full', geometries: 'polyline' } },
    );
    if (res.data?.code === 'Ok' && res.data.routes?.length > 0) {
      const pts = decodePolyline(res.data.routes[0].geometry);
      if (pts.length > 1) return pts;
    }
  } catch {}
  return [origin, dest];
}

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

type Props = {
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  fullscreen?: boolean;
  showBadge?: boolean;
};

export default function ShipmentMapRoute({
  pickupAddress,
  deliveryAddress,
  status,
  fullscreen = false,
  showBadge = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const [pickup, setPickup] = useState<Coord | null>(null);
  const [dropoff, setDropoff] = useState<Coord | null>(null);
  const [route, setRoute] = useState<Coord[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const [p, d] = await Promise.all([
        geocodeAddress(pickupAddress),
        geocodeAddress(deliveryAddress),
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
  }, [pickupAddress, deliveryAddress]);

  const label = STATUS_LABEL[status] ?? status;
  const badgeBg = STATUS_BG[status] ?? '#94A3B8';
  const center = pickup ?? { latitude: 23.8103, longitude: 90.4125 };
  const badgeTop = fullscreen ? insets.top + 12 : 10;

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
});
