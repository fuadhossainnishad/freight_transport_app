import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    ImageSourcePropType,
    Alert,
} from "react-native";
import AppHeader from "../../components/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UsersStackParamList } from "../../navigation/UsersNavigator";
import { assingRoles } from "../../constants/user.constant";
import FormInputField from "../../components/FormInputField";
import SelectField from "../../components/SelectField";
import RegexUtility from "../../utils/Regex.utility";

type Props = NativeStackNavigationProp<UsersStackParamList, "AddNewUser">;

export interface IUser {
    profile?: ImageSourcePropType;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    assignRole: typeof assingRoles[number];
}

export interface IAddUser extends IUser {
    password?: string;
    confirmPassword?: string;
}

export default function AddNewUserScreen({ data }: { data?: IUser }) {
    const navigation = useNavigation<Props>();
    const isEdit = !!data;
    const [openSelectOption, setOpenSelectOption] = useState(false)

    const [formData, setFormData] = useState<Record<string, string>>({
        fullName: data?.fullName || "",
        email: data?.email || "",
        phoneNumber: data?.phoneNumber || "",
        address: data?.address || "",
        assignRole: data?.assignRole || "",
        password: "",
        confirmPassword: "",
    });

    const [role, setRole] = useState<typeof assingRoles[number] | null>(
        data?.assignRole || null
    );
    const [profile, setProfile] = useState<ImageSourcePropType | undefined>(
        data?.profile
    );

    const handleSave = () => {
        if (!formData.fullName || !formData.email || !role) {
            Alert.alert("Error", "Please fill required fields");
            return;
        }

        if (!isEdit && (!formData.password || !formData.confirmPassword)) {
            Alert.alert("Error", "Password fields are required");
            return;
        }

        if (!isEdit && formData.password !== formData.confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        // Build user object
        const newUser: IAddUser = {
            fullName: formData.fullName || "",
            email: formData.email || "",
            phoneNumber: formData.phoneNumber || "",
            address: formData.address || "",
            assignRole: role!,
            profile,
            ...(!isEdit ? { password: formData.password || "", confirmPassword: formData.confirmPassword || "" } : {})
        };


        console.log("Saved User:", newUser);
        Alert.alert("Success", `${isEdit ? "Updated" : "Added"} user successfully!`);
        navigation.goBack();
    };

    const handleProfileSelect = () => {
        // Integrate react-native-image-picker here later
        // Demo image:
        setProfile({ uri: "https://i.pravatar.cc/150?img=3" });
    };

    // Fields to show
    const inputFields = [
        "fullName",
        "email",
        "phoneNumber",
        "address",
        ...(!isEdit ? ["password", "confirmPassword"] : []),
    ];

    return (
        <View className="flex-1">
            <AppHeader title={isEdit ? "Edit User" : "Add New User"} onBack={() => navigation.goBack()} />

            <ScrollView className="flex-1 p-4 bg-white">
                {/* Profile */}
                <TouchableOpacity onPress={handleProfileSelect} className="mb-4">
                    <Image
                        source={profile ? profile : require('../../assets/images/profile.png')}
                        className="h-20 w-20 rounded-full self-center mb-2"
                    />

                </TouchableOpacity>

                {/* Input Fields */}
                {inputFields.map((key) => (
                    <FormInputField
                        key={key}
                        label={RegexUtility.LabelFormate(key)}
                        placeholder={key === "password" || key === "confirmPassword" ? "Enter password" : ""}
                        secureTextEntry={key === "password" || key === "confirmPassword"}
                        value={formData[key] || ""}
                        onChangeText={(text) =>
                            setFormData((prev) => ({ ...prev, [key]: text }))
                        }
                        containerClass="mb-4"
                        inputClass="border border-gray-300 p-3 rounded-lg"
                        labelClass="text-gray-700 font-semibold mb-1"
                    />
                ))}

                {/* Role Selector */}
                <FormInputField
                    label={RegexUtility.LabelFormate("assignRole")}
                    placeholder="Select role"
                    value={role || ""}
                    onPress={() => setOpenSelectOption(true)}
                    containerClass="mb-4"
                    inputClass="border border-gray-300 p-3 rounded-lg"
                    labelClass="text-gray-700 font-semibold mb-1"
                />
                {openSelectOption &&
                    <SelectField
                        data={assingRoles}
                        value={role}
                        onSelect={(selected) => {
                            setRole(selected);
                            setOpenSelectOption(false)
                        }}
                        container={{ className: "border border-gray-300 rounded-lg p-3 mb-4" }}
                        optiondiv={{ className: "p-2" }}
                        renderOption={(option, selected) => (
                            <View className={`p-2 rounded ${selected ? "bg-blue-500" : ""}`}>
                                <Text className={selected ? "text-white" : "text-gray-700"}>
                                    {option}
                                </Text>
                            </View>
                        )}
                    />
                }
            </ScrollView>

            <TouchableOpacity
                onPress={handleSave}
                className="bg-[#B09050] px-6 py-4 rounded-full m-4 shadow-xl"
            >
                <Text className="text-black text-center text-lg">
                    {isEdit ? "Update User" : "Add New User"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
