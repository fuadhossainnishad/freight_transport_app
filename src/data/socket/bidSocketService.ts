import { socketManager } from "./socketManager"
import { SOCKET_EVENTS } from "../../domain/constants/socketEvents"

export const joinShipmentRoom = async (shipmentId: string) => {

  await socketManager.emit(
    SOCKET_EVENTS.JOIN_SHIPMENT_ROOM,
    shipmentId
  )

}

export const leaveShipmentRoom = async (shipmentId: string) => {

  await socketManager.emit(
    SOCKET_EVENTS.LEAVE_SHIPMENT_ROOM,
    shipmentId
  )

}

export const onNewBid = async (callback:(bid:any)=>void) => {

  await socketManager.on(
    SOCKET_EVENTS.NEW_BID,
    callback
  )

}

export const offNewBid = async () => {

  await socketManager.off(
    SOCKET_EVENTS.NEW_BID
  )

}