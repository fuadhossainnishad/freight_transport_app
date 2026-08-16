import {
    GET_WITHDRAWAL_BALANCE,
    GET_MY_WITHDRAWALS,
    REQUEST_WITHDRAWAL,
} from "../../domain/constants/api"
import axiosClient from "../../shared/config/axios.config"

export type WithdrawalStatus = "pending" | "approved" | "rejected"

export type WithdrawalBalance = {
    total_earned_gross: number
    total_withdrawn: number
    available_balance: number
}

export type WithdrawalPayoutMethod = "online" | "bank" | "cash"

export type WithdrawalListItem = {
    _id: string
    amount: number
    region: string
    payout_method?: WithdrawalPayoutMethod
    account_alias?: string
    account_holder_name?: string
    bank_name?: string
    account_number?: string
    account_holder?: string
    status: WithdrawalStatus
    rejection_reason?: string
    createdAt?: string
}

export type RequestWithdrawalPayload =
    | {
        amount: number
        region: string
        payout_method: "online"
        account_alias: string
        account_holder_name?: string
    }
    | {
        amount: number
        region: string
        payout_method: "bank"
        bank_name: string
        account_number: string
        account_holder: string
        routing_number?: string
        bank_address?: string
    }
    | {
        amount: number
        region: string
        payout_method: "cash"
        account_holder_name?: string
    }

// GET /withdrawal/balance — available balance for the current transporter.
export const getWithdrawalBalance = async (): Promise<WithdrawalBalance> => {
    const res = await axiosClient.get(GET_WITHDRAWAL_BALANCE)
    return res.data?.data ?? res.data
}

// GET /withdrawal/my-requests — this transporter's withdrawal history.
export const getMyWithdrawals = async (page = 1, limit = 10, status?: WithdrawalStatus) => {
    const params: any = { page, limit }
    if (status) params.status = status
    const res = await axiosClient.get(GET_MY_WITHDRAWALS, { params })
    return res.data as {
        success: boolean
        message: string
        meta: { total: number; page: number; limit: number; totalPage: number }
        data: WithdrawalListItem[]
    }
}

// POST /withdrawal/request — submit a payout request against the available
// balance. Supports three payout methods: "online" (PayDunya DirectPay
// mobile money), "bank" (manual off-platform transfer) and "cash" (manual
// off-platform handover) — bank/cash never touch PayDunya.
export const requestWithdrawal = async (
    payload: RequestWithdrawalPayload,
): Promise<WithdrawalListItem> => {
    const res = await axiosClient.post(REQUEST_WITHDRAWAL, payload)
    return res.data?.data ?? res.data
}
