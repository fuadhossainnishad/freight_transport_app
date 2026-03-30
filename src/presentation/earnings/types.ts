// types/earning.ts
export type EarningStatus = "PENDING" | "CONFIRMED";

export interface Earning {
  id: string;
  title: string;
  amount: number;
  status: EarningStatus;
  date: string;
}

export interface WithdrawForm {
  amount: string;
  region: string;
}