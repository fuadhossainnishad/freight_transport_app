import { io, Socket } from "socket.io-client";
import appConfig from "../../shared/config/app.config";
import { getAccessToken } from "../../shared/storage/authStorage";

let socket: Socket | null = null;
let isConnecting = false;

export const connectSocket = async (): Promise<Socket> => {
    if (socket && socket.connected) {
        return socket;
    }

    if (isConnecting) {
        // wait until connection is established
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (socket && socket.connected) {
                    clearInterval(interval);
                    resolve(socket);
                }
            }, 100);
        });
    }

    isConnecting = true;

    const token = await getAccessToken();

    socket = io(appConfig.socket_url, {
        auth: { token },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1500,
    });

    socket.on("connect", () => {
        console.log("✅ Socket connected:", socket?.id);
        isConnecting = false;
    });

    socket.on("disconnect", (reason) => {
        console.log("⚠️ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
        console.log("❌ Socket error:", err.message);
        isConnecting = false;
    });

    return socket;
};

export const getSocket = (): Socket | null => socket;