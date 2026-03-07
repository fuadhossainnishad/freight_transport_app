import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { SvgProps } from "react-native-svg";

export interface RoleSelectorProps {
    role: string;
    selected: boolean
    onRoleChange: (role: string) => void;
    Icon: React.FC<SvgProps>[]
    theme: string
}

export default function RoleSelector({ role, selected, onRoleChange, Icon, theme }: RoleSelectorProps) {
    const ActiveIcon = Icon[0]
    const InactiveIcon = Icon[1]
    const Wrapper = (selected ? LinearGradient : View) as React.ElementType;
    return (
        <TouchableOpacity
            className="flex-1 gap-2"
            onPress={() => onRoleChange(role)}
        >
            <Wrapper
                {...(selected
                    ? {
                        colors: ['#E6F0F7', '#E6F0F7', '#036BB4'],
                        start: { y: 0, x: 0, },
                        end: { x: 0, y: 1 },
                    }
                    : {})}
                style={[
                    styles.card,
                    !selected && styles.normalCard,
                ]}
            >
                <View className={` p-4 rounded-full  ${selected ? "border border-[#036BB4] bg-transparent" : "bg-black/10"}`}>
                    {selected ? <ActiveIcon height={24} width={24} /> : <InactiveIcon height={24} width={24} />}
                </View>
                <Text className="text-black w-full font-xs font-semibold mt-2">I’m a {role}</Text>
                <Text className="text-black w-full text-xs">{theme}</Text>
            </Wrapper>
        </TouchableOpacity >
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 10,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4
    },
    normalCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#0000001A'
    },
    title: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});
