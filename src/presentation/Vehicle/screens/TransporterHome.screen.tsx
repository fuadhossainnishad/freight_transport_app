import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useUser } from "../../../app/context/User.context"
import { getShipperStats, getTransporterStats } from "../../../data/services/dashboardService"
import { useAuth } from "../../../app/context/Auth.context"
import { SafeAreaView } from "react-native-safe-area-context"
import HomeHeader from '../../../shared/components/HomeHeader';
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ShipperHomeStackParamList, ShipperTabParamList, TransporterHomeStackParamList } from "../../../navigation/types"
import { useNavigation } from "@react-navigation/native"
import Create from '../../../../assets/icons/create.svg'
import { connectSocket, getSocket } from "../../../data/socket/socketClient";
import StatCard from "../../../shared/components/StatCard";

type props = NativeStackNavigationProp<TransporterHomeStackParamList, 'Home'>;

export default function TransporterHomeScreen() {
  const navigation = useNavigation<props>()
  const { user } = useUser()
  const { user: authUser } = useAuth()

  const [stats, setStats] = useState<any>(null)
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)



  const fetchStats = async () => {
    try {
      console.log("transporter_id:", authUser?.transporter_id!)

      const res = await getTransporterStats(authUser?.transporter_id!)
      setStats(res.data)
    } catch (error) {
      console.log("Stats error:", error)
    }
  }



  useEffect(() => {

    const initSocket = async () => {

      const socket = await connectSocket()

      socket.on("connect", () => {
        console.log("Bid socket connected")
      })

      socket.on("new_bid", (bid) => {
        setBids(prev => [bid, ...prev])
      })

    }

    initSocket()

    return () => {
      getSocket()?.disconnect()
    }

  }, [])


  useEffect(() => {

    if (!authUser?.transporter_id!) return console.log("error on user.id")

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
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <HomeHeader
        onpressLogo={() => navigation.navigate('Home')}
        onpressNotification={() => navigation.navigate('Home')}
      />

      <View className="px-5 mt-4">

        {/* Stats Cards */}
        <View className="gap-4">

          {/* Row 1 */}
          <View className="flex-row gap-4">
            <StatCard
              title="Shipments In Progress"
              value={stats?.shipmentsInProgress ?? 0}
            />

            <StatCard
              title="Completed Shipments"
              value={stats?.completedShipments ?? 0}
            />
          </View>

          {/* Row 2 */}
          <StatCard
            title="Total Earnings"
            value={`€${stats?.totalEarnings ?? 0}`}
            fullWidth
          />

        </View>

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
    </SafeAreaView >
  )
}