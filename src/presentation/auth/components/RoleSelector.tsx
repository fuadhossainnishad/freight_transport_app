import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

export interface RoleSelectorProps {
    role: string;
    title: string
    selected: boolean
    onRoleChange: (role: string) => void;
}

export default function RoleSelector({ role, title, selected, onRoleChange }: RoleSelectorProps) {

    const Wrapper = (selected ? LinearGradient : View) as React.ElementType;
    return (
        <TouchableOpacity
            className=""
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
                
                <Text className="text-black h-20">{title}</Text>
            </Wrapper>
        </TouchableOpacity >
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 18,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    normalCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    title: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});
