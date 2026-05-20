import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
// If you don't have Lucide, you can use any icon library or a simple Text "←"
import { ArrowLeft } from 'lucide-react-native'; 
import { formatCurrency } from '../helper/format-price.helper';

const ShipmentDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  
  const { shipment } = route.params;
  console.log("From Shipment Details: ", shipment);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipment Detail</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* STATUS BADGE */}
        <View style={styles.badgeContainer}>
          <View style={styles.pendingBadge}>
            <View style={styles.whiteDot} />
            <Text style={styles.badgeText}>Pending</Text>
          </View>
        </View>

        {/* SHIPMENT IMAGE */}
        <Image 
          source={{ uri: shipment.imageUrl }} 
          style={styles.mainImage} 
        />

        {/* SECTION: BASIC INFORMATION */}
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.gridBox}>
          <View style={styles.gridRow}>
            <View style={[styles.gridCell, styles.borderRight]}>
              <Text style={styles.label}>Shipment title</Text>
              <Text style={styles.value}>{shipment.title}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>{shipment.commodity}</Text>
            </View>
          </View>
          
          <View style={[styles.gridCellFull, styles.borderTop]}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{shipment.description}</Text>
          </View>

          <View style={[styles.gridRow, styles.borderTop]}>
            <View style={[styles.gridCell, styles.borderRight]}>
              <Text style={styles.label}>Weight</Text>
              <Text style={styles.value}>{shipment.weight}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={[styles.label, { color: '#FF3B30' }]}>Dimensions (L/W/H) (kg)</Text>
              <Text style={[styles.value, { color: '#FF3B30' }]}>{shipment.dimensions}</Text>
            </View>
          </View>

          <View style={[styles.gridCellFull, styles.borderTop]}>
            <Text style={styles.label}>Type of packaging</Text>
            <Text style={styles.value}>{shipment.packaging}</Text>
          </View>
        </View>

        {/* SECTION: PICKUP & DELIVERY DETAILS */}
        <Text style={styles.sectionTitle}>Pickup & Delivery Details</Text>
        <View style={styles.gridBox}>
          <View style={styles.gridRow}>
            <View style={[styles.gridCell, styles.borderRight]}>
              <Text style={styles.label}>Pickup Address</Text>
              <Text style={styles.value}>{shipment.pickupAddress}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.label}>Time Window</Text>
              <Text style={styles.value}>{shipment.timeWindow}</Text>
            </View>
          </View>
          <View style={[styles.gridRow, styles.borderTop]}>
            <View style={[styles.gridCell, styles.borderRight]}>
              <Text style={styles.label}>Delivery Address</Text>
              <Text style={styles.value}>{shipment.deliveryAddress}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.label}>Contact Person</Text>
              <Text style={styles.value}>{shipment.contactPerson}</Text>
            </View>
          </View>
          <View style={[styles.gridCellFull, styles.borderTop]}>
            <Text style={styles.label}>Date Preference</Text>
            <Text style={styles.value}>Flexible within 2 days</Text>
          </View>
        </View>

        {/* SECTION: AMOUNT */}
        <Text style={styles.sectionTitle}>Amount</Text>
        <View style={styles.amountBox}>
          <Text style={styles.label}>Price</Text>
          <Text style={styles.priceValue}>{formatCurrency(200000)}</Text>
        </View>

        {/* START SHIPMENT BUTTON */}
       <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.8}
        onPress={() => (navigation as any).navigate('LiveTracking', { shipment })}
      >
        <Text style={styles.buttonText}>Start Shipment</Text>
      </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  backButton: {
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  badgeContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  pendingBadge: {
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  whiteDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    marginRight: 6,
  },
  badgeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 12,
    color: '#000',
  },
  gridBox: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    padding: 12,
  },
  gridCellFull: {
    width: '100%',
    padding: 12,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  label: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  amountBox: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#0071BC',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ShipmentDetailScreen;