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
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, MapPin, Navigation, CheckCircle, Truck, WifiOff } from 'lucide-react-native';
import axios from 'axios';
import Config from 'react-native-config';
import Geolocation from '@react-native-community/geolocation';
import { Shipment } from '../types';
import { connectSocket } from '../../../data/socket/socketClient';
import { SOCKET_EVENTS } from '../../../domain/constants/socketEvents';
import axiosClient from '../../../shared/config/axios.config';

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

// GeoJSON stores [longitude, latitude] — swap for react-native-maps
function fromGeoJson([lng, lat]: number[]): Coord {
  return { latitude: lat, longitude: lng };
}

const STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: 'In Progress',
  IN_TRANSIT:  'In Transit',
  COMPLETED:   'Completed',
  PENDING:     'Pending',
};
const STATUS_COLOR: Record<string, string> = {
  IN_PROGRESS: '#F97316',
  IN_TRANSIT:  '#0071BC',
  COMPLETED:   '#22C55E',
  PENDING:     '#94A3B8',
};

// ── component ─────────────────────────────────────────────────────────────────

const LiveTrackingScreen = () => {
  const route      = useRoute<any>();
  const navigation = useNavigation();
  const { shipment }: { shipment: Shipment } = route.params;

  const mapRef = useRef<MapView>(null);

  // map geometry
  const [pickupCoord,  setPickupCoord]  = useState<Coord | null>(null);
  const [dropoffCoord, setDropoffCoord] = useState<Coord | null>(null);
  const [truckCoord,   setTruckCoord]   = useState<Coord | null>(null);
  const [plannedRoute, setPlannedRoute] = useState<Coord[]>([]);
  const [drivenPath,   setDrivenPath]   = useState<Coord[]>([]);
  const [resolving,    setResolving]    = useState(true);

  // progress
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [totalDistance,   setTotalDistance]   = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [eta,             setEta]             = useState<string>('');

  // socket health
  const [socketConnected, setSocketConnected] = useState(false);

  // marker + GPS refs
  const [truckMarkerReady, setTruckMarkerReady] = useState(false);
  const gpsObtained = useRef(false);
  const socketRef   = useRef<any>(null);

  const arrived      = progressPercent >= 100;
  const almostThere  = eta === 'Arriving' && !arrived;
  const etaIsUnknown = eta === '' || eta === 'N/A';

  // ── Effect 0: driver's real GPS → initial truck position ─────────────────
  useEffect(() => {
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        gpsObtained.current = true;
        const coord = { latitude: coords.latitude, longitude: coords.longitude };
        console.log('Initial GPS position obtained:', coord);
        setTruckCoord(coord);
        mapRef.current?.animateToRegion(
          { ...coord, latitudeDelta: 0.05, longitudeDelta: 0.05 },
          300,
        );
      },
      () => { /* GPS unavailable — truck will appear from REST or socket */ },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, []);

  // ── Effect 1: geocode addresses + planned route from Google Directions ────
  useEffect(() => {
    const init = async () => {
      setResolving(true);
      try {
        const [pickup, dropoff] = await Promise.all([
          shipment.pickupCoord
            ? Promise.resolve(shipment.pickupCoord)
            : geocodeAddress(shipment.pickupAddress),
          shipment.deliveryCoord
            ? Promise.resolve(shipment.deliveryCoord)
            : geocodeAddress(shipment.deliveryAddress),
        ]);

        const p = pickup  ?? { latitude: 5.36,  longitude: -4.0  };
        const d = dropoff ?? { latitude: 12.37, longitude: -1.53 };

        setPickupCoord(p);
        setDropoffCoord(d);

        const res = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
          params: {
            origin:      `${p.latitude},${p.longitude}`,
            destination: `${d.latitude},${d.longitude}`,
            key: Config.GOOGLE_MAPS_API_KEY,
          },
        });

        const routes = res.data?.routes;
        if (routes?.length > 0) {
          setPlannedRoute(decodePolyline(routes[0].overview_polyline.points));
        } else {
          setPlannedRoute([p, d]);
        }
      } catch {
        // keep defaults
      } finally {
        setResolving(false);
      }
    };

    init();
  }, [shipment.pickupAddress, shipment.deliveryAddress, shipment.pickupCoord, shipment.deliveryCoord]);

  // ── Effect 2: REST — last-known position + driven history ────────────────
  useEffect(() => {
    axiosClient
      .get(`/map/shipment/${shipment.id}/location`)
      .then(({ data }) => {
        const payload = data?.data;

        if (payload?.current_location?.coordinates) {
          const coord = fromGeoJson(payload.current_location.coordinates);
          // Only use server position if live GPS hasn't already placed the truck
          if (!gpsObtained.current) {
            setTruckCoord(coord);
            mapRef.current?.animateToRegion(
              { ...coord, latitudeDelta: 0.05, longitudeDelta: 0.05 },
              600,
            );
          }
        }

        if (payload?.location_history?.coordinates?.length) {
          setDrivenPath(payload.location_history.coordinates.map(fromGeoJson));
        }
      })
      .catch(() => {
        // endpoint not yet live — truck stays at GPS position
      });
  }, [shipment.id]);

  // ── Effect 3: socket — room management, live position, progress, health ───
  useEffect(() => {
    let mounted = true;

    // Define callbacks up-front so cleanup can pass the exact same references
    // to socket.off() — otherwise socket.off(event) would remove ALL listeners
    // for that event, including ones registered inside socketClient.ts itself.
    const onConnect = () => { if (mounted) setSocketConnected(true); };
    const onDisconnect = () => { if (mounted) setSocketConnected(false); };

    const onLocationUpdate = (data: { shipmentId: string; latitude: number; longitude: number }) => {
      if (!mounted || data.shipmentId !== shipment.id) return;
      const coord: Coord = { latitude: data.latitude, longitude: data.longitude };
      setTruckCoord(coord);
      setDrivenPath(prev => [...prev, coord]);
      mapRef.current?.animateToRegion({ ...coord, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 400);
    };

    const onProgressUpdate = (data: {
      shipmentId: string; distanceCovered: number; totalDistance: number | null;
      progressPercent: number; eta: string;
    }) => {
      if (!mounted || data.shipmentId !== shipment.id) return;
      setDistanceCovered(data.distanceCovered);
      setTotalDistance(data.totalDistance);
      setProgressPercent(data.progressPercent);
      setEta(data.eta);
    };

    connectSocket().then(socket => {
      if (!mounted) return;
      socketRef.current = socket;
      setSocketConnected(socket.connected);

      socket.on('connect',    onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE,   onLocationUpdate);
      socket.on(SOCKET_EVENTS.SHIPMENT_PROGRESS_UPDATE, onProgressUpdate);

      socket.emit(SOCKET_EVENTS.JOIN_TRACKING_ROOM, { shipmentId: shipment.id });
    });

    return () => {
      mounted = false;
      const socket = socketRef.current;
      if (socket) {
        socket.emit(SOCKET_EVENTS.LEAVE_TRACKING_ROOM, { shipmentId: shipment.id });
        socket.off('connect',    onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE,   onLocationUpdate);
        socket.off(SOCKET_EVENTS.SHIPMENT_PROGRESS_UPDATE, onProgressUpdate);
      }
    };
  }, [shipment.id]);

  // ── Effect 4: driver GPS push — emit position every 7 s while trip is live
  useEffect(() => {
    if (shipment.status === 'COMPLETED') return; // no-op for completed trips

    const push = () => {
      const socket = socketRef.current;
      if (!socket?.connected) return;
      Geolocation.getCurrentPosition(
        ({ coords }) => {
          socket.emit(SOCKET_EVENTS.DRIVER_LOCATION_PUSH, {
            shipmentId: shipment.id,
            latitude:   coords.latitude,
            longitude:  coords.longitude,
            timestamp:  Date.now(),
          });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    };

    push(); // immediate first push
    const interval = setInterval(push, 7000);
    return () => clearInterval(interval);
  }, [shipment.id, shipment.status]);

  const statusLabel = STATUS_LABEL[shipment.status] ?? shipment.status;
  const statusColor = STATUS_COLOR[shipment.status] ?? '#94A3B8';
  const fillWidth   = `${Math.min(progressPercent, 100)}%` as any;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* ── MAP ─────────────────────────────────────────────────────────────── */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={
          shipment.pickupCoord
            ? { ...shipment.pickupCoord, latitudeDelta: 0.5, longitudeDelta: 0.5 }
            : { latitude: 5.36, longitude: -4.0, latitudeDelta: 0.5, longitudeDelta: 0.5 }
        }
        customMapStyle={mapStyle}
      >
        {/* Planned route — sky-blue dashed */}
        {plannedRoute.length > 1 && (
          <Polyline
            coordinates={plannedRoute}
            strokeColor="#60A5FA"
            strokeWidth={4}
            lineDashPattern={[8, 6]}
          />
        )}

        {/* Driven path — solid blue */}
        {drivenPath.length > 1 && (
          <Polyline
            coordinates={drivenPath}
            strokeColor="#0071BC"
            strokeWidth={5}
          />
        )}

        {/* Pickup pin */}
        {pickupCoord && (
          <Marker coordinate={pickupCoord} title="Pickup" anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
            <View style={styles.pinPickup}>
              <MapPin size={16} color="#FFF" />
            </View>
          </Marker>
        )}

        {/* Dropoff pin — green on arrival */}
        {dropoffCoord && (
          <Marker coordinate={dropoffCoord} title="Dropoff" anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
            <View style={[styles.pinDropoff, arrived && styles.pinArrived]}>
              <MapPin size={16} color="#FFF" />
            </View>
          </Marker>
        )}

        {/* Live truck marker */}
        {truckCoord && (
          <Marker
            coordinate={truckCoord}
            title="Driver"
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={!truckMarkerReady}
          >
            <View
              style={styles.truckMarker}
              onLayout={() => {
                if (!truckMarkerReady) {
                  setTimeout(() => setTruckMarkerReady(true), 200);
                }
              }}
            >
              <Truck size={22} color="#FFF" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Loading overlay while geocoding */}
      {resolving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0071BC" />
        </View>
      )}

      {/* ── TOP HEADER ──────────────────────────────────────────────────────── */}
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

      {/* ── SOCKET RECONNECTING BANNER ──────────────────────────────────────── */}
      {!socketConnected && (
        <View style={styles.reconnectBanner}>
          <WifiOff size={14} color="#92400E" />
          <Text style={styles.reconnectText}>Reconnecting…</Text>
          <ActivityIndicator size="small" color="#92400E" style={{ marginLeft: 6 }} />
        </View>
      )}

      {/* ── ALMOST THERE BANNER ─────────────────────────────────────────────── */}
      {almostThere && (
        <View style={styles.almostBanner}>
          <Navigation size={15} color="#1D4ED8" />
          <Text style={styles.almostText}>Almost there — approaching destination</Text>
        </View>
      )}

      {/* ── ARRIVAL BANNER ──────────────────────────────────────────────────── */}
      {arrived && (
        <View style={styles.arrivalBanner}>
          <CheckCircle size={16} color="#22C55E" />
          <Text style={styles.arrivalText}>Driver has arrived at destination</Text>
        </View>
      )}

      {/* ── BOTTOM TRACKING CARD ────────────────────────────────────────────── */}
      <View style={styles.trackingCard}>
        <View style={styles.dragHandle} />

        {/* Route addresses */}
        <View style={styles.routeRow}>
          <View style={styles.routeIcons}>
            <View style={styles.dotPickup} />
            <View style={styles.routeLine} />
            <View style={styles.dotBlue} />
          </View>
          <View style={styles.routeAddresses}>
            <View style={styles.addressBlock}>
              <Text style={styles.addressLabel}>Pickup</Text>
              <Text style={styles.addressValue} numberOfLines={2}>{shipment.pickupAddress}</Text>
            </View>
            <View style={[styles.addressBlock, { marginTop: 12 }]}>
              <Text style={styles.addressLabel}>Delivery</Text>
              <Text style={styles.addressValue} numberOfLines={2}>{shipment.deliveryAddress}</Text>
            </View>
          </View>
        </View>

        {(shipment.contactPerson || shipment.timeWindow) && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              {shipment.contactPerson && (
                <View style={styles.infoCell}>
                  <Text style={styles.infoLabel}>Contact</Text>
                  <Text style={styles.infoValue}>{shipment.contactPerson}</Text>
                </View>
              )}
              {shipment.timeWindow && (
                <View style={styles.infoCell}>
                  <Text style={styles.infoLabel}>Time Window</Text>
                  <Text style={styles.infoValue}>{shipment.timeWindow}</Text>
                </View>
              )}
            </View>
          </>
        )}

        <View style={styles.divider} />

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            {/* Distance covered */}
            <View style={styles.progressStat}>
              <Navigation size={12} color="#94A3B8" style={{ marginBottom: 2 }} />
              <Text style={styles.progressStatLabel}>Covered</Text>
              <Text style={styles.progressStatValue}>
                {distanceCovered > 0 ? `${distanceCovered.toFixed(1)} km` : '--'}
              </Text>
            </View>

            {/* Percentage */}
            <View style={styles.progressCenter}>
              {totalDistance != null ? (
                <>
                  <Text style={[
                    styles.progressPercent,
                    arrived && styles.progressPercentArrived,
                    almostThere && styles.progressPercentAlmost,
                  ]}>
                    {progressPercent}%
                  </Text>
                  <Text style={styles.progressPercentLabel}>complete</Text>
                </>
              ) : (
                <>
                  <Text style={styles.progressPercentUnknown}>--</Text>
                  <Text style={styles.progressPercentLabel}>in progress</Text>
                </>
              )}
            </View>

            {/* Total distance */}
            <View style={[styles.progressStat, { alignItems: 'flex-end' }]}>
              <MapPin size={12} color="#0071BC" style={{ marginBottom: 2 }} />
              <Text style={styles.progressStatLabel}>Total</Text>
              <Text style={styles.progressStatValue}>
                {totalDistance != null ? `${totalDistance.toFixed(1)} km` : '? km'}
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarTrack}>
            {totalDistance != null ? (
              <View
                style={[
                  styles.progressBarFill,
                  { width: fillWidth },
                  arrived    && styles.progressBarArrived,
                  almostThere && styles.progressBarAlmost,
                ]}
              />
            ) : (
              <View style={[styles.progressBarFill, styles.progressBarIndeterminate]} />
            )}
          </View>

          {/* ETA — hidden when N/A or not yet received */}
          {!etaIsUnknown && (
            <View style={styles.etaRow}>
              <Text style={styles.etaLabel}>Estimated Arrival</Text>
              <Text style={[
                styles.etaValue,
                arrived    && styles.etaValueArrived,
                almostThere && styles.etaValueAlmost,
              ]}>
                {arrived ? 'Arrived' : almostThere ? 'Arriving soon' : eta}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.endTripBtn,
            arrived    && styles.endTripBtnArrived,
            almostThere && styles.endTripBtnAlmost,
          ]}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.endTripText}>
            {arrived ? 'Trip Complete' : almostThere ? 'Almost There' : 'Arrival at Destination'}
          </Text>
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
    borderWidth: 2, borderColor: '#FFF', elevation: 4,
  },
  pinDropoff: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#0071BC',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF', elevation: 4,
  },
  pinArrived: { backgroundColor: '#22C55E' },
  truckMarker: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#0071BC',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#FFF',
    shadowColor: '#0071BC', shadowOpacity: 0.5, shadowRadius: 8,
    elevation: 8,
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
  statusDot:  { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusText: { fontSize: 11, fontWeight: '700' },

  // banners (stacked below header)
  reconnectBanner: {
    position: 'absolute', top: 110, left: 20, right: 20,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1, borderColor: '#FDE68A',
    borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    gap: 8,
    elevation: 4,
  },
  reconnectText: { fontSize: 13, fontWeight: '700', color: '#92400E', flex: 1 },

  almostBanner: {
    position: 'absolute', top: 110, left: 20, right: 20,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1, borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    gap: 8,
    elevation: 4,
  },
  almostText: { fontSize: 13, fontWeight: '700', color: '#1D4ED8', flex: 1 },

  arrivalBanner: {
    position: 'absolute', top: 110, left: 20, right: 20,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1, borderColor: '#86EFAC',
    borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    gap: 8,
    elevation: 4,
  },
  arrivalText: { fontSize: 13, fontWeight: '700', color: '#166534', flex: 1 },

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
  routeRow:       { flexDirection: 'row', alignItems: 'stretch' },
  routeIcons:     { width: 20, alignItems: 'center', paddingTop: 4 },
  dotPickup:      { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0071BC' },
  routeLine:      { flex: 1, width: 2, backgroundColor: '#93C5FD', marginVertical: 4, minHeight: 24 },
  dotBlue:        { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0071BC' },
  routeAddresses: { flex: 1, marginLeft: 12 },
  addressBlock:   {},
  addressLabel:   { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 2 },
  addressValue:   { fontSize: 14, fontWeight: '700', color: '#1A1C1E' },

  // info row
  infoRow:   { flexDirection: 'row', gap: 16 },
  infoCell:  { flex: 1 },
  infoLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 13, fontWeight: '700', color: '#1A1C1E' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },

  // progress section
  progressSection: { marginBottom: 16 },
  progressHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  progressStat:         { alignItems: 'flex-start', minWidth: 72 },
  progressStatLabel:    { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 2 },
  progressStatValue:    { fontSize: 15, fontWeight: '800', color: '#1A1C1E' },
  progressCenter:       { alignItems: 'center' },
  progressPercent:      { fontSize: 24, fontWeight: '900', color: '#0071BC' },
  progressPercentArrived: { color: '#22C55E' },
  progressPercentAlmost:  { color: '#1D4ED8' },
  progressPercentUnknown: { fontSize: 24, fontWeight: '900', color: '#94A3B8' },
  progressPercentLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: -2 },
  progressBarTrack: {
    height: 8, backgroundColor: '#EFF6FF',
    borderRadius: 4, overflow: 'hidden', marginBottom: 10,
  },
  progressBarFill: {
    height: '100%', backgroundColor: '#0071BC',
    borderRadius: 4, minWidth: 8,
  },
  progressBarArrived:      { backgroundColor: '#22C55E' },
  progressBarAlmost:       { backgroundColor: '#3B82F6' },
  progressBarIndeterminate: { width: '100%', opacity: 0.3 },
  etaRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  etaLabel:       { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  etaValue:       { fontSize: 13, fontWeight: '800', color: '#1A1C1E' },
  etaValueArrived: { color: '#22C55E' },
  etaValueAlmost:  { color: '#1D4ED8' },

  // buttons
  endTripBtn: {
    backgroundColor: '#0071BC', height: 56,
    borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  endTripBtnArrived: { backgroundColor: '#22C55E' },
  endTripBtnAlmost:  { backgroundColor: '#3B82F6' },
  endTripText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});

const mapStyle = [
  { featureType: 'poi',     stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

export default LiveTrackingScreen;
