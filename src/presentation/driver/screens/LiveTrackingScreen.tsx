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
  Modal,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import type { ParseKeys } from 'i18next';
import { ArrowLeft, MapPin, Navigation, CheckCircle, Truck, WifiOff, X, Upload, Plus, Check, AlertTriangle } from 'lucide-react-native';
import Geolocation from '@react-native-community/geolocation';
import { Asset } from 'react-native-image-picker';
import { useAuth } from '../../../app/context/Auth.context';
import { Shipment } from '../types';
import { connectSocket } from '../../../data/socket/socketClient';
import { SOCKET_EVENTS } from '../../../domain/constants/socketEvents';
import axiosClient from '../../../shared/config/axios.config';
import { updateShipmentStatus, completeShipmentWithProof } from '../../../data/services/shipmentService';
import { pickShipmentImages } from '../../../shared/hooks/useImagePicker';
import { geocodeAddress } from '../../../shared/utils/geocode';
import {
  Coord,
  fetchRoute,
  fromGeoJson,
  isValidCoord,
  haversineKm,
  sanitizePath,
  pushPoint,
} from '../../../shared/utils/tracking';

// Force the legacy Android location provider. The 'playServices' provider has a
// bug (NPE "Listener must not be null" in PlayServicesLocationManager when it
// removes location updates) that crashes the app on every location result.
// With enableHighAccuracy:false the Android provider uses the network (Wi-Fi /
// cell) provider, which still gets a fix indoors — no satellites required.
Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
  locationProvider: 'android',
});

const { width, height } = Dimensions.get('window');

// Live-tracking geometry helpers (decodePolyline, fetchRoute, fromGeoJson,
// isValidCoord, haversineKm, sanitizePath, pushPoint) now live in
// src/shared/utils/tracking.ts and are shared with the shipper/transporter map.

// Keys are backend enums — never translate them. Only the label is translated.
const STATUS_LABEL: Record<string, ParseKeys> = {
  IN_PROGRESS: 'driver.status.inProgress',
  IN_TRANSIT: 'driver.status.inTransit',
  COMPLETED: 'driver.status.completed',
  PENDING: 'driver.status.pending',
};
const STATUS_COLOR: Record<string, string> = {
  IN_PROGRESS: '#F97316',
  IN_TRANSIT: '#0071BC',
  COMPLETED: '#22C55E',
  PENDING: '#94A3B8',
};

// Remembers which shipments have already had their ride started this session, so
// re-entering this screen (e.g. backing out to the shipment details and opening
// the map again) doesn't reset to the "Start Ride" phase. In-memory only — no
// backend round-trip needed. Survives navigation because the module stays loaded;
// app restarts are covered by deriving the phase from shipment.status instead.
const startedRides = new Set<string>();

// A shipment whose ride has actually begun should open straight into the live
// ride rather than the "heading to pickup" phase. Per the backend lifecycle
// (PENDING → IN_PROGRESS → IN_TRANSIT → COMPLETED), IN_PROGRESS only means the
// shipment is assigned to a driver who is still heading to pickup — the ride
// hasn't started. Only IN_TRANSIT (started) and COMPLETED (finished) count.
const STARTED_STATUSES = new Set(['IN_TRANSIT', 'COMPLETED']);

// ── component ─────────────────────────────────────────────────────────────────

const LiveTrackingScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { shipment }: { shipment: Shipment } = route.params;

  // Title of another shipment this driver already has IN_TRANSIT. When set, the
  // driver is blocked from starting this ride until they finish that one — the
  // backend enforces "one live ride per driver", and we surface it up-front here.
  const [activeRideTitle, setActiveRideTitle] = useState<string | null>(null);

  // The ride is already underway if we started it earlier this session, or the
  // backend reports a started status. Either way, skip the "Start Ride" card.
  const rideAlreadyStarted =
    startedRides.has(shipment.id) || STARTED_STATUSES.has(shipment.status);

  const mapRef = useRef<MapView>(null);

  // map geometry
  const [pickupCoord, setPickupCoord] = useState<Coord | null>(null);
  const [dropoffCoord, setDropoffCoord] = useState<Coord | null>(null);
  const [truckCoord, setTruckCoord] = useState<Coord | null>(null);
  const [plannedRoute, setPlannedRoute] = useState<Coord[]>([]);
  const [pickupRoute,  setPickupRoute]  = useState<Coord[]>([]);
  const [drivenPath,   setDrivenPath]   = useState<Coord[]>([]);
  const [resolving,    setResolving]    = useState(true);
  // Set when we can't resolve a real pickup/delivery coordinate, so we show an
  // explicit "unavailable" state instead of dropping a pin in the wrong place.
  const [locationError, setLocationError] = useState<string | null>(null);

  // trip phase: heading to the pickup, then the actual pickup→delivery ride.
  // Initialised from the started state so a remount can't drop us back onto the
  // "Start Ride" card after the ride has already begun.
  const [phase, setPhase] = useState<'TO_PICKUP' | 'IN_TRANSIT'>(
    rideAlreadyStarted ? 'IN_TRANSIT' : 'TO_PICKUP',
  );
  const [nearPickup, setNearPickup] = useState(false);
  // True once the driver is within ~50 m of the dropoff. Gates the "Arrival at
  // Destination" button so a driver can only complete the delivery on arrival.
  const [nearDropoff, setNearDropoff] = useState(false);
  const phaseRef = useRef<'TO_PICKUP' | 'IN_TRANSIT'>(
    rideAlreadyStarted ? 'IN_TRANSIT' : 'TO_PICKUP',
  );
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Delivery-proof upload sheet (shown when the driver taps to complete).
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofImages, setProofImages] = useState<Asset[]>([]);
  const [submittingProof, setSubmittingProof] = useState(false);

  // progress
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [totalDistance, setTotalDistance] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [eta, setEta] = useState<string>('');

  // socket health
  const [socketConnected, setSocketConnected] = useState(false);

  // marker + GPS refs
  const [truckMarkerReady, setTruckMarkerReady] = useState(false);
  const gpsObtained = useRef(false);
  const socketRef = useRef<any>(null);

  const arrived = progressPercent >= 100;
  const almostThere = eta === 'Arriving' && !arrived;
  const etaIsUnknown = eta === '' || eta === 'N/A';
  // The driver may only complete the delivery once within ~50 m of the dropoff
  // (or the server has reported 100% progress, which also means arrival).
  const canComplete = nearDropoff || arrived;

  // ── Effect 0: driver's real GPS → initial truck position ─────────────────
  useEffect(() => {
    console.log('📍 Requesting driver GPS position...');
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        gpsObtained.current = true;
        const coord = { latitude: coords.latitude, longitude: coords.longitude };
        console.log('✅ Initial GPS position obtained:', coord);
        setTruckCoord(coord);
        mapRef.current?.animateToRegion(
          { ...coord, latitudeDelta: 0.05, longitudeDelta: 0.05 },
          300,
        );
      },
      (err) => {
        // GPS unavailable — truck will appear from REST or socket
        console.log('❌ GPS error:', err.code, err.message);
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 },
    );
  }, []);

  // ── Phase 1: fetch the driver → pickup route (road-aligned), once ─────────
  const pickupRouteFetched = useRef(false);
  useEffect(() => {
    if (phase !== 'TO_PICKUP') return;
    if (!truckCoord || !pickupCoord || pickupRouteFetched.current) return;
    pickupRouteFetched.current = true;
    fetchRoute(truckCoord, pickupCoord).then(pts => {
      console.log("📍 Pickup route obtained:", pickupCoord);
      setPickupRoute(pts);
      // Frame both the driver and the pickup so the whole leg is visible.
      mapRef.current?.fitToCoordinates([truckCoord, pickupCoord], {
        edgePadding: { top: 120, right: 80, bottom: 360, left: 80 },
        animated: true,
      });
    });
  }, [phase, truckCoord, pickupCoord]);

  // ── Phase 1: reveal "Start Ride" once the driver reaches the pickup ───────
  const PICKUP_RADIUS_KM = 0.15; // ~150 m
  useEffect(() => {
    if (phase !== 'TO_PICKUP' || nearPickup) return;
    if (!truckCoord || !pickupCoord) return;
    if (haversineKm(truckCoord, pickupCoord) <= PICKUP_RADIUS_KM) {
      setNearPickup(true);
    }
  }, [phase, nearPickup, truckCoord, pickupCoord]);

  // ── Phase 2: reveal "Arrival at Destination" within 50 m of the dropoff ───
  const DROPOFF_RADIUS_KM = 0.05; // ~50 m
  useEffect(() => {
    if (phase !== 'IN_TRANSIT' || nearDropoff) return;
    if (!truckCoord || !dropoffCoord) return;
    if (haversineKm(truckCoord, dropoffCoord) <= DROPOFF_RADIUS_KM) {
      setNearDropoff(true);
    }
  }, [phase, nearDropoff, truckCoord, dropoffCoord]);

  // ── Detect a started-but-unfinished ride on another shipment ──────────────
  // A driver may only have one ride IN_TRANSIT at a time. If another shipment is
  // already in transit, surface it so this screen can block "Start Ride" before
  // the driver taps it (rather than only failing on the backend round-trip).
  useEffect(() => {
    if (rideAlreadyStarted) return; // this shipment is the active one — no block
    const driverId = user?.driver_id;
    if (!driverId) return;
    axiosClient
      .get(`/shipment/driver/${driverId}`)
      .then(({ data }) => {
        const list: any[] = data?.data?.shipments ?? [];
        const active = list.find(
          s => s.status === 'IN_TRANSIT' && s._id !== shipment.id,
        );
        if (active) setActiveRideTitle(active.shipment_title ?? t('driver.tracking.anotherShipment'));
      })
      .catch(() => {
        // Non-fatal — the backend still rejects a second concurrent ride.
      });
  }, [user?.driver_id, shipment.id, rideAlreadyStarted, t]);

  // Switch from "heading to pickup" into the live pickup → delivery ride.
  const startRide = () => {
    // Hard stop: can't start a second ride while another is in transit.
    if (activeRideTitle) {
      Alert.alert(
        t('driver.tracking.activeRideAlertTitle'),
        t('driver.tracking.activeRideAlertMessage', { title: activeRideTitle }),
      );
      return;
    }

    startedRides.add(shipment.id); // remember across remounts this session
    setPhase('IN_TRANSIT');
    setDrivenPath([]); // start the travelled-path trail fresh from pickup
    if (pickupCoord) {
      mapRef.current?.animateToRegion(
        { ...pickupCoord, latitudeDelta: 0.05, longitudeDelta: 0.05 },
        400,
      );
    }
    // Tell the backend the ride has started. Best-effort, except a 409 means the
    // driver already has an active ride — revert the optimistic switch and warn.
    updateShipmentStatus(shipment.id, 'IN_TRANSIT').catch(err => {
      if (err?.response?.status === 409) {
        startedRides.delete(shipment.id);
        setPhase('TO_PICKUP');
        phaseRef.current = 'TO_PICKUP';
        setActiveRideTitle(prev => prev ?? t('driver.tracking.anotherShipment'));
        Alert.alert(
          t('driver.tracking.activeRideAlertTitle'),
          t('driver.tracking.activeRideAlertGeneric'),
        );
      } else {
        console.log('⚠️ Failed to mark IN_TRANSIT:', err?.message);
      }
    });
  };

  // Finishing the trip requires delivery proof: tapping "Arrival at Destination"
  // opens the upload sheet rather than completing straight away.
  const openProofModal = () => setShowProofModal(true);

  const addProofImages = async () => {
    const assets = await pickShipmentImages();
    if (assets.length) {
      // Cap at 10 to match the backend's multer array limit.
      setProofImages(prev => [...prev, ...assets].slice(0, 10));
    }
  };

  const removeProofImage = (idx: number) =>
    setProofImages(prev => prev.filter((_, i) => i !== idx));

  // Upload the proof images and mark the shipment COMPLETED in one request.
  // The backend persists the proof URLs and clears the live trail on success.
  const submitProof = async () => {
    if (proofImages.length === 0 || submittingProof) return;
    setSubmittingProof(true);

    const formData = new FormData();
    proofImages.forEach((img, i) => {
      formData.append('delivery_proof', {
        uri: img.uri,
        type: img.type ?? 'image/jpeg',
        name: img.fileName ?? `delivery_proof_${i}.jpg`,
      } as any);
    });

    try {
      await completeShipmentWithProof(shipment.id, formData);
      setShowProofModal(false);
      navigation.goBack();
    } catch (err: any) {
      console.log('⚠️ Failed to complete with proof:', err?.message);
      setSubmittingProof(false);
      Alert.alert(
        t('driver.tracking.proofFailedTitle'),
        t('driver.tracking.proofFailedMessage'),
      );
    }
  };

  // ── Effect 1: resolve pickup/delivery coords + planned route ──────────────
  useEffect(() => {
    const init = async () => {
      setResolving(true);
      setLocationError(null);
      try {
        const [pickup, dropoff] = await Promise.all([
          shipment.pickupCoord
            ? Promise.resolve(shipment.pickupCoord)
            : geocodeAddress(shipment.pickupAddress),
          shipment.deliveryCoord
            ? Promise.resolve(shipment.deliveryCoord)
            : geocodeAddress(shipment.deliveryAddress),
        ]);

        // TEMP DEBUG — confirms where the pickup/delivery pins come from.
        // backend coord present  → rawPickupCoord is set, geocode skipped
        // backend coord missing  → rawPickupCoord undefined, geocodedPickup used
        // both null              → location unavailable (no more silent fallback)
        console.log('🧭 Coord resolution:', {
          pickupAddress:    shipment.pickupAddress,
          rawPickupCoord:   shipment.pickupCoord,
          resolvedPickup:   pickup,
          deliveryAddress:  shipment.deliveryAddress,
          rawDeliveryCoord: shipment.deliveryCoord,
          resolvedDropoff:  dropoff,
        });

        // No hardcoded fallback: a missing coordinate is surfaced, not faked.
        if (!isValidCoord(pickup) || !isValidCoord(dropoff)) {
          if (isValidCoord(pickup)) setPickupCoord(pickup);
          if (isValidCoord(dropoff)) setDropoffCoord(dropoff);
          setLocationError(
            !isValidCoord(pickup)
              ? t('driver.tracking.pickupLocationMissing')
              : t('driver.tracking.deliveryLocationMissing'),
          );
          return;
        }

        setPickupCoord(pickup);
        setDropoffCoord(dropoff);

        const routePts = await fetchRoute(pickup, dropoff);
        setPlannedRoute(routePts.length > 0 ? routePts : [pickup, dropoff]);
      } catch {
        setLocationError(t('driver.tracking.routeLoadFailed'));
      } finally {
        setResolving(false);
      }
    };

    init();
  }, [shipment.pickupAddress, shipment.deliveryAddress, shipment.pickupCoord, shipment.deliveryCoord, t]);

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
          setDrivenPath(sanitizePath(payload.location_history.coordinates.map(fromGeoJson)));
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
      if (!isValidCoord(coord)) return;
      setTruckCoord(coord);
      if (phaseRef.current === 'IN_TRANSIT') setDrivenPath(prev => pushPoint(prev, coord));
      // Pan to follow without resetting the user's zoom level.
      mapRef.current?.animateCamera({ center: coord }, { duration: 400 });
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

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE, onLocationUpdate);
      socket.on(SOCKET_EVENTS.SHIPMENT_PROGRESS_UPDATE, onProgressUpdate);

      socket.emit(SOCKET_EVENTS.JOIN_TRACKING_ROOM, { shipmentId: shipment.id });
    });

    return () => {
      mounted = false;
      const socket = socketRef.current;
      if (socket) {
        socket.emit(SOCKET_EVENTS.LEAVE_TRACKING_ROOM, { shipmentId: shipment.id });
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE, onLocationUpdate);
        socket.off(SOCKET_EVENTS.SHIPMENT_PROGRESS_UPDATE, onProgressUpdate);
      }
    };
  }, [shipment.id]);

  // ── Effect 4: driver GPS push — emit position every 7 s while trip is live
  useEffect(() => {
    if (shipment.status === 'COMPLETED') return; // no-op for completed trips

    const push = () => {
      Geolocation.getCurrentPosition(
        ({ coords }) => {
          const coord: Coord = { latitude: coords.latitude, longitude: coords.longitude };

          // Always update the local marker — no backend round-trip needed
          if (!isValidCoord(coord)) return;
          setTruckCoord(coord);
          if (phaseRef.current === 'IN_TRANSIT') setDrivenPath(prev => pushPoint(prev, coord));
          // Pan to follow the truck WITHOUT resetting the user's zoom level.
          mapRef.current?.animateCamera({ center: coord }, { duration: 400 });

          // Also push to backend so other viewers (transporter/shipper) see the update
          const socket = socketRef.current;
          if (socket?.connected) {
            socket.emit(SOCKET_EVENTS.DRIVER_LOCATION_PUSH, {
              shipmentId: shipment.id,
              latitude: coords.latitude,
              longitude: coords.longitude,
              timestamp: Date.now(),
            });
          }
        },
        (err) => { console.log('❌ GPS push error:', err.code, err.message); },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 7000 },
      );
    };

    push(); // immediate first push
    const interval = setInterval(push, 7000);
    return () => clearInterval(interval);
  }, [shipment.id, shipment.status]);

  // Unmapped statuses still fall back to the raw backend enum, as before.
  const statusLabelKey = STATUS_LABEL[shipment.status];
  const statusLabel = statusLabelKey ? t(statusLabelKey) : shipment.status;
  const statusColor = STATUS_COLOR[shipment.status] ?? '#94A3B8';
  const fillWidth = `${Math.min(progressPercent, 100)}%` as any;
  const distanceToPickup =
    truckCoord && pickupCoord ? haversineKm(truckCoord, pickupCoord) : null;

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
            // No real coord yet — open on a wide view instead of a wrong city.
            // The effects below frame the map once coords resolve.
            : { latitude: 20, longitude: 0, latitudeDelta: 80, longitudeDelta: 80 }
        }
        customMapStyle={mapStyle}
      >
        {/* Phase 1 — driver → pickup route (orange dashed) */}
        {phase === 'TO_PICKUP' && pickupRoute.length > 1 && (
          <Polyline
            coordinates={pickupRoute}
            strokeColor="#F97316"
            strokeWidth={4}
            lineDashPattern={[8, 6]}
          />
        )}

        {/* Phase 2 — planned pickup → delivery route (sky-blue dashed) */}
        {phase === 'IN_TRANSIT' && plannedRoute.length > 1 && (
          <Polyline
            coordinates={plannedRoute}
            strokeColor="#60A5FA"
            strokeWidth={4}
            lineDashPattern={[8, 6]}
          />
        )}

        {/* Driven path — solid blue (only during the ride) */}
        {phase === 'IN_TRANSIT' && drivenPath.length > 1 && (
          <Polyline
            coordinates={drivenPath}
            strokeColor="#0071BC"
            strokeWidth={5}
          />
        )}

        {/* Pickup pin */}
        {pickupCoord && (
          <Marker coordinate={pickupCoord} title={t('driver.tracking.pickup')} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
            <View style={styles.pinPickup}>
              <MapPin size={16} color="#FFF" />
            </View>
          </Marker>
        )}

        {/* Dropoff pin — green on arrival (only once the ride has started) */}
        {phase === 'IN_TRANSIT' && dropoffCoord && (
          <Marker coordinate={dropoffCoord} title={t('driver.tracking.dropoff')} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
            <View style={[styles.pinDropoff, arrived && styles.pinArrived]}>
              <MapPin size={16} color="#FFF" />
            </View>
          </Marker>
        )}

        {/* Live truck marker */}
        {truckCoord && (
          <Marker
            coordinate={truckCoord}
            title={t('driver.tracking.driver')}
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

      {/* Location-unavailable state — shown instead of a misplaced pin */}
      {!resolving && locationError && (
        <View style={styles.locationErrorOverlay}>
          <View style={styles.locationErrorCard}>
            <View style={styles.locationErrorIcon}>
              <MapPin size={28} color="#EF4444" />
            </View>
            <Text style={styles.locationErrorTitle}>{t('driver.tracking.locationUnavailable')}</Text>
            <Text style={styles.locationErrorText}>{locationError}</Text>
            <Text style={styles.locationErrorHint}>
              {t('driver.tracking.locationHint')}
            </Text>
            <TouchableOpacity
              style={styles.locationErrorBtn}
              activeOpacity={0.85}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.locationErrorBtnText}>{t('driver.tracking.goBack')}</Text>
            </TouchableOpacity>
          </View>
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
          <Text style={styles.reconnectText}>{t('driver.tracking.reconnecting')}</Text>
          <ActivityIndicator size="small" color="#92400E" style={{ marginLeft: 6 }} />
        </View>
      )}

      {/* ── ALMOST THERE BANNER ─────────────────────────────────────────────── */}
      {almostThere && (
        <View style={styles.almostBanner}>
          <Navigation size={15} color="#1D4ED8" />
          <Text style={styles.almostText}>{t('driver.tracking.almostThere')}</Text>
        </View>
      )}

      {/* ── ARRIVAL BANNER ──────────────────────────────────────────────────── */}
      {arrived && (
        <View style={styles.arrivalBanner}>
          <CheckCircle size={16} color="#22C55E" />
          <Text style={styles.arrivalText}>{t('driver.tracking.arrived')}</Text>
        </View>
      )}

      {/* ── PHASE 1 CARD — heading to pickup ────────────────────────────────── */}
      {phase === 'TO_PICKUP' && !locationError && (
        <View style={styles.trackingCard}>
          <View style={styles.dragHandle} />

          <View style={styles.pickupHeaderRow}>
            <View style={styles.pickupIconWrap}>
              <Navigation size={18} color="#F97316" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabel}>{t('driver.tracking.headingToPickup')}</Text>
              <Text style={styles.addressValue} numberOfLines={2}>{shipment.pickupAddress}</Text>
            </View>
            {distanceToPickup != null && (
              <Text style={styles.pickupDistance}>
                {distanceToPickup < 1
                  ? t('driver.tracking.distanceMeters', { value: Math.round(distanceToPickup * 1000) })
                  : t('driver.tracking.distanceKm', { value: distanceToPickup.toFixed(1) })}
              </Text>
            )}
          </View>

          <View style={styles.divider} />

          {activeRideTitle ? (
            <>
              <View style={styles.activeRideWarn}>
                <AlertTriangle size={18} color="#B45309" />
                <Text style={styles.activeRideWarnText}>
                  {t('driver.tracking.activeRideWarning', { title: activeRideTitle })}
                </Text>
              </View>
              <View style={[styles.endTripBtn, styles.startRideBtnDisabled]}>
                <Text style={styles.endTripText}>{t('driver.tracking.startRide')}</Text>
              </View>
            </>
          ) : nearPickup ? (
            <>
              <View style={styles.nearPickupHint}>
                <CheckCircle size={16} color="#22C55E" />
                <Text style={styles.nearPickupText}>{t('driver.tracking.reachedPickup')}</Text>
              </View>
              <TouchableOpacity
                style={[styles.endTripBtn, styles.startRideBtn]}
                activeOpacity={0.85}
                onPress={startRide}
              >
                <Text style={styles.endTripText}>{t('driver.tracking.startRide')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.headingHint}>
              <Navigation size={15} color="#F97316" />
              <Text style={styles.headingText}>
                {t('driver.tracking.driveToPickup')}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* ── PHASE 2 CARD — live tracking pickup → delivery ──────────────────── */}
      {phase === 'IN_TRANSIT' && !locationError && (
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
                <Text style={styles.addressLabel}>{t('driver.tracking.pickup')}</Text>
                <Text style={styles.addressValue} numberOfLines={2}>{shipment.pickupAddress}</Text>
              </View>
              <View style={[styles.addressBlock, { marginTop: 8 }]}>
                <Text style={styles.addressLabel}>{t('driver.tracking.delivery')}</Text>
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
                    <Text style={styles.infoLabel}>{t('driver.tracking.contact')}</Text>
                    <Text style={styles.infoValue}>{shipment.contactPerson}</Text>
                  </View>
                )}
                {shipment.timeWindow && (
                  <View style={styles.infoCell}>
                    <Text style={styles.infoLabel}>{t('driver.tracking.timeWindow')}</Text>
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
                <Text style={styles.progressStatLabel}>{t('driver.tracking.covered')}</Text>
                <Text style={styles.progressStatValue}>
                  {distanceCovered > 0
                    ? t('driver.tracking.distanceKm', { value: distanceCovered.toFixed(1) })
                    : '--'}
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
                    <Text style={styles.progressPercentLabel}>{t('driver.tracking.complete')}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.progressPercentUnknown}>--</Text>
                    <Text style={styles.progressPercentLabel}>{t('driver.tracking.inProgress')}</Text>
                  </>
                )}
              </View>

              {/* Total distance */}
              <View style={[styles.progressStat, { alignItems: 'flex-end' }]}>
                <MapPin size={12} color="#0071BC" style={{ marginBottom: 2 }} />
                <Text style={styles.progressStatLabel}>{t('driver.tracking.total')}</Text>
                <Text style={styles.progressStatValue}>
                  {totalDistance != null
                    ? t('driver.tracking.distanceKm', { value: totalDistance.toFixed(1) })
                    : t('driver.tracking.distanceUnknown')}
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
                    arrived && styles.progressBarArrived,
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
                <Text style={styles.etaLabel}>{t('driver.tracking.estimatedArrival')}</Text>
                <Text style={[
                  styles.etaValue,
                  arrived && styles.etaValueArrived,
                  almostThere && styles.etaValueAlmost,
                ]}>
                  {arrived
                    ? t('driver.tracking.arrivedShort')
                    : almostThere
                      ? t('driver.tracking.arrivingSoon')
                      : eta}
                </Text>
              </View>
            )}
          </View>

        {canComplete ? (
          <TouchableOpacity
            style={[styles.endTripBtn, arrived && styles.endTripBtnArrived]}
            activeOpacity={0.85}
            onPress={openProofModal}
          >
            <Text style={styles.endTripText}>{t('driver.tracking.arrivalAtDestination')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headingHint}>
            <Navigation size={15} color="#0071BC" />
            <Text style={styles.headingText}>
              {almostThere
                ? t('driver.tracking.almostThereHint')
                : t('driver.tracking.driveToDestination')}
            </Text>
          </View>
        )}
      </View>
      )}

      {/* ── DELIVERY-PROOF UPLOAD SHEET ─────────────────────────────────────── */}
      <Modal
        visible={showProofModal}
        transparent
        animationType="fade"
        onRequestClose={() => !submittingProof && setShowProofModal(false)}
      >
        <View style={styles.proofBackdrop}>
          <View style={styles.proofCard}>
            {/* Header */}
            <View style={styles.proofHeader}>
              <Text style={styles.proofTitle}>{t('driver.tracking.proofTitle')}</Text>
              <TouchableOpacity
                style={styles.proofClose}
                onPress={() => !submittingProof && setShowProofModal(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={20} color="#1A1C1E" />
              </TouchableOpacity>
            </View>

            <View style={styles.proofDivider} />

            <Text style={styles.proofLabel}>{t('driver.tracking.proofLabel')}</Text>

            {/* First-pick / empty state */}
            {proofImages.length === 0 ? (
              <TouchableOpacity
                style={styles.proofUploadBox}
                activeOpacity={0.7}
                onPress={addProofImages}
              >
                <Upload size={26} color="#94A3B8" />
                <Text style={styles.proofUploadText}>{t('driver.tracking.proofUpload')}</Text>
              </TouchableOpacity>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.proofThumbRow}
              >
                {proofImages.map((img, i) => (
                  <View key={`${img.uri}-${i}`} style={styles.proofThumbWrap}>
                    <Image source={{ uri: img.uri }} style={styles.proofThumb} />
                    <TouchableOpacity
                      style={styles.proofThumbRemove}
                      onPress={() => removeProofImage(i)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <X size={12} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Add-more box */}
            {proofImages.length < 10 && (
              <TouchableOpacity
                style={styles.proofAddBox}
                activeOpacity={0.7}
                onPress={addProofImages}
              >
                <Plus size={24} color="#94A3B8" />
              </TouchableOpacity>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[
                styles.proofSubmit,
                (proofImages.length === 0 || submittingProof) && styles.proofSubmitDisabled,
              ]}
              activeOpacity={0.85}
              disabled={proofImages.length === 0 || submittingProof}
              onPress={submitProof}
            >
              {submittingProof ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Check size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // location-unavailable state
  locationErrorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.96)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    zIndex: 30,
    elevation: 30,
  },
  locationErrorCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
  },
  locationErrorIcon: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
  },
  locationErrorTitle: { fontSize: 18, fontWeight: '800', color: '#1A1C1E', marginBottom: 6 },
  locationErrorText:  { fontSize: 14, fontWeight: '600', color: '#475569', textAlign: 'center' },
  locationErrorHint:  { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 8, lineHeight: 18 },
  locationErrorBtn: {
    marginTop: 20, alignSelf: 'stretch',
    backgroundColor: '#0071BC', height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  locationErrorBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },

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
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
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
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 20, elevation: 10,
  },
  dragHandle: {
    width: 40, height: 5, backgroundColor: '#E2E8F0',
    borderRadius: 3, alignSelf: 'center', marginBottom: 12,
  },

  // route section
  routeRow: { flexDirection: 'row', alignItems: 'stretch' },
  routeIcons: { width: 20, alignItems: 'center', paddingTop: 4 },
  dotPickup: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0071BC' },
  routeLine: { flex: 1, width: 2, backgroundColor: '#93C5FD', marginVertical: 4, minHeight: 24 },
  dotBlue: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0071BC' },
  routeAddresses: { flex: 1, marginLeft: 12 },
  addressBlock: {},
  addressLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 2 },
  addressValue: { fontSize: 14, fontWeight: '700', color: '#1A1C1E' },

  // info row
  infoRow: { flexDirection: 'row', gap: 16 },
  infoCell: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 13, fontWeight: '700', color: '#1A1C1E' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },

  // progress section
  progressSection: { marginBottom: 10 },
  progressHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  progressStat: { alignItems: 'flex-start', minWidth: 72 },
  progressStatLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 2 },
  progressStatValue: { fontSize: 15, fontWeight: '800', color: '#1A1C1E' },
  progressCenter: { alignItems: 'center' },
  progressPercent: { fontSize: 24, fontWeight: '900', color: '#0071BC' },
  progressPercentArrived: { color: '#22C55E' },
  progressPercentAlmost: { color: '#1D4ED8' },
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
  progressBarArrived: { backgroundColor: '#22C55E' },
  progressBarAlmost: { backgroundColor: '#3B82F6' },
  progressBarIndeterminate: { width: '100%', opacity: 0.3 },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  etaLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  etaValue: { fontSize: 13, fontWeight: '800', color: '#1A1C1E' },
  etaValueArrived: { color: '#22C55E' },
  etaValueAlmost: { color: '#1D4ED8' },

  // buttons
  endTripBtn: {
    backgroundColor: '#0071BC', height: 48,
    borderRadius: 14, justifyContent: 'center', alignItems: 'center',
  },
  endTripBtnArrived: { backgroundColor: '#22C55E' },
  endTripBtnAlmost: { backgroundColor: '#3B82F6' },
  endTripText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  // phase 1 — heading to pickup
  pickupHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  pickupIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  pickupDistance: { fontSize: 15, fontWeight: '800', color: '#F97316', marginLeft: 8 },
  headingHint: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headingText: { flex: 1, fontSize: 13, color: '#64748B', fontWeight: '600' },
  nearPickupHint: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  nearPickupText: { fontSize: 14, color: '#15803D', fontWeight: '700' },
  startRideBtn: { backgroundColor: '#22C55E' },
  startRideBtnDisabled: { backgroundColor: '#CBD5E1' },

  // blocked-by-active-ride warning
  activeRideWarn: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1, borderColor: '#FDE68A',
    borderRadius: 12, padding: 12, marginBottom: 12,
  },
  activeRideWarnText: { flex: 1, fontSize: 13, color: '#92400E', fontWeight: '700', lineHeight: 18 },

  // delivery-proof upload sheet
  proofBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  proofCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 20, elevation: 10,
  },
  proofHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  proofTitle: { fontSize: 18, fontWeight: '800', color: '#1A1C1E' },
  proofClose: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },
  proofDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 14 },
  proofLabel: { fontSize: 15, fontWeight: '700', color: '#1A1C1E', marginBottom: 12 },
  proofUploadBox: {
    height: 110, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#CBD5E1', borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  proofUploadText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  proofThumbRow: { gap: 10, paddingVertical: 2 },
  proofThumbWrap: { width: 90, height: 90 },
  proofThumb: { width: 90, height: 90, borderRadius: 12, backgroundColor: '#E2E8F0' },
  proofThumbRemove: {
    position: 'absolute', top: -6, right: -6,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#EF4444',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF',
  },
  proofAddBox: {
    height: 64, borderRadius: 12, marginTop: 14,
    borderWidth: 1.5, borderColor: '#CBD5E1', borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center', alignItems: 'center',
  },
  proofSubmit: {
    marginTop: 20, height: 52, borderRadius: 14,
    backgroundColor: '#0071BC',
    justifyContent: 'center', alignItems: 'center',
  },
  proofSubmitDisabled: { backgroundColor: '#94A3B8' },
});

const mapStyle = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

export default LiveTrackingScreen;
