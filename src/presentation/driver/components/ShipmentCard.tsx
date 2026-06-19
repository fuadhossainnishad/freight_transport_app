import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import { Shipment } from '../types';
import { formatPriceRange } from '../helper/format-price.helper';

interface Props {
  shipment: Shipment;
  onPress: () => void;
}

// Addresses come back fully qualified (place, street, city, division, country).
// On a card we only need the recognizable place name — the part before the
// first comma — so the route stays a tidy two lines instead of a wall of text.
const shortAddress = (addr?: string) => {
  const label = addr?.split(',')[0]?.trim();
  return label && label.length > 0 ? label : '—';
};

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
        {/* Route — short place names only, one line each */}
        <View style={styles.route}>
          <View style={styles.routeLineRow}>
            <View style={styles.dotFilled} />
            <Text style={styles.routeText} numberOfLines={1}>
              {shortAddress(shipment.pickupAddress)}
            </Text>
          </View>

          <View style={styles.connector} />

          <View style={styles.routeLineRow}>
            <View style={styles.dotOutline} />
            <Text style={styles.routeText} numberOfLines={1}>
              {shortAddress(shipment.deliveryAddress)}
            </Text>
          </View>
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
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    // Professional Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    height: 132,
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Subtle dark tint to make white text pop
  },
  imageTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  infoSection: {
    backgroundColor: '#E9F3F9', // Light blue tint from your design
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  route: {
    marginBottom: 10,
  },
  routeLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotFilled: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#036BB4',
    marginRight: 9,
  },
  dotOutline: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    marginRight: 9,
  },
  connector: {
    width: 1.5,
    height: 12,
    backgroundColor: '#CBD5E1',
    marginLeft: 3.25,
    marginVertical: 2,
  },
  routeText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1C1E',
  },
});