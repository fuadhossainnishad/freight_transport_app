// @ts-ignore
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import axiosClient from '../config/axios.config';

export async function requestUserPermission() {
    try {
        const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        // console.log('Authorization status:', authStatus);
        return true;
    }
    return false;
    } catch (e) {
        return false;
    }
}

export async function getFCMToken() {
    try {
        if (!messaging || typeof messaging !== 'function') return null;
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        // console.log('FCM Token:', token);
        return token;
    } catch (error) {
        // console.log('Error getting FCM token:', error);
        return null;
    }
}

export async function sendTokenToBackend(token: string) {
    try {
        // Assume backend has an endpoint /user/fcm-token or similar.
        // We might need to adjust this endpoint URL later based on the actual backend implementation.
        await axiosClient.patch('/user/fcm-token', { fcmToken: token });
        // console.log('Token successfully sent to backend');
    } catch (error) {
        // console.log('Error sending token to backend:', error);
    }
}
