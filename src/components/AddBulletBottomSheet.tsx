import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import UserSelectSheet from "./UserSelectSheet";


export default function AddBulletBottomSheet({ onClose }: any) {
    const [itemName, setItemName] = useState("");
    const [desc, setDesc] = useState("");
    const [files, setFiles] = useState<any[]>([]);
    const [openUserSheet, setOpenUserSheet] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    return (
        <Modal visible animationType="slide" transparent>
            <View className="flex-1 justify-end bg-black/40">
                <View className="bg-white rounded-t-2xl p-6 max-h-[90%]">
                    {/* HEADER */}
                    <View className="flex-row justify-between items-center">
                        <Text className="text-xl font-semibold">Add Bullet Item</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={26} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* ITEM NAME */}
                        <Text className="mt-4 font-medium">Bullet Item Name</Text>
                        <TextInput
                            placeholder="Write bullet item name"
                            value={itemName}
                            onChangeText={setItemName}
                            className="border p-3 rounded-lg mt-1"
                        />

                        {/* DESCRIPTION */}
                        <Text className="mt-4 font-medium">Description</Text>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            placeholder="Write item description"
                            value={desc}
                            onChangeText={setDesc}
                            className="border p-3 rounded-lg mt-1"
                        />

                        {/* FILES */}
                        <Text className="mt-4 font-medium">* Photos & Videos</Text>
                        <TouchableOpacity
                            className="bg-gray-100 p-3 rounded-lg mt-2"
                            onPress={() => {
                                const newFile = {
                                    id: Date.now(),
                                    name: "NewFile.jpg",
                                    uri: "https://via.placeholder.com/80",
                                };
                                setFiles([...files, newFile]);
                            }}
                        >
                            <Text>Select files</Text>
                        </TouchableOpacity>

                        {files.map((file) => (
                            <View
                                key={file.id}
                                className="flex-row justify-between items-center mt-2"
                            >
                                <View>
                                    <Text className="text-gray-700">Title :</Text>
                                    <Text className="font-medium">{file.name}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() =>
                                        setFiles(files.filter((f) => f.id !== file.id))
                                    }
                                >
                                    <Text className="text-red-500">Remove</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        {/* USER SELECT */}
                        <Text className="mt-6 font-medium">Assign User</Text>
                        <TouchableOpacity
                            onPress={() => setOpenUserSheet(true)}
                            className="border p-3 rounded-lg mt-1"
                        >
                            {selectedUsers.length === 0 ? (
                                <Text className="text-gray-500">Select user</Text>
                            ) : (
                                <Text>{selectedUsers.join(", ")}</Text>
                            )}
                        </TouchableOpacity>

                        {/* SUBMIT BUTTON */}
                        <TouchableOpacity className="bg-[#B09050] p-4 rounded-full mt-6">
                            <Text className="text-center text-black font-medium text-lg">
                                Submit Now
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* USER SHEET */}
                {openUserSheet && (
                    <UserSelectSheet
                        selected={selectedUsers}
                        setSelected={setSelectedUsers}
                        onClose={() => setOpenUserSheet(false)}
                    />
                )}
            </View>
        </Modal>
    );
}
