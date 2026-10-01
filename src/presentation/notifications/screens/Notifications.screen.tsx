import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../../shared/components/AppHeader';
import { Bell, Package, CheckCircle, Info } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const dummyNotifications = [
    {
        id: '1',
        title: 'Shipment Delivered',
        message: 'Your shipment to Monbassa has been delivered successfully.',
        time: '10 min ago',
        isRead: false,
        type: 'success'
    },
    {
        id: '2',
        title: 'New Bid Received',
        message: 'You have received a new bid of 450 EUR on your shipment "4 container de riz".',
        time: '1 hour ago',
        isRead: false,
        type: 'info'
    },
    {
        id: '3',
        title: 'Shipment Delayed',
        message: 'The shipment "Electronics batch" is currently delayed by 2 hours due to traffic.',
        time: 'Yesterday',
        isRead: true,
        type: 'warning'
    },
    {
        id: '4',
        title: 'Welcome to Lawapan!',
        message: 'Your account has been successfully created and verified. Start booking shipments today!',
        time: '2 days ago',
        isRead: true,
        type: 'info'
    }
];

export default function NotificationsScreen() {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle size={24} color="#22C55E" />;
            case 'warning':
                return <Package size={24} color="#F59E0B" />;
            default:
                return <Info size={24} color="#3B82F6" />;
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity 
            className={`flex-row p-4 border-b border-gray-100 ${!item.isRead ? 'bg-[#EAF2FB]' : 'bg-white'}`}
            activeOpacity={0.7}
        >
            <View className="mr-4 mt-1">
                {getIcon(item.type)}
            </View>
            <View className="flex-1">
                <View className="flex-row justify-between items-start mb-1">
                    <Text className={`text-base font-semibold ${!item.isRead ? 'text-black' : 'text-gray-800'}`}>
                        {item.title}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">{item.time}</Text>
                </View>
                <Text className={`text-sm ${!item.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                    {item.message}
                </Text>
            </View>
            {!item.isRead && (
                <View className="w-2 h-2 rounded-full bg-[#036BB4] mt-2 ml-2" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-white">
            <AppHeader text={t("notifications.title", "Notifications")} onpress={() => navigation.goBack()} />
            
            <FlatList
                data={dummyNotifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center mt-32 px-10">
                        <View className="w-16 h-16 rounded-full bg-[#EAF2FB] items-center justify-center mb-4">
                            <Bell size={30} color="#036BB4" />
                        </View>
                        <Text className="text-gray-500 mt-2 text-base text-center">
                            {t("notifications.empty", "You don't have any notifications yet")}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
