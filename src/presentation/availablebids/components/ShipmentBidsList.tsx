import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import { connectSocket } from "../../../data/socket/socketClient";
import { getShipmentBids } from "../../../data/services/shipmentService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AvailableBidsStackParamList } from "../../../navigation/types";
import { useAuth } from "../../../app/context/Auth.context";
import { useUser } from "../../../app/context/User.context";
import { ArrowRight } from "lucide-react-native";

type NavigationPropType = NativeStackNavigationProp<AvailableBidsStackParamList>;

const BLUE = "#036BB4";

/* ── My own bid row ──────────────────────────────────── */
function MyBidRow({ name, logo, amount }: { name: string; logo?: string; amount: number }) {
    return (
        <View style={[row.container, row.myContainer]}>
            <View style={row.avatarWrap}>
                {logo ? (
                    <Image source={{ uri: logo }} style={row.avatar} />
                ) : (
                    <View style={[row.avatar, row.avatarFallback]}>
                        <Text style={row.avatarInitial}>{name[0]?.toUpperCase() ?? "T"}</Text>
                    </View>
                )}
                {/* "You" badge */}
                <View style={row.youBadge}>
                    <Text style={row.youBadgeText}>You</Text>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={row.myName} numberOfLines={1}>{name}</Text>
                <Text style={row.mySubtitle}>Your bid</Text>
            </View>

            <Text style={row.myPrice}>€{amount.toLocaleString()}</Text>
        </View>
    );
}

