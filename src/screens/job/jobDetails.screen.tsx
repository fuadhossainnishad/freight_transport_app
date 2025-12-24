import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

import CopyIcon from '../../assets/icons/copy.svg';
import PhotosIcon from '../../assets/icons/photos.svg';
import VideosIcon from '../../assets/icons/videos.svg';
import PdfIcon from '../../assets/icons/pdf.svg';
import ShareIcon from '../../assets/icons/share.svg';
import DownloadIcon from '../../assets/icons/download.svg';

import { copyData } from '../../utils/CopyData.utils';

export default function JobDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const job: any = route.params;

  const [selectedOption, setSelectedOption] = useState('Documents'); // <-- selected tab

  const options = ['Documents', 'Photos', 'Notes', 'Daily Reports', 'Receipts'];

  // Sample Data
  const documents = [
    { title: 'Contract.pdf', file: 'contract.pdf' },
    { title: 'Invoice.pdf', file: 'invoice.pdf' },
  ];

  const photos = [
    { title: 'Before.jpg', uri: 'https://via.placeholder.com/120' },
    { title: 'After.jpg', uri: 'https://via.placeholder.com/120' },
  ];

  const notes = [
    'Foundation inspection done. Small cracks found.',
    'Client requested material change.',
  ];

  const dailyReports = [
    {
      id: '556865',
      date: '19 Aug 2025',
      creator: 'Emily Johnson',
      materials: '20 Steel Rods, 2 Drill...',
      notes: 'Concrete work completed.',
      photos: 2,
      videos: 1,
    },
  ];

  const receipts = [
    {
      id: '000001',
      date: '19 Aug 2025',
      uploader: 'Emily Johnson',
      amount: '$125.75',
    },
  ];

  // -------------------------------
  // Render content based on selection
  // -------------------------------
  const renderContent = () => {
    switch (selectedOption) {
      case 'Documents':
        return documents.map((doc, i) => (
          <View key={i} className="bg-white p-4 rounded-xl mb-4 shadow">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <PdfIcon width={30} height={30} />
                <Text className="text-base font-medium">{doc.title}</Text>
              </View>
              <TouchableOpacity onPress={() => copyData(doc)}>
                <CopyIcon width={22} height={22} />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-6 mt-4">
              <TouchableOpacity className="flex-row items-center gap-2">
                <DownloadIcon width={24} height={24} />
                <Text>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center gap-2">
                <ShareIcon width={24} height={24} />
                <Text>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ));

      case 'Photos':
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {photos.map((p, i) => (
              <View key={i} className="mr-4 bg-white p-3 rounded-xl shadow">
                <Image
                  source={{ uri: p.uri }}
                  className="h-24 w-24 rounded-lg"
                />
                <Text className="mt-2 text-center">{p.title}</Text>
                <View className="flex-row justify-center gap-4 mt-3">
                  <TouchableOpacity>
                    <DownloadIcon width={24} height={24} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <ShareIcon width={24} height={24} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        );

      case 'Notes':
        return notes.map((text, i) => (
          <View key={i} className="bg-white p-4 rounded-xl mb-3 shadow">
            <Text className="text-base">{text}</Text>
            <TouchableOpacity
              className="mt-3 flex-row items-center gap-2"
              onPress={() => copyData(text)}
            >
              <CopyIcon width={22} height={22} />
              <Text>Copy Text</Text>
            </TouchableOpacity>
          </View>
        ));

      case 'Daily Reports':
        return dailyReports.map((item, i) => (
          <View key={i} className="bg-white p-4 rounded-xl mb-4 shadow">
            <Info label="Report ID" value={item.id} />
            <Info label="Date" value={item.date} />
            <Info label="Creator" value={item.creator} />
            <Info label="Materials" value={item.materials} />
            <Info label="Notes" value={item.notes} />

            <View className="flex-row gap-5 mt-4">
              <View className="flex-row items-center gap-2">
                <PhotosIcon width={26} height={26} />
                <Text className="text-lg font-bold">{item.photos}</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <VideosIcon width={26} height={26} />
                <Text className="text-lg font-bold">{item.videos}</Text>
              </View>
            </View>
          </View>
        ));

      case 'Receipts':
        return receipts.map((item, i) => (
          <View key={i} className="bg-white p-4 rounded-xl mb-4 shadow">
            <Info label="Receipt ID" value={item.id} />
            <Info label="Date" value={item.date} />
            <Info label="Uploaded By" value={item.uploader} />
            <View className="mt-4 bg-green-100 px-4 py-2 rounded-lg flex-row items-center gap-3">
              <Text className="text-gray-700 font-medium">Amount:</Text>
              <Text className="text-xl font-bold text-green-700">
                {item.amount}
              </Text>
            </View>
          </View>
        ));

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-bg_primary">
      {/* HEADER */}
      <View className="bg-white flex-row items-center px-6 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-semibold text-black">
          Job Details
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView className="px-6 mt-4 mb-10">
        {/* JOB INFO */}
        <Section title="Job Info">
          <Info label="Job Name" value={job.jobName} />
          <Info label="Created On" value={job.date} />
          <Info label="Creator" value={job.creator} />
        </Section>

        {/* CUSTOMER INFO */}
        <Section title="Customer Info">
          <Info label="Name" value={job.custName} />
          <Info label="Phone" value={job.phone} />
          <Info label="Email" value={job.email} />
          <Info label="Address" value={job.address} />
        </Section>

        {/* OPTIONS HORIZONTAL SCROLL */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {options.map(opt => (
            <TouchableOpacity
              key={opt}
              onPress={() => setSelectedOption(opt)}
              className={`px-4 py-2 mr-3 rounded-full ${
                selectedOption === opt ? 'bg-[#B09050]' : 'bg-white'
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedOption === opt ? 'text-white' : 'text-black'
                }`}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* RENDER SELECTED CONTENT */}
        {renderContent()}
      </ScrollView>
    </View>
  );
}

// Reusable Components
const Section = ({ title, children }: any) => (
  <View className="mb-6">
    <Text className="text-xl font-semibold mb-3">{title}</Text>
    {children}
  </View>
);

const Info = ({ label, value }: any) => (
  <View className="mb-2">
    <Text className="text-gray-700">{label}:</Text>
    <Text className="font-medium text-base">{value}</Text>
  </View>
);
