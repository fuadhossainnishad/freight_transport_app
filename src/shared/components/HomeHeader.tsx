import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Notification from '../../../assets/icons/notification.svg'
import Logo from '../../../assets/icons/logo.svg'


type Props = {
    onpressLogo: () => void
    onpressNotification: () => void
}

export default function HomeHeader({
    onpressLogo,
    onpressNotification
}: Props) {
    return (
        <View className="items-center flex-row justify-between w-full px-5 border-b-[1px] border-b-black/10">

            <TouchableOpacity onPress={onpressLogo}>
                <Logo height={70} width={70} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onpressNotification}>
                <Notification height={30} width={30} />
            </TouchableOpacity>

        </View>
    );
}