/* ── Blurred competitor row ──────────────────────────── */
function BlurredRow({ amount }: { amount: number }) {
    return (
        <View style={{ backgroundColor: "#ffffff" }}>
            {/* Row content — rendered behind the blur */}
            <View style={row.container}>
                <View style={[row.avatar, { backgroundColor: "#94a3b8" }]} />
                <View style={{ flex: 1, gap: 3 }}>
                    <Text style={[row.myName, { color: "#374151" }]}>Truck Logistics GmbH</Text>
                    <Text style={[row.mySubtitle, { color: "#6b7280" }]}>Competitor bid</Text>
                </View>
                {/* Width placeholder keeps row height consistent */}
                <View style={{ width: 72 }} />
            </View>

            {/* Real Gaussian blur over the entire row */}
            <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={8}
                reducedTransparencyFallbackColor="rgba(248,250,252,0.92)"
            />

            {/* Price floats above the blur — always readable */}
            <View style={{ position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" }}>
                <Text style={row.blurredPrice}>€{amount.toLocaleString()}</Text>
            </View>
        </View>
    );
}

/* ── Main component ──────────────────────────────────── */
export default function ShipmentBidsList({ shipmentId }: { shipmentId: string }) {
    const navigation = useNavigation<NavigationPropType>();
    const { user: authUser } = useAuth();
    const { user: userProfile } = useUser();

    const myTransporterId = authUser?.transporter_id;
    const myName = userProfile?.transporterProfile?.company_name ?? "You";
    const myLogo = userProfile?.transporterProfile?.logo;

    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const bidCount = useMemo(() => bids.length, [bids]);

    const fetchBids = useCallback(async () => {
        try {
            const data = await getShipmentBids(shipmentId!);
            setBids(data);
        } catch (error) {
            console.log("Fetch bids error:", error);
        } finally {
            setLoading(false);
        }
    }, [shipmentId]);

    useEffect(() => {
        let socket: any;

        const init = async () => {
            socket = await connectSocket();

            socket.emit("join_shipment_room", shipmentId);

            socket.on("new_bid", (bid: any) => {
                setBids((prev) => {
                    const id = bid._id ?? bid.id;
                    if (id && prev.some((b) => (b._id ?? b.id) === id)) return prev;
                    return [bid, ...prev];
                });
            });
        };

        init();
        fetchBids();

        return () => {
            if (socket) {
                socket.emit("leave_shipment_room", shipmentId);
                socket.off("new_bid");
            }
        };
    }, [shipmentId, fetchBids]);

    if (loading) {
        return (
            <View style={{ paddingVertical: 24, alignItems: "center" }}>
                <ActivityIndicator size="large" color={BLUE} />
            </View>
        );
    }

    return (
        <View style={s.root}>
            {/* ── Header ── */}
            <View style={s.headerRow}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={s.bidsLabel}>Bids</Text>
                    <View style={s.countBadge}>
                        <Text style={s.countText}>{bidCount}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate("AssignVehicleDriver", { shipmentId })}
                    style={s.placeBtn}
                    activeOpacity={0.8}
                >
                    <Text style={s.placeBtnText}>Place your bid</Text>
                    <ArrowRight size={15} color="#fff" strokeWidth={2.5} />
                </TouchableOpacity>
            </View>

            {/* ── Table ── */}
            {bids.length === 0 ? (
                <View style={s.empty}>
                    <Text style={s.emptyText}>No bids yet. Be the first!</Text>
                </View>
            ) : (
                <View style={s.table}>
                    {/* Table header */}
                    <View style={s.tableHeader}>
                        <Text style={[s.tableHeaderText, { flex: 2 }]}>Bidders</Text>
                        <Text style={[s.tableHeaderText, { textAlign: "right" }]}>Price</Text>
                    </View>

                    {/* Rows */}
                    {bids.map((item, i) => {
                        const isMe = item.transporter_id === myTransporterId;
                        return isMe ? (
                            <MyBidRow
                                key={item._id ?? i}
                                name={myName}
                                logo={myLogo}
                                amount={item.bid_amount}
                            />
                        ) : (
                            <BlurredRow key={item._id ?? i} amount={item.bid_amount} />
                        );
                    })}
                </View>
            )}

            {/* Privacy note */}
            {bids.length > 0 && (
                <Text style={s.privacyNote}>
                    Other bidders' identities are hidden to keep the auction fair.
                </Text>
            )}
        </View>
    );
}

/* ─── Styles ────────────────────────────────────────── */
const row = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
        gap: 12,
    },
    myContainer: {
        backgroundColor: "#EFF6FF",
        borderRadius: 10,
        borderBottomWidth: 0,
        marginVertical: 2,
    },
    avatarWrap: {
        position: "relative",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    avatarFallback: {
        backgroundColor: BLUE,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarInitial: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    youBadge: {
        position: "absolute",
        bottom: -4,
        right: -4,
        backgroundColor: "#22c55e",
        borderRadius: 6,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderWidth: 1.5,
        borderColor: "#fff",
    },
    youBadgeText: {
        color: "#fff",
        fontSize: 8,
        fontWeight: "800",
        letterSpacing: 0.2,
    },
    myName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },
    mySubtitle: {
        fontSize: 11,
        color: BLUE,
        fontWeight: "600",
        marginTop: 1,
    },
    myPrice: {
        fontSize: 15,
        fontWeight: "800",
        color: BLUE,
    },

    /* blurred competitor row */
    blurredPrice: {
        fontSize: 14,
        fontWeight: "700",
        color: "#6b7280",
    },
});

const s = StyleSheet.create({
    root: { gap: 0 },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    bidsLabel: {
        fontSize: 16,
        fontWeight: "800",
        color: "#111827",
    },
    countBadge: {
        backgroundColor: BLUE,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 24,
        alignItems: "center",
    },
    countText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
    placeBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: BLUE,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 10,
        shadowColor: BLUE,
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
    placeBtnText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },

    table: {
        backgroundColor: "#fff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#f1f5f9",
        overflow: "hidden",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: BLUE,
        paddingVertical: 11,
        paddingHorizontal: 14,
    },
    tableHeaderText: {
        flex: 1,
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },

    empty: {
        paddingVertical: 28,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 14,
        color: "#9ca3af",
        fontWeight: "500",
    },

    privacyNote: {
        fontSize: 11,
        color: "#9ca3af",
        textAlign: "center",
        marginTop: 10,
        lineHeight: 15,
        paddingHorizontal: 8,
    },
});
