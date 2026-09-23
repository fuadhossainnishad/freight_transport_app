import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getMyPaymentRequests } from "../../data/services/paymentRequestService";
import { BankDetails, PaymentRequest, isPayable } from "../../domain/entities/paymentRequest.entity";
import { loadBankDetails, saveBankDetails } from "../../shared/storage/bankDetailsStorage";

// Statuses that are waiting on something we are not told about: an online
// payment waiting on the PayDunya webhook, or a DMP waiting on the emailed
// link being paid. There is no payment socket event (socketEvents.ts has
// none), so a short poll is the only way the list ever self-corrects.
const SETTLING_STATUSES: ReadonlyArray<PaymentRequest["status"]> = ["online_processing", "dmp_pending"];

// Deliberately bounded and short. The webhook usually lands within seconds; if
// it does not, the user still has pull-to-refresh and the DMP check button. An
// unbounded poll on a payment list is a battery and rate-limit problem.
const POLL_DELAYS_MS = [3000, 8000, 15000];

interface Ctx {
  requests: PaymentRequest[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  pendingCount: number;
  /** Ids currently being re-checked after a payment — their Pay Now is disabled. */
  settlingIds: string[];
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  /** Bank details returned by pay-now, kept so the shipper can reopen them. */
  getCachedBankDetails: (paymentId: string) => BankDetails | undefined;
  cacheBankDetails: (paymentId: string, details: BankDetails) => void;
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
  const [pendingCount, setPendingCount] = useState(0);
  const [settlingIds, setSettlingIds] = useState<string[]>([]);

  // Bumped by every refresh. A loadMore that resolves after a newer refresh has
  // already replaced the list carries a stale generation and is dropped —
  // otherwise it appends page 2 onto a fresh page 1 and the FlatList renders
  // duplicate item.id keys. Reachable today: useFocusEffect(refresh) on the
  // list screen races an in-flight loadMore from scrolling.
  const generation = useRef(0);
  const pollTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mounted = useRef(true);

  const clearPollTimers = useCallback(() => {
    pollTimers.current.forEach(clearTimeout);
    pollTimers.current = [];
  }, []);

  const applyPendingCount = (res: { data: PaymentRequest[]; meta: any }, list: PaymentRequest[]) => {
    if (typeof res.meta.pendingCount === "number") return res.meta.pendingCount;
    return list.filter((r) => isPayable(r.status)).length;
  };

  const fetchFirstPage = useCallback(async () => {
    const myGeneration = ++generation.current;
    try {
      const res = await getMyPaymentRequests(1, 10);
      // A newer refresh started while this was in flight — its result wins.
      if (!mounted.current || myGeneration !== generation.current) return [];
      setRequests(res.data);
      setPage(1);
      setHasMore(res.meta.page < res.meta.totalPage);
      setPendingCount(applyPendingCount(res, res.data));
      return res.data;
    } catch {
      // Swallowed deliberately: this runs on mount and on every focus, and a
      // transient failure must not blank a list the user is already reading.
      return [];
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    clearPollTimers();
    const data = await fetchFirstPage();

    // Anything still settling gets a few bounded re-checks, so a shipper who
    // has just paid is not left staring at "processing" with a live Pay Now
    // button (and cannot pay twice while we are checking).
    const settling = data.filter((r) => SETTLING_STATUSES.includes(r.status)).map((r) => r.id);
    if (!settling.length) {
      setSettlingIds([]);
      return;
    }

    setSettlingIds(settling);
    POLL_DELAYS_MS.forEach((delay, index) => {
      const timer = setTimeout(async () => {
        if (!mounted.current) return;
        const next = await fetchFirstPage();
        const stillSettling = next.filter((r) => SETTLING_STATUSES.includes(r.status)).map((r) => r.id);
        // Stop early once everything settled, and always clear on the last try
        // so Pay Now cannot stay disabled forever.
        if (!stillSettling.length || index === POLL_DELAYS_MS.length - 1) {
          clearPollTimers();
          setSettlingIds([]);
        } else {
          setSettlingIds(stillSettling);
        }
      }, delay);
      pollTimers.current.push(timer);
    });
  }, [clearPollTimers, fetchFirstPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    const myGeneration = generation.current;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getMyPaymentRequests(nextPage, 10);
      if (!mounted.current || myGeneration !== generation.current) return;
      setRequests((prev) => [...prev, ...res.data]);
      setPage(nextPage);
      setHasMore(res.meta.page < res.meta.totalPage);
      if (typeof res.meta.pendingCount === "number") {
        setPendingCount(res.meta.pendingCount);
      }
    } catch {
      // Same: a failed page-2 fetch leaves the pages already loaded intact.
    } finally {
      if (mounted.current) setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);

  // POST /pay/pay-now returns the receiving account once. The request then
  // becomes bank_pending, which isPayable() excludes, so the modal that showed
  // them can never be reopened — without this the shipper loses the account
  // number the moment they dismiss the sheet. State rather than a ref so that
  // hydrating from storage re-renders the "View transfer details" button.
  const [bankDetailsCache, setBankDetailsCache] = useState<Record<string, BankDetails>>({});

  useEffect(() => {
    loadBankDetails().then((stored) => {
      if (!mounted.current) return;
      // Merge under anything already captured this session.
      setBankDetailsCache((prev) => ({ ...stored, ...prev }));
    });
  }, []);

  const cacheBankDetails = useCallback((paymentId: string, details: BankDetails) => {
    setBankDetailsCache((prev) => {
      const next = { ...prev, [paymentId]: details };
      saveBankDetails(next);
      return next;
    });
  }, []);

  const getCachedBankDetails = useCallback(
    (paymentId: string) => bankDetailsCache[paymentId],
    [bankDetailsCache],
  );

  useEffect(() => {
    mounted.current = true;
    refresh();
    return () => {
      mounted.current = false;
      clearPollTimers();
    };
    // Run once on mount; refresh is stable and re-running it here would restart
    // the poll on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaymentRequestsContext.Provider
      value={{
        requests,
        loading,
        loadingMore,
        hasMore,
        pendingCount,
        settlingIds,
        refresh,
        loadMore,
        getCachedBankDetails,
        cacheBankDetails,
      }}
    >
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
