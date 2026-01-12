import { StyleSheet, Text, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

export interface RoleSelectorProps {
    role: string;
    theme: string
    selected: boolean
    onRoleChange: (role: string) => void;
}

export default function RoleSelector({ role, theme, selected, onRoleChange }: RoleSelectorProps) {
    const Wrapper = (selected ? LinearGradient : View) as React.ElementType;
    return (
        <View className="">
            <Wrapper
                {...(selected
                    ? {
                        colors: ['#ff7e5f', '#feb47b'],
                        start: { x: 0, y: 0 },
                        end: { x: 1, y: 1 },
                    }
                    : {})}
                style={[
                    styles.card,
                    !selected && styles.normalCard,
                ]}
            >
                <Text>{theme}</Text>
            </Wrapper>
        </View >
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
