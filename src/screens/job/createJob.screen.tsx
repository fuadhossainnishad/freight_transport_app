import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import UploadIcon from '../../assets/icons/upload.svg';
import { pick, types } from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobStackParamList } from '../../navigation/JobNavigator';
import RNFS from 'react-native-fs';
import { Input } from '../../components/Input';

type Props = NativeStackNavigationProp<JobStackParamList, 'CreateJob'>;

export default function CreateJobScreen() {
  const navigation = useNavigation<Props>();

  const [jobName, setJobName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<any[]>([]);

  // 📌 PICK MULTIPLE FILES (Images + PDF)

  const pickFiles = async () => {
    try {
      const result = await pick({
        type: [types.images, types.pdf],
        multiple: true,
      });

      const fixedResults = await Promise.all(
        result.map(async file => {
          console.log('Final image URI:', file.uri);

          if (file.uri.startsWith('content://')) {
            const newPath = `${RNFS.TemporaryDirectoryPath}/${file.name}`;
            await RNFS.copyFile(file.uri, newPath);
            return { ...file, uri: `file://${newPath}` };
          }
          return file;
        }),
      );

      setFiles(prev => [...prev, ...fixedResults]);
    } catch (err: any) {
      if (err?.code === 'DOCUMENT_PICKER_CANCELED') return;
      console.log('File Pick Error:', err);
    }
  };

  return (
    <View className="flex-1 bg-bg_primary">
      {/* HEADER */}
      <View className="bg-white flex-row items-center px-6 py-4 mb-6 border-b border-[#D8D9E0]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-2xl font-medium text-black">
          Create New Job
        </Text>

        <View className="w-8" />
      </View>

      <ScrollView
        className="px-6"
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View className="gap-y-4">
          <View className="bg-white p-4 rounded-lg">
            <Input
              label="Job Name"
              placeholder="Write job name"
              value={jobName}
              onChange={setJobName}
            />
            <Input
              label="Customer Name"
              placeholder="Write customer name"
              value={customerName}
              onChange={setCustomerName}
            />
            <Input
              label="Phone Number"
              placeholder="Write phone number"
              value={phone}
              onChange={setPhone}
            />
            <Input
              label="Email Address"
              placeholder="Write email address"
              value={email}
              onChange={setEmail}
            />
            <Input
              label="Address"
              placeholder="Write address"
              value={address}
              onChange={setAddress}
            />
          </View>

          {/* FILE UPLOAD SECTION */}
          <View className="bg-white p-4 rounded-lg gap-2">
            <Text className="text-base font-semibold">* Photos & PDFs</Text>
            {files.length === 0 && (
              <View>
                <TouchableOpacity
                  onPress={pickFiles}
                  className="gap-3 border border-[#C8B89A] p-4 py-6 rounded-lg items-center"
                >
                  <UploadIcon height={60} width={60} />
                  <Text className="text-sm text-gray-600 mb-2">
                    You can select multiple files to upload
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {/* SHOW SELECTED FILES */}
            {files.length > 0 && (
              <View className="mb-4">
                {/* <Text className="text-base font-semibold mb-2">
                  Selected Files
                </Text> */}

                {files.map((file, index) => {
                  const isImage = file.mimeType?.startsWith('image/');
                  const isPdf = file.mimeType === 'application/pdf';

                  return (
                    <View key={index} className="rounded-lg p-3 my-2">
                      {/* PREVIEW */}
                      {isImage && (
                        <Image
                          source={{ uri: file.uri }}
                          className="w-full h-32 rounded-lg mb-2"
                          resizeMode="cover"
                        />
                      )}

                      {isPdf && (
                        <View className="w-full h-32 rounded-lg bg-red-200 mb-2 items-center justify-center">
                          <Icon
                            name="document-text-outline"
                            size={40}
                            color="red"
                          />
                          <Text className="mt-1 font-semibold text-red-600">
                            PDF File
                          </Text>
                        </View>
                      )}

                      {/* DETAILS + DELETE BUTTON */}
                      <View className="flex-row justify-between items-center mt-1">
                        <View className="flex-row gap-1">
                          <Text className="font-medium text-gray-800">
                            Title :
                          </Text>
                          <Text className="font-medium text-gray-800">
                            {file.name}
                          </Text>
                          {/* <Text className="text-xs text-gray-500">
                            {file.mimeType}
                          </Text> */}
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            setFiles(files.filter((_, i) => i !== index))
                          }
                        >
                          <Icon name="trash" size={22} color="red" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          {/* NOTES */}
          <View className="bg-white p-4 rounded-lg">
            <Text className="text-base font-semibold ">Notes</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base mt-2"
              placeholder="Write necessary notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
        {/* SUBMIT BUTTON */}
        {files.length > 0 && (
          <TouchableOpacity
            onPress={pickFiles}
            className="py-4 rounded-full border mt-8"
          >
            <Text className="text-center text-black font-semibold text-lg">
              + Add More Files
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="bg-[#B09050] py-4 rounded-full mt-4 mb-10"
          // onPress={() => navigation.navigate('CreateJob')}
        >
          <Text className="text-center text-white font-semibold text-lg">
            Submit Now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {},
});
