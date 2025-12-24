import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NotificationSettingsScreen from '../screens/home/NotificationSettings.screen';
import NotificationScreen from '../screens/home/Notification.screen';

export type NotificationStackParamList = {
    Notifications: undefined
    Settings: undefined;
};

export default function NotificationNavigator() {
    const Stack = createNativeStackNavigator<NotificationStackParamList>();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Notifications"
                component={NotificationScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Settings"
                component={NotificationSettingsScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
