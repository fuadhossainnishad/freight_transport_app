import {
    addBankDetailsAPI,
    getBankDetailsAPI,
    updateBankDetailsAPI,
    deleteBankDetailsAPI,
} from "../../data/services/bankService";
import { BankRole } from "../constants/api";
import { Bank, BankPayload } from "../entities/bank.entity";

export const getBankDetails = async (role: BankRole): Promise<Bank[]> => {
    try {
        return await getBankDetailsAPI(role);
    } catch (error) {
        console.error("Error fetching bank details:", error);
        return [];
    }
};

export const addBankDetails = async (
    role: BankRole,
    bank: BankPayload
): Promise<Bank> => {
    return await addBankDetailsAPI(role, bank);
};

export const updateBankDetails = async (
    role: BankRole,
    bankId: string,
    bank: Partial<BankPayload>
): Promise<Bank> => {
    return await updateBankDetailsAPI(role, bankId, bank);
};

export const deleteBankDetails = async (
    role: BankRole,
    bankId: string
): Promise<void> => {
    return await deleteBankDetailsAPI(role, bankId);
};
