import { GET_MY_PAYMENT_REQUESTS, PAY_NOW } from "../../domain/constants/api";
import axiosClient from "../../shared/config/axios.config";
import { mapPaymentRequest, PaymentRequest } from "../../domain/entities/paymentRequest.entity";

// GET /pay/my-requests — all payment requests addressed to the logged-in shipper.
export const getMyPaymentRequests = async (): Promise<PaymentRequest[]> => {
  const res = await axiosClient.get(GET_MY_PAYMENT_REQUESTS);
  const list = res.data?.data ?? res.data ?? [];
  return (Array.isArray(list) ? list : []).map(mapPaymentRequest);
};

export type PayMethod = "online" | "cash" | "bank";

export interface PayNowResult {
  payment_method: PayMethod;
  payment_url?: string;     // online: PayDunya checkout URL for the WebView
  token?: string;
  amount?: number;
  message?: string;
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
