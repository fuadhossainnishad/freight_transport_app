import { GET_INVOICES, GET_INVOICE_DETAIL } from "../../domain/constants/api"
import axiosClient from "../../shared/config/axios.config"

export type InvoiceListItem = {
    payment_id: string
    invoice_no: string
    shipment_title: string | null
    transporter: string | null
    amount: number
    issued_on: string
    status: string
}

export const getInvoices = async (page = 1, limit = 10, search?: string) => {
    const params: any = { page, limit }
    if (search) params.search = search
    const res = await axiosClient.get(GET_INVOICES, { params })
    return res.data as {
        success: boolean
        message: string
        meta: { total: number; page: number; limit: number; totalPage: number }
        data: InvoiceListItem[]
    }
}

export type InvoiceDetail = {
    invoice_no: string
    status: string
    invoice_summary: {
        amount: number
        issued_on: string
        due_date: string
        payment_method: string | null
    }
    shipment_info: {
        shipment_id: string | null
        shipment_title: string | null
        pickup_address: string | null
        delivery_address: string | null
        weight: number | null
        category: string | null
        date_of_delivery: string | null
    }
    cost_breakdown: {
        transport_fee: number
        platform_fee: number
        total: number
    }
}

export const getInvoiceDetail = async (paymentId: string) => {
    const res = await axiosClient.get(GET_INVOICE_DETAIL(paymentId))
    return (res.data?.data ?? res.data) as InvoiceDetail
}
