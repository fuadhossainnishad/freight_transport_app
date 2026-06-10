import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { decodePolyline } from '../../../shared/utils/map';

type Coord = { latitude: number; longitude: number };

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

async function geocodeAddress(address: string): Promise<Coord | null> {
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { format: 'json', limit: 1, q: address },
      headers: { 'User-Agent': 'LawapanTruck/1.0 (transporter-app)' },
    });
    const hit = res.data?.[0];
    if (hit?.lat && hit?.lon) {
      return { latitude: parseFloat(hit.lat), longitude: parseFloat(hit.lon) };
    }
    return null;
  } catch {
    return null;
  }
}

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

type Props = {
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
};

export default function ShipmentMapRoute({ pickupAddress, deliveryAddress, status }: Props) {
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
              edgePadding: { top: 48, right: 48, bottom: 48, left: 48 },
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider="google"
        initialRegion={{ ...center, latitudeDelta: 0.08, longitudeDelta: 0.08 }}
        showsCompass={false}
        showsTraffic={false}
        customMapStyle={mapStyle}
      >
        {pickup && (
          <Marker coordinate={pickup} title="Pickup">
            <View style={styles.markerPickup} />
          </Marker>
        )}
        {dropoff && (
          <Marker coordinate={dropoff} title="Delivery">
            <View style={styles.markerDropoff} />
          </Marker>
        )}
        {route.length > 1 && (
          <Polyline coordinates={route} strokeWidth={3} strokeColor="#036BB4" />
        )}
      </MapView>

      {/* Status badge */}
      <View style={[styles.badge, { backgroundColor: badgeBg }]}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>{label}</Text>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color="#036BB4" />
        </View>
      )}
    </View>
  );
}

const mapStyle = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
];

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 14,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  markerPickup: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerDropoff: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
