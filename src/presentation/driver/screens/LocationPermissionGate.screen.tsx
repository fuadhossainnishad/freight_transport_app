import React, { memo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Note: I'm using hex colors that match the standard iOS system blue and grays 
// seen in the permission dialog.

type Props = {
  onRequest: (accuracy: "precise" | "approximate") => void;
  onDeny: () => void;
};

const LocationPermissionGateScreen = memo(function LocationPermissionGate({
  onRequest,
  onDeny,
}: Props) {
  const [accuracy, setAccuracy] = useState<"precise" | "approximate">("precise");

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.card}>
        
        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.mainIconContainer}>
            {/* Custom Location Pin Icon using Views */}
            <View style={styles.pinHead}>
               <View style={styles.pinInner} />
            </View>
            <View style={styles.pinTail} />
          </View>
          
          <Text style={styles.titleText}>
            Allow My App to access this device's precise location?
          </Text>
        </View>

        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Middle Map Selection Section */}
        <View style={styles.mapSection}>
          <View style={styles.mapRow}>
            
            {/* Precise Option */}
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => setAccuracy("precise")}
              style={styles.optionWrapper}
            >
              <View style={[
                styles.mapCircle, 
                accuracy === "precise" && styles.activeMapCircle
              ]}>
                {/* Visual representation of a detailed map */}
                <View style={styles.mapGridLines} />
                <View style={styles.preciseDetails}>
                  {[...Array(12)].map((_, i) => (
                    <View key={i} style={[styles.mapDot, { top: 10 + (i*8), left: 5 + (i*6) }]} />
                  ))}
                  <View style={styles.blueDotPin} />
                </View>
              </View>
              <Text style={styles.mapLabel}>Precise</Text>
            </TouchableOpacity>

            {/* Approximate Option */}
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => setAccuracy("approximate")}
              style={styles.optionWrapper}
            >
              <View style={[
                styles.mapCircle, 
                accuracy === "approximate" && styles.activeMapCircle
              ]}>
                 <View style={styles.mapGridLines} />
                 <View style={styles.approximateCircle} />
                 <View style={styles.approximateDot} />
              </View>
              {/* Keeping the typo from your screenshot "Apprximate" as requested for pixel-perfect match */}
              <Text style={styles.mapLabel}>Apprximate</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.footerSection}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onRequest(accuracy)}
          >
            <Text style={styles.actionButtonText}>While using the app</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onDeny}
          >
            <Text style={styles.actionButtonText}>Don’t allow</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
});

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: width * 0.85,
    backgroundColor: "#F9F9F9", // Slightly off-white for the card background
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    overflow: "hidden",
    // Elevation for Android, Shadow for iOS
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  topSection: {
    paddingTop: 35,
    paddingHorizontal: 25,
    paddingBottom: 25,
    alignItems: "center",
  },
  mainIconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pinInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  pinTail: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 18,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#007AFF",
    marginTop: -8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    lineHeight: 26,
  },
  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    width: "100%",
  },
  mapSection: {
    paddingVertical: 30,
    alignItems: "center",
  },
  mapRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  optionWrapper: {
    alignItems: "center",
  },
  mapCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#EFEFEF",
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  activeMapCircle: {
    borderColor: "#007AFF",
  },
  mapLabel: {
    fontSize: 15,
    color: "#333333",
    fontWeight: "500",
  },
  mapGridLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
    borderWidth: 1,
    borderColor: '#000',
    // Simulating grid with borders
  },
  preciseDetails: {
    width: '100%',
    height: '100%',
  },
  mapDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999',
  },
  blueDotPin: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  approximateCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  approximateDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007AFF',
  },
  footerSection: {
    paddingBottom: 15,
  },
  actionButton: {
    paddingVertical: 18,
    width: "100%",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderColor: "#EBEBEB",
  },
  actionButtonText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "600",
  },
});

export default LocationPermissionGateScreen;