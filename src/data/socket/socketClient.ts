import { io, Socket } from "socket.io-client";
import appConfig from "../../shared/config/app.config";
import { getAccessToken } from "../../shared/storage/authStorage";

let socket: Socket | null = null;
let isConnecting = false;
let connectingPromise: Promise<Socket> | null = null;

export const connectSocket = async (): Promise<Socket> => {
    if (socket && socket.connected) {
        return socket;
    }

    // If already connecting, wait for the same promise instead of polling
    if (isConnecting && connectingPromise) {
        return connectingPromise;
    }

    // Destroy stale disconnected socket before creating a new one
    if (socket && !socket.connected) {
        socket.disconnect();
        socket = null;
    }

    isConnecting = true;

    connectingPromise = new Promise(async (resolve, reject) => {
        const token = await getAccessToken();

        socket = io(appConfig.socket_url, {
            auth: { token },
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 20,
            reconnectionDelay: 3000,
            reconnectionDelayMax: 10000,
        });

        const onConnect = () => {
            isConnecting = false;
            connectingPromise = null;
            resolve(socket!);
        };

        const onConnectError = (err: Error) => {
            isConnecting = false;
            connectingPromise = null;
            // Still resolve so callers don't hang — socket can retry via reconnection
            resolve(socket!);
        };

        socket.once("connect", onConnect);
        socket.once("connect_error", onConnectError);

        socket.on("disconnect", () => {
            // noop — reconnection is handled automatically by socket.io
        });
    });

    return connectingPromise;
};

export const getSocket = (): Socket | null => socket;
export const isSocketConnected = (): boolean => socket?.connected ?? false;
