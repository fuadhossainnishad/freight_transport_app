import { GET_MY_EARNINGS } from "../../domain/constants/api"
import axiosClient from "../../shared/config/axios.config"

export type EarningPaymentMethod = "cash" | "bank" | "online"

export type EarningListItem = {
    earning_id: string
    company_name: string
    amount: number
    payment_method: EarningPaymentMethod
    payment_date: string
}

export type EarningFilter = "weekly" | "monthly" | "yearly"

export const getMyEarnings = async (page = 1, limit = 10, filter?: EarningFilter) => {
    const params: any = { page, limit }
    if (filter) params.filter = filter
    const res = await axiosClient.get(GET_MY_EARNINGS, { params })
    return res.data as {
        success: boolean
        message: string
        meta: { total: number; page: number; limit: number; totalPage: number }
        data: EarningListItem[]
    }
}
