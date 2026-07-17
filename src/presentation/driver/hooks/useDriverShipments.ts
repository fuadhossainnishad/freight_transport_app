import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../app/context/Auth.context';
import axiosClient from '../../../shared/config/axios.config';
import { normalizeImageUrl } from '../../../shared/utils/normalizeImageUrl';
import { Shipment, Coord } from '../types';

// Backend sends location as a GeoJSON Point: { coordinates: [lng, lat] }.
// react-native-maps wants { latitude, longitude }, so swap the order here.
// Returns undefined when the field is missing or malformed, so the tracking
// screen falls back to geocoding the address instead of a bad pin.
const fromGeoJsonPoint = (point: any): Coord | undefined => {
  const coords = point?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return undefined;
  const [lng, lat] = coords;
  if (typeof lat !== 'number' || typeof lng !== 'number') return undefined;
  if (lat === 0 && lng === 0) return undefined; // null-island placeholder
  return { latitude: lat, longitude: lng };
};

const mapApiShipment = (s: any): Shipment => ({
  id: s._id,
  title: s.shipment_title,
  pickupAddress: s.pickup_address,
  deliveryAddress: s.delivery_address,
  pickupCoord: fromGeoJsonPoint(s.pickup_location),
  deliveryCoord: fromGeoJsonPoint(s.delivery_location),
  status: s.status,
  driverId: s.driver_id,
  transporterId: s.transporter_id,
  imageUrl: normalizeImageUrl(s.shipment_images?.[0]) || undefined,
  // Null until a bid is accepted. Don't coerce to 0 — the card would show a
  // real-looking "$0" quote instead of "no price yet".
  priceMin: s.price ?? null,
  priceMax: s.price ?? null,
  origin: s.pickup_address,
  destination: s.delivery_address,
  commodity: s.category,
  description: s.discription,
  weight: s.weight,
  dimensions: s.dimensions,
  packaging: s.type_of_packaging,
  timeWindow: s.time_window,
  contactPerson: s.contact_person,
});

export const useDriverShipments = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    const driverId = user?.driver_id;
    if (!driverId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(`/shipment/driver/${driverId}`);
      
      const raw = res.data?.data?.shipments ?? [];
      setShipments(raw.map(mapApiShipment));
    } catch (err: any) {
      // err.message is raw axios/network text and stays English; only the
      // fallback is ours to translate.
      setError(err?.message ?? t('driver.home.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [user?.driver_id, t]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { shipments, loading, error, refresh: fetch };
};
