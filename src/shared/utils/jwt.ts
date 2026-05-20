import { jwtDecode } from "jwt-decode"

export interface JwtPayload {
    _id: string
    email: string
    role: "TRANSPORTER" | "SHIPPER" | "DRIVER"
    shipper_id: string
    transporter_id: string
    driver_id?: string
    isBlocked: boolean
    isDeleted: boolean
    iat: number
    exp: number
}

export const decodeAccessToken = (token: string): JwtPayload => {
    try {
        return jwtDecode<JwtPayload>(token)
    } catch (error) {
        throw new Error("Invalid access token")
    }
}