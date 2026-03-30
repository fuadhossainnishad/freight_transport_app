import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

export function DetailCell({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <View style={styles.detailCell}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text
                style={[styles.detailValue, highlight && styles.detailHighlight]}
                numberOfLines={1}
            >
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    imagePlaceholder: {
        width: CARD_WIDTH,
        height: 200,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
    },
    imagePlaceholderText: {
        color: "#9ca3af",
        fontSize: 13,
    },
    dotsRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    dot: {
        height: 7,
        borderRadius: 4,
        marginHorizontal: 2,
    },
    cardTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 2,
    },
    cardCategory: {
        fontSize: 12,
        color: "#6b7280",
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 5,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 11,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#f3f4f6",
        marginHorizontal: 16,
        marginVertical: 12,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 4,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: "#9ca3af",
        letterSpacing: 1,
        marginBottom: 10,
    },
    driverRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 4,
    },
    driverAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#fff7ed",
        justifyContent: "center",
        alignItems: "center",
    },
    driverName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    driverSub: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 1,
    },
    mapFallback: {
        height: 160,
        borderRadius: 12,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderStyle: "dashed",
    },
    mapFallbackText: {
        fontSize: 13,
        color: "#9ca3af",
    },
    addressRow: {
        flexDirection: "row",
        marginTop: 12,
        gap: 8,
    },
    addressItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 6,
    },
    addressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 3,
    },
    addressText: {
        flex: 1,
        fontSize: 12,
        color: "#374151",
        lineHeight: 17,
    },
    addressDividerV: {
        width: 1,
        backgroundColor: "#e5e7eb",
        marginVertical: 2,
    },
    detailsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    detailCell: {
        width: (CARD_WIDTH - 32 - 10) / 2,
        backgroundColor: "#f9fafb",
        borderRadius: 10,
        padding: 12,
    },
    detailLabel: {
        fontSize: 10,
        color: "#9ca3af",
        fontWeight: "600",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 13,
        fontWeight: "600",
        color: "#111827",
    },
    detailHighlight: {
        color: "#f97316",
        fontWeight: "700",
    },
    ctaButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f97316",
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 16,
        paddingVertical: 14,
        borderRadius: 14,
        gap: 8,
    },
    ctaText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 15,
    },
    ctaArrow: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
        marginBottom: 14,
    },
    sectionHeaderTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
    sectionHeaderLink: {
        fontSize: 13,
        fontWeight: "600",
        color: "#000000",
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyText: {
        color: "#9ca3af",
        fontSize: 14,
    },
});