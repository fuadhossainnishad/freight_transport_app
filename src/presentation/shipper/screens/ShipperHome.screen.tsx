import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import {
    View, Text, ActivityIndicator, TouchableOpacity,
    ScrollView, Image, StyleSheet, Dimensions,
    NativeScrollEvent, NativeSyntheticEvent, RefreshControl,
} from 'react-native';
import { useUser } from "../../../app/context/User.context"
import { getShipperStats } from "../../../data/services/dashboardService"
import { useAuth } from "../../../app/context/Auth.context"
import { SafeAreaView } from "react-native-safe-area-context"
import HomeHeader from '../../../shared/components/HomeHeader';
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ShipperHomeStackParamList } from "../../../navigation/types"
import { useNavigation } from "@react-navigation/native"
import Create from '../../../../assets/icons/create.svg'
import { connectSocket } from "../../../data/socket/socketClient";
import StatCard from "../../../shared/components/StatCard";
import { getShipmentBids } from "../../../data/services/shipmentService";
import { getShipmentsUseCase } from "../../../domain/usecases/shipment.usecase";
import { normalizeImageUrl } from "../../../shared/utils/normalizeImageUrl";
import { useTranslation } from "react-i18next";
import { PackageSearch } from "lucide-react-native";

const BLUE = '#036BB4';
const { width } = Dimensions.get('window');
const CARD_W = width * 0.56;
const CARD_H_ACTIVE = 158;
const CARD_H_INACTIVE = 126;
const GAP = 12;
const ITEM_SIZE = CARD_W + GAP;   // uniform snap interval
const CLONE_COUNT = 2;

type Props = NativeStackNavigationProp<ShipperHomeStackParamList, 'Home'>;

