import { io, Socket } from "socket.io-client"
import appConfig from "../../shared/config/app.config"
import { getAccessToken } from "../../shared/storage/authStorage"

let socket: Socket | null = null

export const connectBidSocket = async () => {

    const token = await getAccessToken()

    socket = io(appConfig.socket_url, {
        auth: {
            token
        },
        transports: ["websocket"]
    })

    return socket
}

export const getBidSocket = () => socket