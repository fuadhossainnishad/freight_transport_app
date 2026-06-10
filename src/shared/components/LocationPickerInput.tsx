import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';

export type LatLng = { latitude: number; longitude: number };

type Suggestion = { label: string; latitude: number; longitude: number };

type Props = {
  label: string;
  placeholder: string;
  address: string;
  coord: LatLng | null;
  onChange: (address: string, coord: LatLng | null) => void;
};

// Default map view (Dhaka) used until a location is chosen.
const DEFAULT_REGION = {
  latitude: 23.7806,
  longitude: 90.4074,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Free OpenStreetMap geocoding (no key/billing). Nominatim policy: keep a valid
// User-Agent and ≤1 req/sec — we debounce typing to stay within that.
async function searchPlaces(q: string): Promise<Suggestion[]> {
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { format: 'json', limit: 5, q },
      headers: { 'User-Agent': 'LawapanTruck/1.0 (shipment-create)' },
    });
    return (res.data || []).map((r: any) => ({
      label: r.display_name as string,
      latitude: parseFloat(r.lat),
      longitude: parseFloat(r.lon),
    }));
  } catch {
    return [];
  }
}

// Reverse-geocode a dropped pin back into a readable address (best-effort).
async function reverseGeocode(c: LatLng): Promise<string | null> {
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { format: 'json', lat: c.latitude, lon: c.longitude },
      headers: { 'User-Agent': 'LawapanTruck/1.0 (shipment-create)' },
    });
    return (res.data?.display_name as string) ?? null;
  } catch {
    return null;
  }
}

export default function LocationPickerInput({
  label,
  placeholder,
  address,
  coord,
  onChange,
}: Props) {
  const [query, setQuery] = useState(address);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mapRef = useRef<MapView>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Skips the next debounced search after we set the text programmatically
  // (selecting a suggestion / dragging the pin), so it doesn't re-search.
  const skipSearch = useRef(false);

  // Keep local text in sync if the parent resets the address.
  useEffect(() => {
    setQuery(address);
  }, [address]);

  // Debounced live search as the user types.
  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const results = await searchPlaces(query.trim());
      setSuggestions(results);
      setShowSuggestions(true);
      setSearching(false);
    }, 700);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const selectSuggestion = (s: Suggestion) => {
    skipSearch.current = true;
    setQuery(s.label);
    setShowSuggestions(false);
    setSuggestions([]);
    const c = { latitude: s.latitude, longitude: s.longitude };
    onChange(s.label, c);
    mapRef.current?.animateToRegion(
      { ...c, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      400,
    );
  };

  // Pin moved (drag or map tap) — store the exact coord, then refresh the
  // address text from it so the typed name and pin stay consistent.
  const setPin = async (c: LatLng) => {
    onChange(query, c);
    const rev = await reverseGeocode(c);
    if (rev) {
      skipSearch.current = true;
      setQuery(rev);
      onChange(rev, c);
    }
  };

  return (
    <View className="mb-4">
      <Text className="font-semibold mb-1 text-[#1A1C1E]">{label}</Text>

      <View>
        <TextInput
          className="border border-[#AEAEAE] p-3 rounded-lg"
          placeholder={placeholder}
          value={query}
          onChangeText={t => {
            setQuery(t);
            onChange(t, coord);
          }}
        />
        {searching && (
          <ActivityIndicator
            style={{ position: 'absolute', right: 12, top: 14 }}
            size="small"
            color="#036BB4"
          />
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View className="border border-[#E5E5E5] rounded-lg mt-1 overflow-hidden">
          {suggestions.map((s, i) => (
            <TouchableOpacity
              key={i}
              className="p-3 border-b border-[#F1F1F1]"
              onPress={() => selectSuggestion(s)}
            >
              <Text className="text-sm text-[#1A1C1E]" numberOfLines={2}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Map preview — tap or drag the pin to set the exact spot */}
      <View
        className="mt-2 rounded-xl overflow-hidden border border-[#E5E5E5]"
        style={{ height: 180 }}
      >
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={
            coord
              ? { ...coord, latitudeDelta: 0.01, longitudeDelta: 0.01 }
              : DEFAULT_REGION
          }
          onPress={e => setPin(e.nativeEvent.coordinate)}
        >
          {coord && (
            <Marker
              coordinate={coord}
              draggable
              onDragEnd={e => setPin(e.nativeEvent.coordinate)}
            />
          )}
        </MapView>
      </View>

      {coord ? (
        <Text className="text-xs text-[#8E8E93] mt-1">
          Pin: {coord.latitude.toFixed(5)}, {coord.longitude.toFixed(5)} — drag
          the marker to adjust
        </Text>
      ) : (
        <Text className="text-xs text-[#8E8E93] mt-1">
          Search above, or tap the map to drop a pin
        </Text>
      )}
    </View>
  );
}
