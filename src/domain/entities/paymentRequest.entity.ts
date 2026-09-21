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
  };
};

// Only un-actioned requests count as outstanding for the tab badge / "Pay Now".
// dmp_pending is excluded: DMP is admin-only (backend locks request_method
// to 'dmp' and rejects a shipper switching to cash/bank/online for it), so
// the only way to settle it is the emailed PayDunya pay link, tracked here
// via the separate "Check DMP status" action instead of Pay Now.
export const isPayable = (status: PaymentRequestStatus) =>
  status === "pending";
