import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getMyPaymentRequests } from "../../data/services/paymentRequestService";
import { PaymentRequest, isPayable } from "../../domain/entities/paymentRequest.entity";

interface Ctx {
  requests: PaymentRequest[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  pendingCount: number;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

const PaymentRequestsContext = createContext<Ctx | undefined>(undefined);

/** Shares the payment-request list + pending count between the tab badge and
 *  the list screen, so paying a request updates the badge immediately. */
export function PaymentRequestsProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await getMyPaymentRequests(1, 10);
      setRequests(res.data);
      setPage(1);
      setHasMore(res.meta.page < res.meta.totalPage);
    } catch (err) {
      console.log("Payment requests error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getMyPaymentRequests(nextPage, 10);
      setRequests((prev) => [...prev, ...res.data]);
      setPage(nextPage);
      setHasMore(res.meta.page < res.meta.totalPage);
    } catch (err) {
      console.log("Payment requests loadMore error:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pendingCount = requests.filter((r) => isPayable(r.status)).length;

  return (
    <PaymentRequestsContext.Provider value={{ requests, loading, loadingMore, hasMore, pendingCount, refresh, loadMore }}>
      {children}
    </PaymentRequestsContext.Provider>
  );
}

export function usePaymentRequests() {
  const ctx = useContext(PaymentRequestsContext);
  if (!ctx) throw new Error("usePaymentRequests must be used within PaymentRequestsProvider");
  return ctx;
}

/** Same context, but returns undefined instead of throwing when there is no
 *  provider. For screens shared with the transporter stack, which has no
 *  shipper payment-request list to keep in sync. */
export function usePaymentRequestsOptional() {
  return useContext(PaymentRequestsContext);
}
