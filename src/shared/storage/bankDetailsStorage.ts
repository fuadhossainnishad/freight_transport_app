import AsyncStorage from "@react-native-async-storage/async-storage"
import { BankDetails } from "../../domain/entities/paymentRequest.entity"

// POST /pay/pay-now returns the company's receiving account exactly once, and
// only for the shipper who chose "bank". The request then becomes bank_pending,
// which isPayable() excludes, so the sheet that showed them can never be
// reopened to ask again.
//
// It is unconfirmed whether /pay/my-requests echoes bank_details back on the
// record. Persisting them here means it does not matter: the shipper keeps the
// account number across app restarts either way, and the mapped field is used
// in preference to this cache whenever the backend does send it.
const KEY = "bankDetailsByPayment"

type BankDetailsMap = Record<string, BankDetails>

/** Never throws — a storage failure must not break the payment screen. */
export const loadBankDetails = async (): Promise<BankDetailsMap> => {
    try {
        const raw = await AsyncStorage.getItem(KEY)
        if (!raw) return {}
        const parsed = JSON.parse(raw)
        return parsed && typeof parsed === "object" ? (parsed as BankDetailsMap) : {}
    } catch {
        return {}
    }
}

/** Never throws — the in-memory copy still works for this session. */
export const saveBankDetails = async (map: BankDetailsMap): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEY, JSON.stringify(map))
    } catch {
        // ignored on purpose
    }
}

/** Called on logout: these belong to the account that was signed in. */
export const clearBankDetails = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(KEY)
    } catch {
        // ignored on purpose
    }
}

export const BANK_DETAILS_STORAGE_KEY = KEY
