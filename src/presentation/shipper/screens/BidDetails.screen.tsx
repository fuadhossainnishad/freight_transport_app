import { useCallback, useEffect, useState } from "react"
import {
    View, Text, ActivityIndicator, TouchableOpacity,
    ScrollView, Image, StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { ShipperHomeStackParamList } from "../../../navigation/types"
import { getShipmentBids, fetchShipmentDetails } from "../../../data/services/shipmentService"
import { normalizeImageUrl } from "../../../shared/utils/normalizeImageUrl"

const BLUE = '#036BB4';

type Nav = NativeStackNavigationProp<ShipperHomeStackParamList, 'BidDetails'>;
type Rt = RouteProp<ShipperHomeStackParamList, 'BidDetails'>;

export default function BidDetails() {
    const navigation = useNavigation<Nav>()
    const { params } = useRoute<Rt>()
    const { shipmentId } = params

    const [shipment, setShipment] = useState<any>(params.shipment ?? null)
    const [bids, setBids] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [activeTab, setActiveTab] = useState<'bids' | 'assigned'>('bids')

    const fetchData = useCallback(async () => {
        try {
            const tasks: Promise<any>[] = [getShipmentBids(shipmentId)]
            if (!params.shipment) tasks.push(fetchShipmentDetails(shipmentId))
            const [bidsRes, shipmentRes] = await Promise.all(tasks)
            setBids(Array.isArray(bidsRes) ? bidsRes : (bidsRes?.data ?? []))
            if (shipmentRes) setShipment(shipmentRes?.data ?? shipmentRes)
        } catch (err) {
            console.log("Bid details error:", err)
        }
    }, [shipmentId, params.shipment])

    useEffect(() => {
        fetchData().then(() => setLoading(false))
    }, [fetchData])

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        await fetchData()
        setRefreshing(false)
    }, [fetchData])

    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                    <Text style={s.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={s.headerTitle}>Bids Details</Text>
                <View style={s.backBtn} />
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={BLUE} />
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[BLUE]} tintColor={BLUE} />
                    }
                >
                    <Text style={s.sectionTitle}>Bids</Text>

                    {/* Shipment card */}
                    <View style={s.card}>
                        {shipment?.shipment_images?.[0] ? (
                            <Image
                                source={{ uri: normalizeImageUrl(shipment.shipment_images[0]) }}
                                style={StyleSheet.absoluteFill}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#334155' }]} />
                        )}
                        <View style={[StyleSheet.absoluteFill, s.cardOverlay]} />

                        <View style={s.badgeRow}>
                            <View style={s.removeBadge}>
                                <Text style={s.badgeText}>Remove</Text>
                            </View>
                            <View style={s.openBadge}>
                                <Text style={s.badgeText}>Open</Text>
                            </View>
                        </View>

                        <View style={s.cardFooter}>
                            <Text style={s.cardTitle} numberOfLines={2}>
                                {shipment?.shipment_title}
                            </Text>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View style={s.tabBar}>
                        <TouchableOpacity
                            style={[s.tab, activeTab === 'bids' && s.tabActive]}
                            onPress={() => setActiveTab('bids')}
                        >
                            <Text style={[s.tabTxt, activeTab === 'bids' && s.tabTxtActive]}>Bids</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[s.tab, activeTab === 'assigned' && s.tabActive]}
                            onPress={() => setActiveTab('assigned')}
                        >
                            <Text style={[s.tabTxt, activeTab === 'assigned' && s.tabTxtActive]}>
                                Assigned transporter
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bids table */}
                    {activeTab === 'bids' && (
                        <View style={s.table}>
                            <View style={s.thead}>
                                <Text style={[s.theadTxt, { flex: 2 }]}>Bidders</Text>
                                <Text style={[s.theadTxt, { textAlign: 'right' }]}>Price</Text>
                            </View>
                            {bids.length === 0 ? (
                                <View style={s.empty}>
                                    <Text style={s.emptyText}>No bids placed yet</Text>
                                </View>
                            ) : (
                                bids.map((bid: any, i: number) => {
                                    const name = bid.transporter?.company_name ?? 'Transporter'
                                    return (
                                        <View key={bid._id ?? i} style={s.bidRow}>
                                            <View style={s.avatar}>
                                                <Text style={s.avatarTxt}>{name[0]?.toUpperCase() ?? 'T'}</Text>
                                            </View>
                                            <Text style={s.bidName} numberOfLines={1}>{name}</Text>
                                            <Text style={s.bidPrice}>
                                                €{(bid.bid_amount ?? 0).toLocaleString()}
                                            </Text>
                                        </View>
                                    )
                                })
                            )}
                        </View>
                    )}

                    {activeTab === 'assigned' && (
                        <View style={[s.table, s.empty]}>
                            <Text style={s.emptyText}>No transporter assigned yet</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

const s = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    backIcon: { fontSize: 30, color: '#111827', lineHeight: 30 },
    headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },

    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 14 },

    /* Card */
    card: {
        width: '100%',
        height: 150,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#334155',
    },
    cardOverlay: { backgroundColor: 'rgba(0,0,0,0.36)' },
    badgeRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 9 },
    removeBadge: { backgroundColor: '#ef4444', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4 },
    openBadge: { backgroundColor: '#22c55e', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4 },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    cardFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10 },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textShadowColor: 'rgba(0,0,0,0.7)',
        textShadowRadius: 4,
        textShadowOffset: { width: 0, height: 1 },
    },

    /* Tabs */
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        borderRadius: 999,
        padding: 4,
        marginTop: 18,
        marginBottom: 14,
    },
    tab: { flex: 1, paddingVertical: 11, borderRadius: 999, alignItems: 'center' },
    tabActive: { backgroundColor: BLUE },
    tabTxt: { fontSize: 13, fontWeight: '600', color: '#64748b' },
    tabTxtActive: { color: '#fff' },

    /* Table */
    table: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        overflow: 'hidden',
    },
    thead: { flexDirection: 'row', backgroundColor: BLUE, paddingVertical: 11, paddingHorizontal: 14 },
    theadTxt: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '700' },
    bidRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        gap: 10,
    },
    avatar: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center',
    },
    avatarTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
    bidName: { flex: 1, fontSize: 13, fontWeight: '600', color: '#374151' },
    bidPrice: { fontSize: 14, fontWeight: '700', color: BLUE },

    empty: { paddingVertical: 28, alignItems: 'center' },
    emptyText: { fontSize: 13, color: '#9ca3af' },
})
