import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NotificationStackParamList } from "../../navigation/NotificationNavigator";
import { useNavigation } from "@react-navigation/native";

import SoundIcon from "../../assets/icons/sound.svg"
import VibrationIcon from "../../assets/icons/vibration.svg"
import { SvgProps } from "react-native-svg";
import Colors from "../../constants/colors";

interface ISettings {
    label: string;
    description?: string;
    value: boolean;
    onChange: (...args: any[]) => any;
    iconName?: React.FC<SvgProps>
}

interface ISubOptions {
    jobUpdate: boolean;
    dailyReport: boolean;
    punchList: boolean;
    receiptManagement: boolean;
}

interface ISettingsState {
    sound: boolean;
    vibration: boolean;
    pushNotification: boolean;
    subOptions: ISubOptions;
}

// Reusable Toggle with optional icon and description
const SettingToggle = ({ label, description, value, onChange, iconName: IconComponent }: ISettings) => (
    <View style={styles.toggleContainer}>
        {IconComponent && <IconComponent height={24} width={24} style={styles.toggleIcon} />}
        <View style={styles.labelContainer}>
            <Text style={styles.toggleLabel}>{label}</Text>
            {description && <Text style={styles.description}>{description}</Text>}
        </View>
        <Switch value={value} onValueChange={onChange} />
    </View>
);

// Reusable Checkbox Component
const SettingCheckItem = ({ label, value, onChange }: ISettings) => (
    <TouchableOpacity style={styles.checkItem} onPress={() => onChange(!value)}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Icon name={value ? "checkbox" : "square-outline"} size={24} color={Colors.bg_btn} />
    </TouchableOpacity>
);

type Props = NativeStackNavigationProp<NotificationStackParamList, "Settings">

export default function NotificationSettingsScreen() {
    const navigation = useNavigation<Props>()
    const [settings, setSettings] = useState<ISettingsState>({
        sound: true,
        vibration: false,
        pushNotification: true,
        subOptions: {
            jobUpdate: true,
            dailyReport: false,
            punchList: true,
            receiptManagement: false,
        },
    });

    const pushOptions: { key: keyof ISubOptions; label: string }[] = [
        { key: "jobUpdate", label: "Job Update" },
        { key: "dailyReport", label: "Daily Report" },
        { key: "punchList", label: "Punchlist Management" },
        { key: "receiptManagement", label: "Receipt Notification Management" },
    ];

    return (
        <View style={styles.container}>
            <View className="flex-row items-center bg-white px-6 py-4 mb-6 border-b border-b-[#D8D9E0]">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                <Text className="flex-1 text-center text-2xl font-medium text-black">
                    Notification Settings
                </Text>

                <View className="w-8" />
            </View>

            <View style={styles.card} className="mx-4">
                <Text style={styles.cardTitle}>General Settings</Text>
                <SettingToggle
                    label="Notification Sound"
                    description="Play a sound when a new notification arrives"
                    value={settings.sound}
                    onChange={(val) => setSettings({ ...settings, sound: val })}
                    iconName={SoundIcon}
                />
                <SettingToggle
                    label="Vibration Alert"
                    description="Vibrate your device for incoming notifications"
                    value={settings.vibration}
                    onChange={(val) => setSettings({ ...settings, vibration: val })}
                    iconName={VibrationIcon}
                />
            </View>

            {/* Push Notification Settings */}
            <View style={styles.card} className="mx-4">
                <Text style={styles.cardTitle}>Push Notifications</Text>
                <SettingToggle
                    label="Enable Push Notification"
                    value={settings.pushNotification}
                    onChange={(val) => setSettings({ ...settings, pushNotification: val })}
                />
                {settings.pushNotification && (
                    <View style={styles.subContainer}>
                        {pushOptions.map((item) => (
                            <SettingCheckItem
                                key={item.key}
                                label={item.label}
                                value={settings.subOptions[item.key]}
                                onChange={(val) =>
                                    setSettings({
                                        ...settings,
                                        subOptions: {
                                            ...settings.subOptions,
                                            [item.key]: val,
                                        },
                                    })
                                }
                            />
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    toggleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    toggleIcon: {
        marginRight: 12,
    },
    labelContainer: {
        flex: 1,
    },
    toggleLabel: {
        fontSize: 16,
        color: "#333",
    },
    description: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    subContainer: {
        borderLeftWidth: 2,
        borderLeftColor: "#D8D9E0",
        paddingLeft: 12,
        marginTop: 8,
    },
    checkItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
});
