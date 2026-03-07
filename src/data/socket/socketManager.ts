import { connectSocket } from "./socketClient"

class SocketManager {

  async emit(event: string, payload?: any) {

    const socket = await connectSocket()

    socket.emit(event, payload)

  }

  async on(event: string, callback: (data:any)=>void) {

    const socket = await connectSocket()

    socket.on(event, callback)

  }

  async off(event: string) {

    const socket = await connectSocket()

    socket.off(event)

  }

}

export const socketManager = new SocketManager()