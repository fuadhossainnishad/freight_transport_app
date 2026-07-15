import {
  GET_MY_TRANSPORTER_PAYMENTS,
  REQUEST_TRANSPORTER_PAYMENT,
} from "../../domain/constants/api";
import axiosClient from "../../shared/config/axios.config";
import {
  mapTransporterPayment,
  TransporterPayment,
} from "../../domain/entities/transporterPayment.entity";

interface BasePayload {
  shipment_id: string;
  // Optional — the backend falls back to the shipment's agreed price.
  amount?: number;
  notes?: string;
}

// The backend rejects a bank request without the three account fields, and an
// online request without a phone. Modelling that as a union means a malformed
// request fails to compile rather than 400-ing at runtime.
export type RequestPaymentPayload =
  | (BasePayload & { payment_method: "cash" })
  | (BasePayload & {
      payment_method: "online";
      mobile_money_phone: string;
    })
  | (BasePayload & {
      payment_method: "bank";
      bank_name: string;
      account_number: string;
      account_holder: string;
      bank_address?: string;
      routing_number?: string;
    });

// POST /transporter-pay/request — submit a payment request for a shipment.
// For payment_method "online" the response carries a PayDunya checkout URL.
export const requestTransporterPayment = async (
  payload: RequestPaymentPayload,
): Promise<TransporterPayment> => {
  const res = await axiosClient.post(REQUEST_TRANSPORTER_PAYMENT, payload);
  return mapTransporterPayment(res.data?.data ?? res.data);
};

// GET /transporter-pay/my-requests — every request this transporter has raised.
export const getMyTransporterPayments = async (): Promise<TransporterPayment[]> => {
  const res = await axiosClient.get(GET_MY_TRANSPORTER_PAYMENTS);
  const list = res.data?.data ?? res.data ?? [];
  return (Array.isArray(list) ? list : []).map(mapTransporterPayment);
};
