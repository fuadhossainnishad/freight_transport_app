import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import SearchIcon from '../../assets/icons/search.svg'; // optional search icon
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../../navigation/HomeNavigator';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackNavigationProp<HomeStackParamList, 'SwitchCompany'>

interface Company {
    id: number;
    logo: any;
    name: string;
    email: string;
    address: string;
}

export default function SwitchCompanyScreen() {
    const navigation = useNavigation<Props>();
    const [searchText, setSearchText] = useState('');

    const companies: Company[] = [
        {
            id: 1,
            logo: require('../../assets/images/cm.png'),
            name: 'Acme Corp',
            email: 'contact@acme.com',
            address: '123 Main Street, NY',
        },
        {
            id: 2,
            logo: require('../../assets/images/cm.png'),
            name: 'Tech Solutions',
            email: 'info@techsolutions.com',
            address: '456 Elm Street, CA',
        },
        {
            id: 2,
            logo: require('../../assets/images/cm.png'),
            name: 'Tech Solutions',
            email: 'info@techsolutions.com',
            address: '456 Elm Street, CA',
        },
    ];

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View className="flex-1 bg-bg_primary">
            {/* Header */}
            <View className="bg-white flex-row items-center px-6 py-4  border-b border-b-[#D8D9E0]">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                <Text className="flex-1 text-center text-2xl font-medium text-black">
                    Switch Company
                </Text>

                <View className="w-8" />
            </View>

            {/* Search Bar */}
            <View className="flex-row items-center bg-white mx-4 mt-4 rounded-xl px-4 p-3">
                <SearchIcon width={20} height={20} style={styles.searchIcon} />
                <TextInput
                    className="flex-1 h-10 text-base text-gray-800 items-center"
                    placeholder="Search company..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Company List */}
            <ScrollView
                className="flex-1 mt-4 mx-4"
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {filteredCompanies.map(company => (
                    <CompanyRow key={company.id} company={company} />
                ))}
            </ScrollView>
        </View>
    );
}

function CompanyRow({ company }: { company: Company }) {
    return (
        <TouchableOpacity className="flex-row items-center bg-white p-3 border-b-[1px] border-bg_primary">
            <Image source={company.logo} className="w-16 h-16 rounded-lg mr-3" resizeMode="contain" />
            <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-lg ">{company.name}</Text>
                <Text className="text-[#62636C] text-base">{company.email}</Text>
                <Text className="text-[#62636C] text-base">{company.address}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    searchIcon: {
        marginRight: 8,
    },
    scroll: { paddingBottom: 24 }
});
