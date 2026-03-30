import React, { useState, useMemo } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View, Text, Modal, TextInput,
    FlatList, TouchableOpacity,
} from "react-native";

const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
    "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
    "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile",
    "China", "Colombia", "Comoros", "Congo", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
    "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
    "Ethiopia", "Fiji", "Finland", "France", "Gabon",
    "Gambia", "Georgia", "Germany", "Ghana", "Greece",
    "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary", "Iceland", "India",
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
    "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
    "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
    "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
    "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
    "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay",
    "Peru", "Philippines", "Poland", "Portugal", "Qatar",
    "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
    "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
    "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan",
    "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
    "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

interface Props {
    visible: boolean;
    selected: string;
    onSelect: (country: string) => void;
    onClose: () => void;
}

export default function CountryPickerModal({ visible, selected, onSelect, onClose }: Props) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() =>
        search.trim()
            ? COUNTRIES.filter((c) => c.toLowerCase().includes(search.toLowerCase()))
            : COUNTRIES,
        [search]
    );

    const handleClose = () => {
        setSearch("");
        onClose();
    };

    const handleSelect = (country: string) => {
        setSearch("");
        onSelect(country);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
        >
            {/* Backdrop */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={handleClose}
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}
            >
                {/* Sheet */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ height: "85%", backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" }}
                >
                    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>

                        {/* Handle */}
                        <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 8 }}>
                            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#e5e7eb" }} />
                        </View>

                        {/* Header */}
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" }}>
                            <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>
                                Select Region
                            </Text>
                            <TouchableOpacity
                                onPress={handleClose}
                                style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center" }}
                            >
                                <Text style={{ fontSize: 13, color: "#6b7280", fontWeight: "600" }}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Search */}
                        <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
                            <TextInput
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Search country..."
                                placeholderTextColor="#9ca3af"
                                autoFocus={false}
                                style={{
                                    backgroundColor: "#f9fafb",
                                    borderWidth: 1,
                                    borderColor: "#e5e7eb",
                                    borderRadius: 12,
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    fontSize: 14,
                                    color: "#111827",
                                }}
                            />
                        </View>

                        {/* List */}
                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => (
                                <View style={{ height: 1, backgroundColor: "#f9fafb", marginHorizontal: 20 }} />
                            )}
                            renderItem={({ item }) => {
                                const isSelected = item === selected;
                                return (
                                    <TouchableOpacity
                                        onPress={() => handleSelect(item)}
                                        activeOpacity={0.6}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            paddingHorizontal: 20,
                                            paddingVertical: 14,
                                            backgroundColor: isSelected ? "#fff7ed" : "#fff",
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 15,
                                            color: isSelected ? "#f97316" : "#111827",
                                            fontWeight: isSelected ? "600" : "400",
                                        }}>
                                            {item}
                                        </Text>
                                        {isSelected && (
                                            <Text style={{ color: "#f97316", fontWeight: "700", fontSize: 16 }}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />

                    </SafeAreaView>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}