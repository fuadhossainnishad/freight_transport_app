export const SIGNUP = '/auth/sign-up'
export const SIGNIN = '/auth/sign-in'
export const FORGOT_PASSWORD = "/auth/forget-password"
export const VERIFY_OTP = '/auth/verify-otp'
export const RESET_PASSWORD = '/auth/reset-password'

export const COMPLETE_TRANSPORTER_PROFILE = '/transporter/complete-transporter-profile'
export const COMPLETE_SHIPPER_PROFILE = '/shipper/complete-shipper-profile'

export const GET_SHIIPER_PROFILE = (id: string) => `/shipper/${id}`
export const GET_TRANSPORTER_PROFILE = (id: string) => `/transporter/${id}`

export const GET_SHIPPER_STATS = (id: string) => `/stats/shipper/${id}`
export const GET_TRANSPORTER_STATS = (id: string) => `/stats/transporter/${id}`

export const CREATE_SHIPMENTS = "/shipment/"

export type BankRole = "shipper" | "transporter";
export const BANK_DETAILS = (role: BankRole) => `/bank/${role}`;
export const BANK_DETAIL = (role: BankRole, bankId: string) => `/bank/${role}/${bankId}`;

export const GET_SHIPPER_ISSUES = (shipperId: string) => `/issues/shipper/${shipperId}`
export const GET_SHIPMENT_ISSUE = (shipmentId: string) => `/issues/shipment/${shipmentId}`
export const SINGLE_ISSUE = (id: string) => `/issues/${id}`

export const GET_INFO = (type: string) => `/setting/${type}`

export const GET_BIDS = "/bid/"

export const GET_INVOICES = "/pay/invoices"
export const GET_INVOICE_DETAIL = (paymentId: string) => `/pay/invoices/${paymentId}`

export const GET_MY_PAYMENT_REQUESTS = "/pay/my-requests"
export const PAY_NOW = (paymentId: string) => `/pay/pay-now/${paymentId}`

export const GET_VEHICLES = (transporterId: string) => `/vehicle/transporter/${transporterId}`
export const GET_VEHICLE = (vehicleId: string) => `/vehicle/${vehicleId}`
export const POST_VEHICLE = '/vehicle/'
export const UPDATE_VEHICLE = (vehicleId: string) => `/vehicle/${vehicleId}`
export const DELETE_VEHICLE = (vehicleId: string) => `/vehicle/${vehicleId}`

export const GET_DRIVERS = (transporterId: string) => `/driver/transporter/${transporterId}`
export const GET_DRIVER = (driverId: string) => `/driver/${driverId}`
export const POST_DRIVER = '/driver/'
export const UPDATE_DRIVER = (driverId: string) => `/driver/${driverId}`
export const DELETE_DRIVER = (driverId: string) => `/driver/${driverId}`
