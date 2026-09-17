import { DMP_STATUS, GET_MY_PAYMENT_REQUESTS, PAY_NOW } from "../../domain/constants/api";
import axiosClient from "../../shared/config/axios.config";
import { mapPaymentRequest, PaymentRequest } from "../../domain/entities/paymentRequest.entity";

// GET /pay/my-requests — all payment requests addressed to the logged-in shipper.
export const getMyPaymentRequests = async (): Promise<PaymentRequest[]> => {
  const res = await axiosClient.get(GET_MY_PAYMENT_REQUESTS);
  const list = res.data?.data ?? res.data ?? [];
  return (Array.isArray(list) ? list : []).map(mapPaymentRequest);
};

// These strings are the API contract for `payment_method` — never translate them.
export type PayMethod = "online" | "cash" | "bank";

export interface PayNowResult {
  payment_method: PayMethod;
  payment_url?: string;     // online: PayDunya checkout URL for the WebView
  token?: string;
  amount?: number;
  message?: string;
  reference_number?: string | null;
  bank_details?: {
    bank_name?: string;
    account_number?: string;
    account_holder?: string;
    bank_address?: string;
    routing_number?: string;
  } | null;
}

// POST /pay/pay-now/:paymentId — choose a method and initiate payment.
export const payNow = async (
  paymentId: string,
  method: PayMethod,
  transaction_id?: string,
): Promise<PayNowResult> => {
  const body: any = { payment_method: method };
  if (transaction_id) body.transaction_id = transaction_id;

  const res = await axiosClient.post(PAY_NOW(paymentId), body);
  return (res.data?.data ?? res.data) as PayNowResult;
};

// `dmp_status` is PayDunya's view of the request; `payment_status` is our record.
export interface DmpStatusResult {
  reference_number: string;
  dmp_status: "pending" | "completed" | "failed";
  payment_status: string;
}

// GET /pay/dmp-status/:paymentId — polls PayDunya and settles the payment record
// server-side once it has been paid. DMP has no webhook, so nothing marks the
// payment complete unless this is called.
export const checkDmpStatus = async (paymentId: string): Promise<DmpStatusResult> => {
  const res = await axiosClient.get(DMP_STATUS(paymentId));
  return (res.data?.data ?? res.data) as DmpStatusResult;
};
