import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import CopyIcon from "../../assets/icons/copy.svg";
import PhotoIcon from "../../assets/icons/photos.svg";
import VideoIcon from "../../assets/icons/videos.svg";
import EditIcon from "../../assets/icons/edit.svg";
import DeleteIcon from "../../assets/icons/delete.svg";
import { copyData } from "../../utils/CopyData.utils";
import { PunchStackParamList } from "../../navigation/PunchListNavigator";


type NavProps = NativeStackNavigationProp<
  PunchStackParamList,
  "PunchlistDetails"
>;

export default function PunchlistDetailsScreen() {
  const navigation = useNavigation<NavProps>();
  const route = useRoute();
  const { punchlist } = route.params as any;

  const [items, setItems] = useState([
    {
      id: 1,
      date: "19 Aug 2025, 10:06 PM",
      itemName: "Replace Broken Tile",
      users: ["Emily Johnson", "John Smith"],
      photos: 2,
      videos: 3,
      status: "Pending",
    },
    {
      id: 2,
      date: "19 Aug 2025, 10:06 PM",
      itemName: "Fix Cabinet Door",
      users: ["Emily Johnson"],
      photos: 1,
      videos: 1,
      status: "Completed",
    },
    {
      id: 3,
      date: "19 Aug 2025, 10:06 PM",
      itemName: "Paint Touch-up",
      users: ["John Smith"],
      photos: 1,
      videos: 2,
      status: "Pending",
    },
  ]);

  return (
    <View className="flex-1 bg-bg_primary">
      {/* HEADER */}
      <View className="bg-white flex-row items-center px-6 py-4 border-b border-b-gray-300">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-2xl font-medium text-black">
          Punchlist Details
        </Text>

        <TouchableOpacity onPress={() => copyData(punchlist)}>
          <CopyIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
        {/* PUNCHLIST INFO */}
        <View className="bg-white p-4 rounded-xl mb-5 shadow">
          <Text className="text-gray-600 text-base mb-2">
            {punchlist.date}
          </Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-semibold">Punchlist ID :</Text>
            <Text className="text-lg">{punchlist.punchlistId}</Text>
          </View>

          <View className="flex-row justify-between">
            <View className="bg-[#423526]/10 px-4 py-2 rounded-full">
              <Text className="font-semibold text-gray-800">{punchlist.totalItem} Items</Text>
            </View>
            <View className="bg-[#423526]/10 px-4 py-2 rounded-full">
              <Text className="font-semibold">{punchlist.pending} Pending</Text>
            </View>
            <View className="bg-[#423526]/10 px-4 py-2 rounded-full">
              <Text className="font-semibold">{punchlist.completed} Completed</Text>
            </View>
          </View>
        </View>

        {/* JOB INFO */}
        <View className="bg-white p-4 rounded-xl shadow mb-5">
          <Text className="text-xl font-semibold mb-3">Job info</Text>

          <Text className="text-gray-500 text-sm">Job Name :</Text>
          <Text className="text-lg mb-2">{punchlist.jobName}</Text>

          <Text className="text-gray-500 text-sm">Create Date :</Text>
          <Text className="text-lg mb-2">{punchlist.date}</Text>

          <Text className="text-gray-500 text-sm">Job Creator :</Text>
          <Text className="text-lg">Jessica Lewis</Text>
        </View>

        {/* CUSTOMER INFO */}
        <View className="bg-white p-4 rounded-xl shadow mb-5">
          <Text className="text-xl font-semibold mb-3">Customer info</Text>

          <Text className="text-gray-500 text-sm">Cust. Name :</Text>
          <Text className="text-lg mb-1">Christopher Wright</Text>

          <Text className="text-gray-500 text-sm">Phone :</Text>
          <Text className="text-lg mb-1">1 (555) 232-3232</Text>

          <Text className="text-gray-500 text-sm">Email :</Text>
          <Text className="text-lg mb-1">chris.wright@gmail.com</Text>

          <Text className="text-gray-500 text-sm">Address :</Text>
          <Text className="text-lg">125 Oak Hollow Dr, Dallas, TX 75209</Text>
        </View>

        {/* PUNCHLIST ITEMS */}
        <Text className="text-xl font-semibold mb-3">Punchlist item</Text>

        {items.map((item, index) => (
          <View
            key={index}
            className="bg-white p-4 rounded-xl mb-5 shadow relative"
          >
            <Text className="text-gray-600 text-sm mb-1">{item.date}</Text>

            <Text className="text-lg font-bold mb-2">{item.itemName}</Text>

            {/* USERS */}
            <View className="flex-row items-center mb-2">
              <Text className="font-semibold text-gray-600">Assigned user : </Text>
              <Text className="text-gray-800">{item.users.join(", ")}</Text>
            </View>

            {/* PHOTOS AND VIDEOS */}
            <View className="flex-row items-center gap-4 my-2">
              <View className="flex-row items-center gap-1">
                <PhotoIcon width={20} height={20} />
                <Text>{item.photos}</Text>
              </View>

              <View className="flex-row items-center gap-1">
                <VideoIcon width={20} height={20} />
                <Text>{item.videos}</Text>
              </View>
            </View>

            {/* STATUS */}
            <View className="mt-2 mb-3">
              <Text
                className={`px-4 py-1 rounded-full text-center text-white ${item.status === "Completed"
                  ? "bg-green-600"
                  : "bg-red-500"
                  }`}
              >
                {item.status}
              </Text>
            </View>

            {/* EDIT / DELETE */}
            <View className="flex-row gap-4 mt-3">
              <TouchableOpacity className="flex-row items-center gap-1">
                <EditIcon width={20} height={20} />
                <Text className="text-blue-600">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center gap-1">
                <DeleteIcon width={20} height={20} />
                <Text className="text-red-600">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* EXPORT PDF */}
        <TouchableOpacity className="bg-[#423526] py-3 rounded-full mb-5">
          <Text className="text-center text-white text-lg">Export to PDF</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ADD ITEM BUTTON */}
      <TouchableOpacity
        // onPress={() => navigation.navigate("AddPunchlistItem")}
        className="bg-[#B09050] px-6 py-4 rounded-full shadow-lg mx-6 mb-6"
      >
        <Text className="text-black text-center font-medium text-lg">
          Add Punchlist Item
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
