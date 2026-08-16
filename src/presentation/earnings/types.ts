// types/earning.ts
import { EarningListItem, EarningPaymentMethod } from "../../data/services/earningService";

export interface Earning {
  id: string;
  companyName: string;
  amount: number;
  method: EarningPaymentMethod;
  date: string;
}

export const mapEarning = (item: EarningListItem): Earning => ({
  id: item.earning_id,
  companyName: item.company_name || "—",
  amount: typeof item.amount === "number" ? item.amount : 0,
  method: item.payment_method,
  date: item.payment_date,
});

export interface WithdrawForm {
  amount: string;
  region: string;
}