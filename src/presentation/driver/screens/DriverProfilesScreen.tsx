import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Lock, LogOut, UserCircle, FileText } from 'lucide-react-native';
import { useAuth } from '../../../app/context/Auth.context';
import LanguageSwitcher from '../../../shared/components/LanguageSwitcher';
import useDriver from '../hooks/useDriver';
import PreviewModal from '../components/PreviewModal';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { data: driver, status, error, refresh } = useDriver(user?.driver_id);
  const [showLicense, setShowLicense] = useState(false);

  const loading = status === 'loading';
  const licenseImage = driver?.licenseBack || driver?.licenseFront;

  const handleLogout = () => {
    Alert.alert(t('driver.profile.logOut'), t('driver.profile.logoutMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('driver.profile.logOut'),
        style: 'destructive',
        // Setting the user to null flips RootNavigation back to the
        // AuthStack, which lands on the Sign In screen.
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={{ width: 44 }} />
        <Text style={styles.headerTitle}>{t('driver.profile.title')}</Text>
        <TouchableOpacity style={styles.lockButton} activeOpacity={0.7}>
          <Lock size={20} color="#666" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>{t('driver.profile.sectionTitle')}</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0071BC"
            style={styles.loader}
          />
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {error || t('driver.profile.loadFailed')}
            </Text>
            <TouchableOpacity onPress={refresh} activeOpacity={0.8}>
              <Text style={styles.retryText}>{t('driver.profile.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.avatarWrapper}>
              {driver?.avatar ? (
                <Image source={{ uri: driver.avatar }} style={styles.avatar} />
              ) : (
                <UserCircle size={88} color="#C7C7CC" strokeWidth={1} />
              )}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.label}>{t('driver.profile.nameLabel')}</Text>
              <Text style={styles.value}>{driver?.name || '—'}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.label}>{t('driver.profile.emailLabel')}</Text>
              <Text style={styles.value}>{driver?.email || '—'}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.label}>{t('driver.profile.phoneLabel')}</Text>
              <Text style={styles.value}>{driver?.phone || '—'}</Text>
            </View>

            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={licenseImage ? 0.7 : 1}
              disabled={!licenseImage}
              onPress={() => licenseImage && setShowLicense(true)}
            >
              <Text style={styles.label}>{t('driver.details.drivingLicense')}</Text>
              {licenseImage ? (
                <View style={styles.licenseRow}>
                  <FileText size={20} color="#036BB4" strokeWidth={1.8} />
                  <Text style={styles.licenseText}>{t('driver.details.viewDocument')}</Text>
                </View>
              ) : (
                <Text style={styles.value}>—</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* Drivers have no Settings tab (DriverStack has no SettingsStack), so
            this is their only way to switch language. Kept outside the
            loading/error branch above: a driver whose profile fails to load must
            still be able to change it. */}
        <View style={styles.languageSection}>
          <LanguageSwitcher />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FF3B30" strokeWidth={2} />
          <Text style={styles.logoutText}>{t('driver.profile.logOut')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {licenseImage && (
        <PreviewModal
          imageUrl={licenseImage}
          show={showLicense}
          setShow={setShowLicense}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
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
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#444',
    marginBottom: 12,
  },
  loader: {
    marginTop: 40,
    marginBottom: 20,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F0F0F0',
  },
  licenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  licenseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#036BB4',
  },
  errorBox: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  retryText: {
    marginTop: 8,
    color: '#0071BC',
    fontSize: 14,
    fontWeight: '600',
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
  languageSection: {
    // The card above already carries marginBottom: 16; the logout button below
    // carries marginTop: 20. Nothing extra needed.
    marginTop: 0,
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
