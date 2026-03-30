import { useEffect } from "react"
import { startShipmentBidSubscription, stopShipmentBidSubscription } from "../../../domain/usecases/subscribeShipmentBids"


export const useShipmentBids = (
    shipmentId: string,
    onBid: (bid: any) => void
) => {

    useEffect(() => {

        startShipmentBidSubscription(
            shipmentId,
            onBid
        )

        return () => {

            stopShipmentBidSubscription(
                shipmentId
            )

        }

    }, [shipmentId, onBid])

}