import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import CopyIcon from '../assets/icons/copy.svg';
import { copyData } from '../utils/CopyData.utils';

export default function Receipts() {
    const receipts = [
        {
            id: '000001',
            date: '19 Aug 2025, 10:06 PM',
            job: 'Smith Residence – Kitchen Remodel',
            phone: '1 (555) 101-2345',
            uploader: 'Emily Johnson',
            amount: '$125.75',
        },
        {
            id: '000001',
            date: '19 Aug 2025, 10:06 PM',
            job: 'Smith Residence – Kitchen Remodel',
            phone: '1 (555) 101-2345',
            uploader: 'Emily Johnson',
            amount: '$125.75',
        },
        {
            id: '000001',
            date: '19 Aug 2025, 10:06 PM',
            job: 'Smith Residence – Kitchen Remodel',
            phone: '1 (555) 101-2345',
            uploader: 'Emily Johnson',
            amount: '$125.75',
        },
    ];

    return (
        <View className="mt-4 mx-4 mb-8">
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-semibold">Recent Receipts</Text>
                <TouchableOpacity>
                    <Text className="text-blue-600 font-medium">See All</Text>
                </TouchableOpacity>
            </View>

            {/* CARDS */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {receipts.map((item, index) => (
                    <View key={index} className="bg-white p-4 rounded-xl mr-4 shadow-md ">
                        {/* DATE */}
                        <View className="flex-row justify-between ">
                            <Text className="text-base text-gray-500 bg-bg_primary p-2 px-4 rounded-full self-start">
                                {item.date}
                            </Text>
                            <TouchableOpacity onPress={() => { copyData(item) }}>
                                <CopyIcon width={26} height={26} />
                            </TouchableOpacity>
                        </View>

                        {/* RECEIPT ID */}
                        <View className="flex-row items-center gap-1 mt-3">
                            <Text className="text-base text-gray-700 font-medium">
                                Receipt ID:
                            </Text>
                            <Text className="text-base font-semibold">{item.id}</Text>
                        </View>

                        {/* JOB NAME */}
                        <View className="flex-row items-center gap-1 mt-3">
                            <Text className="text-base text-gray-700 font-medium">
                                Job Name:
                            </Text>
                            <Text className="text-base font-semibold">{item.job}</Text>
                        </View>

                        {/* PHONE */}
                        <View className="flex-row items-center gap-1 mt-3">
                            <Text className="text-base text-gray-700 font-medium">
                                Phone:
                            </Text>
                            <Text className="text-base font-semibold">{item.phone}</Text>
                        </View>

                        {/* UPLOADED BY */}
                        <View className="flex-row items-center gap-1 mt-3">
                            <Text className="text-base text-gray-700 font-medium">
                                Uploaded by:
                            </Text>
                            <Text className="text-base font-semibold">{item.uploader}</Text>
                        </View>

                        {/* AMOUNT */}
                        <View className="flex-row items-center gap-2 mt-4 bg-green-50 p-3 rounded-lg">
                            <Text className="text-base text-gray-700 font-medium">
                                Amount:
                            </Text>
                            <Text className="text-xl font-bold text-green-700">
                                {item.amount}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     iconImage: {
//         width: 32,
//         height: 32,
//     },
//     quickLinks: {
//         justifyContent: 'space-around',
//         flexDirection: 'row',
//     },
//     reportDate: {
//         alignSelf: 'flex-start',
//     },
// });