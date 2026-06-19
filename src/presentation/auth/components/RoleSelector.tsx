import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";
import { Check } from "lucide-react-native";

export interface RoleSelectorProps {
    role: string;
    selected: boolean
    onRoleChange: (role: string) => void;
    Icon: React.FC<SvgProps>[]
    theme: string
    title?: string
}

const BLUE = "#036BB4";

export default function RoleSelector({ role, selected, onRoleChange, Icon, theme, title }: RoleSelectorProps) {
    const ActiveIcon = Icon[0]
    const InactiveIcon = Icon[1]

    return (
        <TouchableOpacity
            style={[styles.card, selected ? styles.cardSelected : styles.cardDefault]}
            activeOpacity={0.85}
            onPress={() => onRoleChange(role)}
        >
            {/* Persistent selection indicator — empty ring when unselected,
                filled blue check when selected (keeps both cards balanced). */}
            <View style={[styles.badge, selected ? styles.badgeSelected : styles.badgeDefault]}>
                {selected && <Check size={13} color="#fff" strokeWidth={3} />}
            </View>

            <View style={[styles.iconCircle, selected ? styles.iconCircleSelected : styles.iconCircleDefault]}>
                {selected ? <ActiveIcon height={22} width={22} /> : <InactiveIcon height={22} width={22} />}
            </View>

            <Text style={[styles.title, selected && { color: BLUE }]}>
                {title ?? `I'm a ${role}`}
            </Text>
            <Text style={styles.subtitle}>{theme}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        minHeight: 124,
        justifyContent: "flex-start",
    },
    cardDefault: {
        backgroundColor: "#F9FAFB",
        borderColor: "#E5E7EB",
    },
    cardSelected: {
        backgroundColor: "#EFF6FF",
        borderColor: BLUE,
    },
    badge: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeDefault: {
        borderWidth: 1.5,
        borderColor: "#D1D5DB",
        backgroundColor: "transparent",
    },
    badgeSelected: {
        backgroundColor: BLUE,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    iconCircleDefault: {
        backgroundColor: "#E5E7EB",
    },
    iconCircleSelected: {
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: BLUE,
    },
    title: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111827",
    },
    subtitle: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },
});
