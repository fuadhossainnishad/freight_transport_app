import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import { Shipment } from '../types';
import { formatPriceRange } from '../helper/format-price.helper';

interface Props {
  shipment: Shipment;
  onPress: () => void;
}

export const ShipmentCard = ({ shipment, onPress }: Props) => {

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9} 
      onPress={onPress}
    >
      {/* Top Image Section */}
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{ uri: shipment.imageUrl || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800" }}
          style={styles.image}
        >
          {/* Text Overlay inside Image */}
          <View style={styles.overlay}>
            <Text style={styles.imageTitle}>{shipment.title}</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Bottom Information Section */}
      <View style={styles.infoSection}>
        {/* Route Row */}
        <View style={styles.routeRow}>
          {/* Custom Route Icon Mockup */}
          <View style={styles.routeIconGroup}>
             <View style={styles.dotFilled} />
             <View style={styles.line} />
             <View style={styles.dotOutline} />
          </View>
          <Text style={styles.routeText}>
            {shipment.pickupAddress} → {shipment.deliveryAddress}
          </Text>
        </View>

        {/* Price Row */}
        <Text style={styles.priceText}>
          {formatPriceRange(shipment.priceMin, shipment.priceMax)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    // Professional Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageContainer: {
    height: 180,
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Subtle dark tint to make white text pop
  },
  imageTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  infoSection: {
    backgroundColor: '#E9F3F9', // Light blue tint from your design
    padding: 16,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeIconGroup: {
    width: 20,
    alignItems: 'center',
    marginRight: 8,
  },
  dotFilled: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  line: {
    width: 1,
    height: 8,
    backgroundColor: '#CBD5E1',
    marginVertical: 2,
  },
  dotOutline: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#94A3B8',
  },
  routeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#475569',
  },
  priceText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1C1E',
  },
});