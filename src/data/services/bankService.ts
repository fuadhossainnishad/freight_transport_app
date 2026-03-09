import { BANK_API_ENDPOINT } from "../../domain/constants/api";
import { Bank } from "../../domain/entities/bank.entity";
import axiosClient from "../../shared/config/axios.config";

// GET Bank Details
export const getBankDetailsAPI = async (): Promise<Bank | null> => {
    const { data } = await axiosClient.get(BANK_API_ENDPOINT);
    return data || null;
};

// POST Add Bank Details
export const addBankDetailsAPI = async (bank: Bank): Promise<Bank> => {
    const { data } = await axiosClient.post(BANK_API_ENDPOINT, bank);
    return data;
};

// PATCH Update Bank Details
export const updateBankDetailsAPI = async (bank: Bank): Promise<Bank> => {
    const { data } = await axiosClient.patch(BANK_API_ENDPOINT, bank);
    return data;
};