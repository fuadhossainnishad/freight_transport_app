import { jwtDecode } from "jwt-decode"

export interface JwtPayload {
    _id: string
    email: string
    role: "TRANSPORTER" | "SHIPPER"
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