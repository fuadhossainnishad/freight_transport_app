import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../app/context/Auth.context';
import axiosClient from '../../../shared/config/axios.config';
import { normalizeImageUrl } from '../../../shared/utils/normalizeImageUrl';
import { Shipment } from '../types';

const mapApiShipment = (s: any): Shipment => ({
  id: s._id,
  title: s.shipment_title,
  pickupAddress: s.pickup_address,
  deliveryAddress: s.delivery_address,
  status: s.status,
  driverId: s.driver_id,
  transporterId: s.transporter_id,
  imageUrl: normalizeImageUrl(s.shipment_images?.[0]) || undefined,
  priceMin: s.price ?? 0,
  priceMax: s.price ?? 0,
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
      setError(err?.message ?? 'Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  }, [user?.driver_id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { shipments, loading, error, refresh: fetch };
};
