export const SOCKET_EVENTS = {

  CONNECT: "connect",
  DISCONNECT: "disconnect",

  JOIN_SHIPMENT_ROOM: "join_shipment_room",
  LEAVE_SHIPMENT_ROOM: "leave_shipment_room",

  NEW_BID: "new_bid",
  BID_ACCEPTED: "bid_accepted",

  SHIPMENT_BIDDING_STARTED: "shipment_bidding_started",

  // Live tracking
  JOIN_TRACKING_ROOM: "tracking:join",
  LEAVE_TRACKING_ROOM: "tracking:leave",
  DRIVER_LOCATION_PUSH: "driver:location_push",
  DRIVER_LOCATION_UPDATE: "driver:location_update",
  SHIPMENT_PROGRESS_UPDATE: "shipment:progress_update",

}