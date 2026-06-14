export interface Bank {
  _id?: string;
  account_number: string;
  routing_number: string;
  bank_name: string;
  bankholder_name: string;
  bank_address: string;
  createdAt?: string;
  updatedAt?: string;
}

// The editable fields sent to the backend (user_id is derived from the token).
export type BankPayload = Omit<Bank, "_id" | "createdAt" | "updatedAt">;
