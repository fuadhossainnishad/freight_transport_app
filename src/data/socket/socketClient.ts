import { io, Socket } from "socket.io-client"
import appConfig from "../../shared/config/app.config"
import { getAccessToken } from "../../shared/storage/authStorage"

let socket: Socket | null = null

export const connectSocket = async () => {
    if (socket) return socket;
    const token = await getAccessToken()

    socket = io(appConfig.socket_url, {
        auth: {
            token
        },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000
    })

    return socket
}

export const getSocket = () => socket