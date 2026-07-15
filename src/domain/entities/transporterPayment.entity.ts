// Transporter-facing payment request (the transporter asks to be paid for a
// shipment they carried). Mirrors the backend TransporterPayment model
// (/transporter-pay). Not to be confused with paymentRequest.entity.ts, which is
// the shipper paying an admin-raised request.

export type TransporterPaymentStatus =
  | "pending"
  | "online_processing"
  | "paid"
  | "rejected";

export type TransporterPaymentMethod = "cash" | "bank" | "online";

// The backend only accepts a request for a shipment in one of these states.
// Gate the UI on the same rule so we don't fire a request that 400s.
export const PAYABLE_SHIPMENT_STATUSES = ["IN_PROGRESS", "COMPLETED"];

export const canRequestPayment = (status?: string) =>
  !!status && PAYABLE_SHIPMENT_STATUSES.includes(status);

// The backend rejects a second request while one is still pending (409), so the
// UI has to know about existing requests to avoid offering a doomed button.
export const isPendingRequest = (payment: TransporterPayment) =>
  payment.status === "pending" || payment.status === "online_processing";

export const findPendingRequestFor = (
  payments: TransporterPayment[],
  shipmentId: string,
): TransporterPayment | undefined =>
  payments.find((p) => p.shipmentId === shipmentId && isPendingRequest(p));

export interface TransporterPayment {
  id: string;
  shortId: string;
  shipmentId: string;
  amount: number;
  status: TransporterPaymentStatus;
  method: TransporterPaymentMethod;
  notes?: string;
  rejectionReason?: string;
  createdAt?: string;

  // online only
  mobileMoneyPhone?: string;
  paydunyaUrl?: string;
  paydunyaToken?: string;

  // bank only
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
}

// `shipment_id` is a bare id on the create response but a populated object on
// /my-requests, so read the id out of whichever shape arrived.
const readShipmentId = (raw: any): string =>
  typeof raw === "string" ? raw : raw?._id ?? "";

export const mapTransporterPayment = (item: any): TransporterPayment => {
  const id: string = item?._id ?? "";
  return {
    id,
    shortId: id ? `#${id.slice(-7)}` : "#—",
    shipmentId: readShipmentId(item?.shipment_id),
    amount: typeof item?.amount === "number" ? item.amount : 0,
    status: (item?.status ?? "pending") as TransporterPaymentStatus,
    method: (item?.payment_method ?? "cash") as TransporterPaymentMethod,
    notes: item?.notes,
    rejectionReason: item?.rejection_reason,
    createdAt: item?.createdAt,

    mobileMoneyPhone: item?.mobile_money_phone,
    paydunyaUrl: item?.paydunya_url,
    paydunyaToken: item?.paydunya_token,

    bankName: item?.bank_name,
    accountNumber: item?.account_number,
    accountHolder: item?.account_holder,
  };
};
