import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { copyData } from "../utils/CopyData.utils";

import PhotosIcon from '../assets/icons/photos.svg';
import VideosIcon from '../assets/icons/videos.svg';
import CopyIcon from '../assets/icons/copy.svg';

export default function Reports() {
    const reports = [
        {
            id: '556865',
            date: '19 Aug 2025, 10:06 PM',
            job: 'Smith Residence – Kitchen Remodel',
            phone: '1 (555) 101-2345',
            materials: '20 Steel Rods, 2 Drill...',
            notes: 'Foundation inspection done, found cra...',
            creator: 'Emily Johnson',
            photos: 2,
            videos: 3,
        },
        {
            id: '556866',
            date: '19 Aug 2025, 10:06 PM',
            job: 'Smith Residence – Kitchen Remodel',
            phone: '1 (555) 101-2345',
            materials: '20 Steel Rods, 2 Drill...',
            notes: 'Foundation inspection done, found cra...',
            creator: 'Emily Johnson',
            photos: 2,
            videos: 3,
        },
        {
            id: '556867',
            date: '19 Aug 2025, 10:06 PM',
            job: 'Smith Residence – Kitchen Remodel',
            phone: '1 (555) 101-2345',
            materials: '20 Steel Rods, 2 Drill...',
            notes: 'Foundation inspection done, found cra...',
            creator: 'Emily Johnson',
            photos: 2,
            videos: 3,
        },
    ];

    return (
        <View className="m-4 mb-8">
            {/* HEADER */}
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-semibold">Recent Reports</Text>
                <TouchableOpacity >
                    <Text className="text-blue-600 font-medium">See All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
            >
                {reports.map((item, index) => (
                    <View key={index} className="bg-white p-4 rounded-xl mr-4 shadow-md ">
                        <View className="flex-row justify-between ">
                            <Text
                                className="text-base text-gray-500 bg-bg_primary p-2 px-4 rounded-full"
                                style={styles.reportDate}
                            >
                                {item.date}
                            </Text>
                            <TouchableOpacity onPress={() => { copyData(item) }}>
                                <CopyIcon width={26} height={26} />
                            </TouchableOpacity>
                        </View>

                        <View className=" text-base  mt-3 flex-row items-center gap-1">
                            <Text className="text-base text-gray-700 font-medium">
                                Report ID:
                            </Text>
                            <Text className="text-base font-semibold">{item.id}</Text>
                        </View>

                        <View className=" text-base  mt-3 flex-row items-center gap-1">
                            <Text className=" text-gray-700 font-medium">Job Name:</Text>
                            <Text className="text-base font-semibold">{item.job}</Text>
                        </View>

                        <View className=" text-base  mt-3 flex-row items-center gap-1">
                            <Text className=" text-gray-700 font-medium">Phone:</Text>
                            <Text className="text-base font-semibold">{item.phone}</Text>
                        </View>

                        <View className=" text-base  mt-3 flex-row items-center gap-1">
                            <Text className=" text-gray-700 font-medium">
                                Material/Tools Needed:
                            </Text>
                            <Text className="font-semibold">{item.materials}</Text>
                        </View>

                        <View className=" text-base  mt-3 flex-row items-center gap-1">
                            <Text className=" text-gray-700 font-medium">Notes:</Text>
                            <Text className=" font-semibold">{item.notes}</Text>
                        </View>

                        <View className="text-base  mt-3 flex-row items-center gap-1">
                            <Text className=" text-gray-700 font-medium">
                                Report Creator:
                            </Text>
                            <Text className="font-semibold">{item.creator}</Text>
                        </View>

                        <View className="flex-row gap-4 mt-4">
                            <View className="items-center flex-row gap-2">
                                <PhotosIcon height={30} width={30} />
                                <Text className="text-xl font-bold">{item.photos}</Text>
                                <Text className="text-sm text-gray-500">Photos</Text>
                            </View>

                            <View className="items-center flex-row gap-2">
                                <VideosIcon height={30} width={30} />
                                <Text className="text-xl font-bold">{item.videos}</Text>
                                <Text className="text-sm text-gray-500">Videos</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    reportDate: {
        alignSelf: 'flex-start',
    },
});