export default function ShipperHome() {
    const { t } = useTranslation()
    const navigation = useNavigation<Props>()
    const { user } = useUser()
    const { user: authUser } = useAuth()

    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [bidShipments, setBidShipments] = useState<any[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [shipmentBids, setShipmentBids] = useState<any[]>([])
    const [bidsLoading, setBidsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'bids' | 'assigned'>('bids')

    const carouselRef = useRef<ScrollView>(null)
    const isJumping = useRef(false)

    // ── Infinite loop list (head + real + tail clones) ──────────────
    const loopItems = useMemo(() => {
        if (bidShipments.length === 0) return []
        if (bidShipments.length === 1) return bidShipments
        return [
            ...bidShipments.slice(-CLONE_COUNT),
            ...bidShipments,
            ...bidShipments.slice(0, CLONE_COUNT),
        ]
    }, [bidShipments])

    // ── Data fetchers ────────────────────────────────────────────────
    const fetchStats = useCallback(async () => {
        try {
            const res = await getShipperStats(authUser?.shipper_id!)
            setStats(res.data)
        } catch (err) {
            console.log("Stats error:", err)
        }
    }, [authUser?.shipper_id])

    const fetchBidShipments = useCallback(async () => {
        try {
            // Only the shipper's OWN shipments that are currently open for
            // bidding — not the global available-bids feed (that's transporter-side).
            const { shipments } = await getShipmentsUseCase("shipper", authUser?.shipper_id!)
            const bidding = (shipments ?? []).filter((s: any) => s.status === "BIDDING")
            setBidShipments(bidding)
            if (bidding.length > 0) setSelectedId(bidding[0].id)
        } catch (err) {
            console.log("Bid shipments error:", err)
        }
    }, [authUser?.shipper_id])

    const fetchShipmentBids = useCallback(async (id: string) => {
        setBidsLoading(true)
        try {
            const res = await getShipmentBids(id)
            setShipmentBids(Array.isArray(res) ? res : (res?.data ?? []))
        } catch (err) {
            console.log("Shipment bids error:", err)
        } finally {
            setBidsLoading(false)
        }
    }, [])

    // ── Pull-to-refresh ──────────────────────────────────────────────
    const onRefresh = useCallback(async () => {
        if (!authUser?.shipper_id) return
        setRefreshing(true)
        try {
            await Promise.all([fetchStats(), fetchBidShipments()])
            if (selectedId) await fetchShipmentBids(selectedId)
        } finally {
            setRefreshing(false)
        }
    }, [authUser?.shipper_id, fetchStats, fetchBidShipments, fetchShipmentBids, selectedId])

    // ── Snap handler — detect clone zone and silently jump ──────────
    const onCarouselSnap = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            if (isJumping.current) return
            const offsetX = e.nativeEvent.contentOffset.x
            const totalReal = bidShipments.length
            if (totalReal === 0) return

            const rawIndex = Math.round(offsetX / ITEM_SIZE)
            const realIdx = ((rawIndex - CLONE_COUNT) % totalReal + totalReal) % totalReal
            setSelectedId(bidShipments[realIdx].id)

            if (rawIndex < CLONE_COUNT) {
                isJumping.current = true
                carouselRef.current?.scrollTo({
                    x: (rawIndex + totalReal) * ITEM_SIZE,
                    animated: false,
                })
                setTimeout(() => { isJumping.current = false }, 60)
            } else if (rawIndex >= CLONE_COUNT + totalReal) {
                isJumping.current = true
                carouselRef.current?.scrollTo({
                    x: (rawIndex - totalReal) * ITEM_SIZE,
                    animated: false,
                })
                setTimeout(() => { isJumping.current = false }, 60)
            }
        },
        [bidShipments],
    )

    // ── Scroll to real first item once loop list is ready ───────────
    useEffect(() => {
        if (loopItems.length === 0 || bidShipments.length <= 1) return
        const timer = setTimeout(() => {
            carouselRef.current?.scrollTo({ x: CLONE_COUNT * ITEM_SIZE, animated: false })
        }, 60)
        return () => clearTimeout(timer)
    }, [loopItems.length])

    // ── Socket: live bid updates ─────────────────────────────────────
    useEffect(() => {
        let socket: any
        const init = async () => {
            socket = await connectSocket()
            socket.on("new_bid", (bid: any) => {
                setShipmentBids(prev => {
                    const id = bid._id ?? bid.id
                    if (id && prev.some((b: any) => (b._id ?? b.id) === id)) return prev
                    if (bid.shipment_id !== selectedId) return prev
                    return [bid, ...prev]
                })
            })
        }
        init()
        return () => { socket?.off?.("new_bid") }
    }, [selectedId])

    // ── Initial load ─────────────────────────────────────────────────
    useEffect(() => {
        if (!authUser?.shipper_id) return
        Promise.all([fetchStats(), fetchBidShipments()]).then(() => setLoading(false))
    }, [user?.id])

    // ── Fetch bids when selected card changes ────────────────────────
    useEffect(() => {
        if (selectedId) fetchShipmentBids(selectedId)
    }, [selectedId])

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color={BLUE} />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <HomeHeader
                onpressLogo={() => navigation.navigate('Home')}
                onpressNotification={() => navigation.navigate('Home')}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[BLUE]}
                        tintColor={BLUE}
                    />
                }
            >

                {/* ── Stats & Create ── */}
                <View className="px-4 pt-4 gap-3">
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            className="border border-[#036BB4] rounded-xl flex-col items-center p-4 gap-2 bg-white"
                            onPress={() => navigation.navigate('CreateShipment')}
                        >
                            <Create height={30} width={30} />
                            <Text className="text-[#7A7A7A] text-base font-bold text-center">
                                {t('shipper.home.createShipment')}
                            </Text>
                        </TouchableOpacity>
                        <StatCard title={t('shipper.home.shipmentsInProgress')} value={stats?.shipmentsInProgress ?? 0} />
                    </View>
                    <View className="flex-row gap-3">
                        <StatCard title={t('shipper.home.completedShipments')} value={stats?.completedShipments ?? 0} />
                        {/* NOTE: hardcoded € and locale-less toLocaleString — part of the
                            app-wide currency inconsistency flagged in CLAUDE.md. */}
                        <StatCard title={t('shipper.home.totalMoneySpent')} value={`€${(stats?.totalMoneySpent ?? 0).toLocaleString()}`} />
                    </View>
                </View>

                {/* ── Live Bids ── */}
                <View style={s.section}>
                    <View style={s.sectionHeader}>
                        <Text style={s.sectionTitle}>{t('shipper.home.liveBids')}</Text>
                        {bidShipments.length > 3 && (
                            <TouchableOpacity onPress={() => navigation.navigate('Bids')}>
                                <Text style={s.seeAll}>{t('shipper.home.seeAll')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {bidShipments.length === 0 ? (
                        <View style={s.emptyCard}>
                            <View style={s.emptyIconWrap}>
                                <PackageSearch size={28} color={BLUE} />
                            </View>
                            <Text style={s.emptyTitle}>{t('shipper.home.noBidsTitle')}</Text>
                            <Text style={s.emptySub}>
                                {t('shipper.home.noBidsSubtitle')}
                            </Text>
                            <TouchableOpacity
                                style={s.emptyCta}
                                activeOpacity={0.85}
                                onPress={() => navigation.navigate('CreateShipment')}
                            >
                                <Text style={s.emptyCtaText}>{t('shipper.home.createShipment')}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <ScrollView
                            ref={carouselRef}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={ITEM_SIZE}
                            decelerationRate="fast"
                            disableIntervalMomentum
                            onMomentumScrollEnd={onCarouselSnap}
                            onScrollEndDrag={onCarouselSnap}
                            // bottom-align so taller active card rises upward, shorter cards stay flush
                            contentContainerStyle={{
                                paddingLeft: 16,
                                paddingRight: 16,
                                paddingVertical: 8,
                                alignItems: 'flex-end',
                            }}
                        >
                            {loopItems.map((item, i) => {
                                const isActive = item.id === selectedId
                                const cardH = isActive ? CARD_H_ACTIVE : CARD_H_INACTIVE
                                return (
                                    <TouchableOpacity
                                        key={`${item.id}-${i}`}
                                        activeOpacity={0.88}
                                        onPress={() => setSelectedId(item.id)}
                                        style={[
                                            s.card,
                                            {
                                                height: cardH,
                                                marginRight: i < loopItems.length - 1 ? GAP : 0,
                                                opacity: isActive ? 1 : 0.55,
                                            },
                                        ]}
                                    >
                                        {item.images?.[0] ? (
                                            <Image
                                                source={{ uri: normalizeImageUrl(item.images[0]) }}
                                                style={StyleSheet.absoluteFill}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#334155' }]} />
                                        )}
                                        <View style={[StyleSheet.absoluteFill, s.cardOverlay]} />

                                        {/* Badges — only on active card */}
                                        {isActive && (
                                            <View style={s.badgeRow}>
                                                <View style={s.removeBadge}>
                                                    <Text style={s.badgeText}>Remove</Text>
                                                </View>
                                                <View style={s.openBadge}>
                                                    <Text style={s.badgeText}>Open</Text>
                                                </View>
                                            </View>
                                        )}

                                        {/* Title always shown */}
                                        <View style={s.cardFooter}>
                                            <Text style={s.cardTitle} numberOfLines={2}>
                                                {item.title}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    )}
                </View>

                {/* ── Bid detail section ── */}
                {selectedId && (
                    <View style={s.detailWrap}>
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

                        {activeTab === 'bids' && (
                            <View style={s.table}>
                                <View style={s.thead}>
                                    <Text style={[s.theadTxt, { flex: 2 }]}>Bidders</Text>
                                    <Text style={[s.theadTxt, { textAlign: 'right' }]}>Price</Text>
                                </View>
                                {bidsLoading ? (
                                    <ActivityIndicator color={BLUE} style={{ paddingVertical: 24 }} />
                                ) : shipmentBids.length === 0 ? (
                                    <View style={s.empty}>
                                        <Text style={s.emptyText}>No bids placed yet</Text>
                                    </View>
                                ) : (
                                    shipmentBids.map((bid: any, i: number) => {
                                        const name = bid.transporter?.company_name ?? 'Transporter'
                                        return (
                                            <View key={bid._id ?? i} style={s.bidRow}>
                                                <View style={s.avatar}>
                                                    <Text style={s.avatarTxt}>
                                                        {name[0]?.toUpperCase() ?? 'T'}
                                                    </Text>
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
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    )
}

const s = StyleSheet.create({
    section: { marginTop: 24 },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
    seeAll: { fontSize: 13, color: BLUE, fontWeight: '600', textDecorationLine: 'underline' },

    /* Cards */
    card: {
        width: CARD_W,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#334155',
    },
    cardOverlay: { backgroundColor: 'rgba(0,0,0,0.36)' },

    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 9,
    },
    removeBadge: {
        backgroundColor: '#ef4444',
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 4,
    },
    openBadge: {
        backgroundColor: '#22c55e',
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 4,
    },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

    cardFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        textShadowColor: 'rgba(0,0,0,0.7)',
        textShadowRadius: 4,
        textShadowOffset: { width: 0, height: 1 },
    },

    /* Detail */
    detailWrap: { marginTop: 18, paddingHorizontal: 16 },

    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        borderRadius: 999,
        padding: 4,
        marginBottom: 14,
    },
    tab: {
        flex: 1,
        paddingVertical: 11,
        borderRadius: 999,
        alignItems: 'center',
    },
    tabActive: { backgroundColor: BLUE },
    tabTxt: { fontSize: 13, fontWeight: '600', color: '#64748b' },
    tabTxtActive: { color: '#fff' },

    table: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        overflow: 'hidden',
    },
    thead: {
        flexDirection: 'row',
        backgroundColor: BLUE,
        paddingVertical: 11,
        paddingHorizontal: 14,
    },
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
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: BLUE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
    bidName: { flex: 1, fontSize: 13, fontWeight: '600', color: '#374151' },
    bidPrice: { fontSize: 14, fontWeight: '700', color: BLUE },

    empty: { paddingVertical: 28, alignItems: 'center' },
    emptyText: { fontSize: 13, color: '#9ca3af' },

    // Live Bids empty state
    emptyCard: {
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EEF2F6',
        paddingVertical: 28,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
    },
    emptyIconWrap: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
    emptySub: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 19,
        maxWidth: 280,
    },
    emptyCta: {
        marginTop: 18,
        backgroundColor: BLUE,
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 999,
    },
    emptyCtaText: { color: '#fff', fontWeight: '700', fontSize: 14 },
})
