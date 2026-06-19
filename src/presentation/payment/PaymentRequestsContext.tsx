import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getMyPaymentRequests } from "../../data/services/paymentRequestService";
import { PaymentRequest, isPayable } from "../../domain/entities/paymentRequest.entity";

interface Ctx {
  requests: PaymentRequest[];
  loading: boolean;
  pendingCount: number;
  refresh: () => Promise<void>;
}

const PaymentRequestsContext = createContext<Ctx | undefined>(undefined);

/** Shares the payment-request list + pending count between the tab badge and
 *  the list screen, so paying a request updates the badge immediately. */
export function PaymentRequestsProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const list = await getMyPaymentRequests();
      setRequests(list);
    } catch (err) {
      console.log("Payment requests error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pendingCount = requests.filter((r) => isPayable(r.status)).length;

  return (
    <PaymentRequestsContext.Provider value={{ requests, loading, pendingCount, refresh }}>
      {children}
    </PaymentRequestsContext.Provider>
  );
}

export function usePaymentRequests() {
  const ctx = useContext(PaymentRequestsContext);
  if (!ctx) throw new Error("usePaymentRequests must be used within PaymentRequestsProvider");
  return ctx;
}
