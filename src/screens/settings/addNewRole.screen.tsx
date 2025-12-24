'use client';

import React, { useState } from 'react';
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigation/SettingsNavigator';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';

// Permission Categories
const PERMISSIONS = {
  jobManagement: [
    'pendingJobList',
    'completedJobList',
    'createJob',
    'editJob',
    'deleteJob',
    'viewJobDetails',
  ],

  dailyReport: ['dailyReportList', 'createDailyReport', 'viewReportDetails'],

  punchlist: [
    'punchlist',
    'createPunchlist',
    'deletePunchlist',
    'exportPDF',
    'viewPunchlistDetails',
    'addBulletItem',
    'editBulletItem',
    'deleteBulletItem',
    'viewBulletItemDetails',
    'changeStatus',
  ],

  receipts: ['receiptList', 'uploadReceipt', 'viewReceiptDetails'],

  userManagement: [
    'userList',
    'addNewUser',
    'editUser',
    'activateDeactivateUser',
    'deleteUser',
    'viewUserDetails',
  ],

  rolePermission: [
    'roleList',
    'addNewRole',
    'editRole',
    'deleteRole',
    'viewRoleDetails',
  ],

  companyProfile: [
    'viewCompanyProfile',
    'editProfileInfo',
    'changeCompanyLogo',
  ],

  appColor: ['viewColorList', 'changeAppColor'],
};

// Permission Labels
const LABELS: Record<string, string> = {
  pendingJobList: 'Pending Job List',
  completedJobList: 'Completed Job List',
  createJob: 'Create Job',
  editJob: 'Edit Job',
  deleteJob: 'Delete Job',
  viewJobDetails: 'View Job Details',

  dailyReportList: 'Daily Report List',
  createDailyReport: 'Create Daily Report',
  viewReportDetails: 'View Report Details',

  punchlist: 'Punchlist',
  createPunchlist: 'Create Punchlist',
  deletePunchlist: 'Delete Punchlist',
  exportPDF: 'Export PDF',
  viewPunchlistDetails: 'View Punchlist Details',
  addBulletItem: 'Add Bullet Item',
  editBulletItem: 'Edit Bullet Item',
  deleteBulletItem: 'Delete Bullet Item',
  viewBulletItemDetails: 'View Bullet Item Details',
  changeStatus: 'Change Status',

  receiptList: 'Receipt List',
  uploadReceipt: 'Upload Receipt',
  viewReceiptDetails: 'View Receipt Details',

  userList: 'User List',
  addNewUser: 'Add New User',
  editUser: 'Edit User',
  activateDeactivateUser: 'Activate/Deactivate User',
  deleteUser: 'Delete User',
  viewUserDetails: 'View User Details',

  roleList: 'Role List',
  addNewRole: 'Add New Role',
  editRole: 'Edit Role',
  deleteRole: 'Delete Role',
  viewRoleDetails: 'View Role Details',

  viewCompanyProfile: 'View Company Profile',
  editProfileInfo: 'Edit Profile Info',
  changeCompanyLogo: 'Change Company Logo',

  viewColorList: 'View Color List',
  changeAppColor: 'Change App Color',
};

type Props = NativeStackNavigationProp<SettingsStackParamList, 'AddNewRole'>;

export default function AddNewRoleScreen() {
  const navigation = useNavigation<Props>();
  const [roleName, setRoleName] = useState('');

  // All permissions state
  const [perms, setPerms] = useState(
    Object.keys(LABELS).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
  );

  const togglePermission = (key: string) => {
    setPerms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCategory = (category: string, value: boolean) => {
    const updated = { ...perms };
    PERMISSIONS[category].forEach(key => (updated[key] = value));
    setPerms(updated);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader title="Add New Role" onBack={() => navigation.goBack()} />

      <ScrollView className="p-4">
        {/* Role Name */}
        <Text className="text-lg font-semibold mb-2">Role Name</Text>
        <TextInput
          placeholder="Write Role Name"
          value={roleName}
          onChangeText={setRoleName}
          className="bg-white p-4 rounded-xl mb-6 border border-gray-300"
        />

        {/* Loop categories */}
        {Object.entries(PERMISSIONS).map(([category, items]) => (
          <View key={category} className="bg-white p-4 rounded-xl mb-6 shadow">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold capitalize">
                {category.replace(/([A-Z])/g, ' $1')}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  toggleCategory(
                    category,
                    !items.every(key => perms[key] === true),
                  )
                }
              >
                <Text className="text-[#006333] bg-[#E9FFF4] p-4 py-2 rounded-xl font-medium">
                  {items.every(key => perms[key] === true)
                    ? 'Disable All'
                    : 'Enable All'}
                </Text>
              </TouchableOpacity>
            </View>

            {items.map(key => (
              <View
                key={key}
                className="flex-row justify-between items-center py-2"
              >
                <Text>{LABELS[key]}</Text>
                <Switch
                  trackColor={{ false: '#62636C', true: '#B09050' }}
                  value={perms[key]}
                  onValueChange={() => togglePermission(key)}
                />
              </View>
            ))}
          </View>
        ))}

        {/* Save */}
        <TouchableOpacity
          onPress={() => console.log('New role saved:', roleName, perms)}
          className="bg-[#B09050] py-4 rounded-full shadow-lg mb-10"
        >
          <Text className="text-center text-black text-lg">Add New Role</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
