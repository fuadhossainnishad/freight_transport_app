import { useCallback, useEffect, useState } from "react"
import {
    View, Text, ActivityIndicator, TouchableOpacity,
    FlatList, Image, StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "@react-navigation/native"
import { ShipperHomeStackParamList } from "../../../navigation/types"
import { getAvailableBids } from "../../../data/services/bidService"

const BLUE = '#036BB4';

type Props = NativeStackNavigationProp<ShipperHomeStackParamList, 'Bids'>;

export default function ShipperBids() {
    const navigation = useNavigation<Props>()

    const [bids, setBids] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchBids = useCallback(async () => {
        try {
            const res = await getAvailableBids(undefined, 1, 100)
            setBids(res.data ?? [])
        } catch (err) {
            console.log("Bids error:", err)
        }
    }, [])

    useEffect(() => {
        fetchBids().then(() => setLoading(false))
    }, [fetchBids])

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        await fetchBids()
        setRefreshing(false)
    }, [fetchBids])

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={s.card}
            onPress={() => navigation.navigate('BidDetails', { shipmentId: item._id, shipment: item })}
        >
            {item.shipment_images?.[0] ? (
                <Image
                    source={{ uri: item.shipment_images[0] }}
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
                    {item.shipment_title}
                </Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                    <Text style={s.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={s.headerTitle}>Bids</Text>
                <View style={s.backBtn} />
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={BLUE} />
                </View>
            ) : (
                <FlatList
                    data={bids}
                    keyExtractor={(item, i) => item._id ?? String(i)}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                    ListHeaderComponent={<Text style={s.sectionTitle}>Bids</Text>}
                    ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[BLUE]} tintColor={BLUE} />
                    }
                    ListEmptyComponent={
                        <View style={s.empty}>
                            <Text style={s.emptyText}>No active bids right now</Text>
                        </View>
                    }
                />
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

    card: {
        width: '100%',
        height: 150,
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
        fontSize: 14,
        fontWeight: '700',
        textShadowColor: 'rgba(0,0,0,0.7)',
        textShadowRadius: 4,
        textShadowOffset: { width: 0, height: 1 },
    },

    empty: { paddingVertical: 48, alignItems: 'center' },
    emptyText: { fontSize: 13, color: '#9ca3af' },
})
