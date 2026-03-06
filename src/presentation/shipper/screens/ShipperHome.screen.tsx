import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator, FlatList } from "react-native"
import { useUser } from "../../../app/context/User.context"
import { getShipperStats } from "../../../data/services/dashboardService"
import { connectBidSocket, getBidSocket } from "../../../data/socket/bidSocket"
import { useAuth } from "../../../app/context/Auth.context"

export default function ShipperHome() {

  const { user } = useUser()
  const { user: authUser } = useAuth()

  const [stats, setStats] = useState<any>(null)
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  /* ============================= */
  /* 🔥 FETCH DASHBOARD STATS */
  /* ============================= */

  const fetchStats = async () => {
    try {
      console.log("shipperId:", authUser?.id!)

      const res = await getShipperStats(authUser?.id!)
      setStats(res.data)
    } catch (error) {
      console.log("Stats error:", error)
    }
  }

  /* ============================= */
  /* 🔥 SOCKET FOR BIDS */
  /* ============================= */

  useEffect(() => {

    const initSocket = async () => {

      const socket = await connectBidSocket()

      socket.on("connect", () => {
        console.log("Bid socket connected")
      })

      socket.on("new_bid", (bid) => {
        setBids(prev => [bid, ...prev])
      })

    }

    initSocket()

    return () => {
      getBidSocket()?.disconnect()
    }

  }, [])

  /* ============================= */

  useEffect(() => {

    if (!authUser?.shipper_id!) return console.log("error on user.id")

    const load = async () => {
      await fetchStats()
      setLoading(false)
    }

    load()

  }, [user?.id!])

  if (loading) {
    return <ActivityIndicator size="large" />
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>

      {/* ================= STATS ================= */}

      <Text>Shipments In Progress: {stats?.shipmentsInProgress}</Text>
      <Text>Completed: {stats?.completedShipments}</Text>
      <Text>Total Spent: €{stats?.totalMoneySpent}</Text>

      {/* ================= BIDS ================= */}

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>
        Live Bids
      </Text>

      <FlatList
        data={bids}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, marginVertical: 5 }}>
            <Text>{item.transporterName}</Text>
            <Text>€{item.price}</Text>
          </View>
        )}
      />

    </View>
  )
}