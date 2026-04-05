import { useEffect } from "react";
import { connectSocket } from "../../../data/socket/socketClient";
import { logger } from "../../../shared/utils/logger";

export default function useTransporterSocket() {
  useEffect(() => {
    let socket: Awaited<ReturnType<typeof connectSocket>>;

    const onConnect    = () => logger.info("Socket connected");
    const onDisconnect = () => logger.warn("Socket disconnected");

    const init = async () => {
      socket = await connectSocket();
      socket.on("connect",    onConnect);
      socket.on("disconnect", onDisconnect);
    };

    init();
    return () => {
      socket?.off("connect",    onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.disconnect();
    };
  }, []);
}