import { useCallback, useEffect, useState } from "react";
import { getMyTransporterPayments } from "../../../data/services/transporterPaymentService";
import {
  findPendingRequestFor,
  TransporterPayment,
} from "../../../domain/entities/transporterPayment.entity";

/**
 * The transporter's outstanding payment request for a shipment, if any.
 *
 * The backend 409s ("A pending payment request already exists for this
 * shipment") on a second request while one is still pending, so the screen
 * needs this to decide whether offering the button makes sense at all.
 *
 * `enabled` gates the call: /transporter-pay/my-requests is transporter-only,
 * and this screen is shared with the shipper stacks.
 */
export const useShipmentPaymentRequest = (shipmentId: string, enabled: boolean) => {
  const [pendingRequest, setPendingRequest] = useState<TransporterPayment | undefined>();
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setPendingRequest(undefined);
      return;
    }
    setLoading(true);
    try {
      const all = await getMyTransporterPayments();
      setPendingRequest(findPendingRequestFor(all, shipmentId));
    } catch (err) {
      // Non-fatal — fall back to showing the button. A genuine duplicate still
      // gets caught server-side and surfaces its message in the modal.
      console.log("Payment request lookup failed:", err);
      setPendingRequest(undefined);
    } finally {
      setLoading(false);
    }
  }, [shipmentId, enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { pendingRequest, loading, refresh };
};
