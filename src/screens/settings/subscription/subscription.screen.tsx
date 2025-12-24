'use client';

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AppHeader from '../../../components/AppHeader';

const PLANS = ['Basic Plan', 'Team Plan', 'Business Plan', 'Enterprise'];

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState('Basic Plan');

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader title="Subscription" />

      <ScrollView showsVerticalScrollIndicator={false} className="p-4">
        {/* ===================== TOP ACTIVE SUBSCRIPTION CARD ===================== */}
        <View className="bg-white p-5 rounded-2xl shadow mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-[#B09050]">
                Basic Plan
              </Text>
              <Text className="text-gray-600 mt-1">- 7 days free trial</Text>
            </View>

            <Text className="bg-[#E9FFF4] px-4 py-2 rounded-xl mt-4 self-start text-[#006333] font-medium">
              Active
            </Text>
          </View>
          <Text className="mt-5 text-gray-800 font-semibold">
            Currently You’re Using
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-gray-500">This Plan will expire on</Text>
            <Text className=" font-semibold ">30 Sep 2025</Text>
            <Text className="text-gray-700 ">at</Text>
            <Text className=" font-semibold">11:35 PM</Text>
          </View>
          <UsagePipeline used={2} total={4} />
          <Text className="text-gray-500">
            Upgrade your plan for more users
          </Text>
        </View>

        {/* ===================== PLAN SELECTOR TABS ===================== */}
        <View className="flex-row justify-between mb-6">
          {PLANS.map(plan => (
            <TouchableOpacity
              key={plan}
              onPress={() => setSelectedPlan(plan)}
              className={`px-4 py-3 rounded-2xl shadow
                ${selectedPlan === plan ? 'bg-[#B09050]' : 'bg-white'}
              `}
            >
              <Text
                className={`font-medium 
                  ${selectedPlan === plan ? 'text-black' : 'text-gray-700'}
                `}
              >
                {plan}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ===================== SHORT INFO OF SELECTED PLAN ===================== */}
        <View className="bg-white p-5 rounded-2xl shadow mb-6">
          <Text className="text-2xl font-bold text-[#B09050]">
            {selectedPlan}
          </Text>
          <Text className="text-gray-600 mt-2">
            Get started with the essentials
          </Text>

          <Text className="text-gray-700 mt-4 font-medium">
            You will get access on this plan for
          </Text>

          <Text className="text-[#B09050] font-bold text-lg">1 - 4 Users</Text>
        </View>

        {/* ===================== CHOOSE YOUR PERFECT PLAN ===================== */}
        <Text className="text-xl font-semibold mb-4">
          Choose Your Perfect Plan
        </Text>

        {/* ===================== PRICING CARD ===================== */}
        <View className="bg-white p-5 rounded-2xl shadow mb-20">
          {/* MONTHLY */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold">$55</Text>
              <Text className="text-gray-600 text-base">Monthly</Text>
            </View>

            <Text className="text-gray-500 w-32 text-right">
              Pay as you go, month by month
            </Text>
          </View>

          {/* YEARLY */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold">$550</Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-gray-400 line-through mr-2">$660</Text>
                <Text className="text-green-600 font-semibold">SAVE 17%</Text>
              </View>
              <Text className="text-gray-600 mt-1">Yearly</Text>
            </View>

            <Text className="text-gray-500 w-32 text-right">
              Annual plan for full-year access
            </Text>
          </View>

          {/* SUBSCRIBE BUTTON */}
          <TouchableOpacity className="bg-[#B09050] py-4 rounded-full shadow mt-4">
            <Text className="text-center text-black text-lg font-semibold">
              Subscribe Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const UsagePipeline = ({ used, total }: { used: number; total: number }) => {
  const percentage = (used / total) * 100;

  return (
    <View className="mt-4">
      {/* Label */}
      <Text className="text-gray-700 mb-2 font-medium">
        {used} of {total} users used
      </Text>

      {/* Pipeline container */}
      <View className="h-3 bg-gray-200 rounded-full w-full overflow-hidden">
        {/* Filled progress */}
        <View
          className="h-full bg-[#B09050] rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
};
