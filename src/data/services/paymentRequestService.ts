import { DMP_STATUS, GET_MY_PAYMENT_REQUESTS, PAY_NOW } from "../../domain/constants/api";
import axiosClient from "../../shared/config/axios.config";
import { BankDetails, mapPaymentRequest, PaymentRequest } from "../../domain/entities/paymentRequest.entity";

export const getMyPaymentRequests = async (page: number = 1, limit: number = 10): Promise<{ data: PaymentRequest[], meta: any }> => {
  const res = await axiosClient.get(`${GET_MY_PAYMENT_REQUESTS}?page=${page}&limit=${limit}`);
  const list = res.data?.data ?? [];
  return {
    data: (Array.isArray(list) ? list : []).map(mapPaymentRequest),
    meta: res.data?.meta ?? { total: 0, page, limit, totalPage: 1 }
  };
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
  bank_details?: BankDetails | null;
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
