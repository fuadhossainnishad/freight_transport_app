import { BankRole, BANK_DETAILS, BANK_DETAIL } from "../../domain/constants/api";
import { Bank, BankPayload } from "../../domain/entities/bank.entity";
import axiosClient from "../../shared/config/axios.config";

// GET — returns the list of bank accounts for the logged-in user.
export const getBankDetailsAPI = async (role: BankRole): Promise<Bank[]> => {
    const { data } = await axiosClient.get(BANK_DETAILS(role));
    return (data?.data as Bank[]) ?? [];
};

// POST — create a new bank account.
export const addBankDetailsAPI = async (
    role: BankRole,
    bank: BankPayload
): Promise<Bank> => {
    const { data } = await axiosClient.post(BANK_DETAILS(role), bank);
    return data?.data as Bank;
};

// PATCH — update an existing bank account by id.
export const updateBankDetailsAPI = async (
    role: BankRole,
    bankId: string,
    bank: Partial<BankPayload>
): Promise<Bank> => {
    const { data } = await axiosClient.patch(BANK_DETAIL(role, bankId), bank);
    return data?.data as Bank;
};

// DELETE — remove a bank account by id.
export const deleteBankDetailsAPI = async (
    role: BankRole,
    bankId: string
): Promise<void> => {
    await axiosClient.delete(BANK_DETAIL(role, bankId));
};
