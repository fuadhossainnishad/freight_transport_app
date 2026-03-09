import { addBankDetailsAPI, getBankDetailsAPI, updateBankDetailsAPI } from "../../data/services/bankService";
import { Bank } from "../entities/bank.entity";

export const getBankDetails = async (): Promise<Bank | null> => {
    try {
        const response = await getBankDetailsAPI();
        return response || null; // if no bank, return null
    } catch (error) {
        console.error("Error fetching bank details:", error);
        return null;
    }
};

export const addBankDetails = async (bank: Bank): Promise<Bank> => {
    try {
        const response = await addBankDetailsAPI(bank);
        return response;
    } catch (error) {
        throw new Error("Failed to add bank details");
    }
};

export const updateBankDetails = async (bank: Bank): Promise<Bank> => {
    try {
        const response = await updateBankDetailsAPI(bank);
        return response;
    } catch (error) {
        throw new Error("Failed to update bank details");
    }
};