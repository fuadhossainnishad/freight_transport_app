import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Lock, LogOut } from 'lucide-react-native';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={{ width: 40 }} /> 
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.lockButton} activeOpacity={0.7}>
          <Lock size={20} color="#666" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Profile Detail</Text>

        <View style={styles.infoCard}>
          <Text style={styles.label}>User Name</Text>
          <Text style={styles.value}>Sunan Rahman</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>Demo@gmail.com</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Contact no</Text>
          <Text style={styles.value}>+99007007007</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
          <LogOut size={20} color="#FF3B30" strokeWidth={2} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  lockButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#444',
    marginBottom: 20,
  },
  infoCard: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FFF0F0', // Very light red/pink background
    flexDirection: 'row',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF3B30', // Action red
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});

export default ProfileScreen;