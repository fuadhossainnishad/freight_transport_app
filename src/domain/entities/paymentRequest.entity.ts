// Shipper-facing payment request (admin asks the shipper to pay for a shipment).
// Mirrors the backend Payment model (/pay/my-requests).

export type PaymentRequestStatus =
  | "pending"
  | "dmp_pending"
  | "online_processing"
  | "cash_pending"
  | "bank_pending"
  | "completed"
  | "verified"
  | "rejected"
  | "cancelled";

// The company's receiving account for a manual bank transfer. Returned by
// POST /pay/pay-now with payment_method "bank"; also read off the list payload
// when the backend includes it, so the shipper can retrieve it later.
export interface BankDetails {
  bank_name?: string;
  account_number?: string;
  account_holder?: string;
  bank_address?: string;
  routing_number?: string;
}

export const hasBankDetails = (b?: BankDetails | null): boolean =>
  !!b && Object.values(b).some((v) => typeof v === "string" && v.trim() !== "");

export interface PaymentRequest {
  id: string;            // payment _id
  shortId: string;       // "#" + last 7 chars, like the web "Request ID"
  shipmentTitle: string;
  pickup: string;
  delivery: string;
  amount: number;
  status: PaymentRequestStatus;
  requestedBy: string;   // admin email
  createdAt?: string;
  paydunyaUrl?: string;
  // Only present once a bank transfer has been chosen, and only if the backend
  // returns it on the list. Undefined is normal — see the session cache in
  // PaymentRequestsContext for the fallback.
  bankDetails?: BankDetails;
}

export const mapPaymentRequest = (item: any): PaymentRequest => {
  const id: string = item?._id ?? "";
  const shipment = item?.shipment_id ?? {};
  return {
    id,
    shortId: id ? `#${id.slice(-7)}` : "#—",
    shipmentTitle: shipment?.shipment_title || "N/A",
    pickup: shipment?.pickup_address || "N/A",
    delivery: shipment?.delivery_address || "N/A",
    amount: typeof item?.amount === "number" ? item.amount : 0,
    status: (item?.status ?? "pending") as PaymentRequestStatus,
    requestedBy: item?.requested_by?.email ?? "—",
    createdAt: item?.createdAt,
    paydunyaUrl: item?.paydunya_url,
    bankDetails: item?.bank_details ?? undefined,
  };
};

// Only un-actioned requests count as outstanding for the tab badge / "Pay Now".
// dmp_pending is excluded: DMP is admin-only (backend locks request_method
// to 'dmp' and rejects a shipper switching to cash/bank/online for it), so
// the only way to settle it is the emailed PayDunya pay link, tracked here
// via the separate "Check DMP status" action instead of Pay Now.
export const isPayable = (status: PaymentRequestStatus) =>
  status === "pending" || status === "online_processing";
