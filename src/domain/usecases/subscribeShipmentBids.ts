import {
    leaveShipmentRoom,
    onNewBid,
    offNewBid,
    joinShipmentRoom
} from "../../data/socket/bidSocketService"

export const startShipmentBidSubscription = async (
    shipmentId: string,
    onBid: (bid: any) => void
) => {

    await joinShipmentRoom(shipmentId)

    await onNewBid(onBid)

}

export const stopShipmentBidSubscription = async (
    shipmentId: string
) => {

    await leaveShipmentRoom(shipmentId)

    await offNewBid()

}