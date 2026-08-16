import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {
  Maximize2,
  X,
  Search,
  LocateFixed,
  MapPin,
  Check,
  ArrowLeft,
} from 'lucide-react-native';
import { searchPlaces, reverseGeocode, Suggestion } from '../utils/geocode';

export type LatLng = { latitude: number; longitude: number };

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

const BLUE = '#036BB4';

export default function LocationPickerInput({
  label,
  placeholder,
  address,
  coord,
  onChange,
}: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState(address);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [locating, setLocating] = useState(false);
  // Render the custom marker view, then stop tracking changes (perf + avoids
  // a blank marker on first mount).
  const [tracksView, setTracksView] = useState(true);

  const insets = useSafeAreaInsets();

  const inlineMapRef = useRef<MapView>(null);
  const fullMapRef = useRef<MapView>(null);
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

  // Briefly track view changes so the custom marker renders, then freeze it.
  useEffect(() => {
    if (!expanded) return;
    setTracksView(true);
    const t = setTimeout(() => setTracksView(false), 600);
    return () => clearTimeout(t);
  }, [expanded, coord]);

  const animateTo = (c: LatLng) => {
    const region = { ...c, latitudeDelta: 0.01, longitudeDelta: 0.01 };
    inlineMapRef.current?.animateToRegion(region, 400);
    fullMapRef.current?.animateToRegion(region, 400);
  };

  const selectSuggestion = (s: Suggestion) => {
    skipSearch.current = true;
    setQuery(s.label);
    setShowSuggestions(false);
    setSuggestions([]);
    const c = { latitude: s.latitude, longitude: s.longitude };
    onChange(s.label, c);
    animateTo(c);
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

  const locateMe = () => {
    setLocating(true);
    Geolocation.getCurrentPosition(
      pos => {
        const c = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        animateTo(c);
        setPin(c).finally(() => setLocating(false));
      },
      () => {
        setLocating(false);
        Alert.alert(
          t('components.locationPicker.unavailableTitle'),
          t('components.locationPicker.unavailableMessage'),
        );
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
    );
  };

  const renderSuggestions = () =>
    showSuggestions && suggestions.length > 0 ? (
      <View className="border border-[#E5E5E5] rounded-lg mt-1 overflow-hidden bg-white">
        {suggestions.map((s, i) => (
          <TouchableOpacity
            key={i}
            className="flex-row items-start p-3 border-b border-[#F1F1F1]"
            onPress={() => selectSuggestion(s)}
          >
            <MapPin size={16} color={BLUE} style={{ marginTop: 2 }} />
            <Text className="text-sm text-[#1A1C1E] ml-2 flex-1" numberOfLines={2}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ) : null;

  return (
    <View className="mb-4">
      <Text className="font-semibold mb-1 text-[#1A1C1E]">{label}</Text>

      {/* Search field */}
      <View>
        <TextInput
          className="border border-[#AEAEAE] p-3 rounded-lg"
          placeholder={placeholder}
          placeholderTextColor="#9AA0A6"
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
            color={BLUE}
          />
        )}
      </View>

      {renderSuggestions()}

      {/* Inline map preview — tap or drag the pin, or expand for a bigger map */}
      <View
        className="mt-2 rounded-xl overflow-hidden border border-[#E5E5E5]"
        style={{ height: 180 }}
      >
        <MapView
          ref={inlineMapRef}
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

        {/* Expand button */}
        <TouchableOpacity
          onPress={() => setExpanded(true)}
          className="absolute top-2 right-2 w-9 h-9 rounded-lg bg-white items-center justify-center"
          style={{
            elevation: 3,
            shadowColor: '#000',
            shadowOpacity: 0.18,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
          }}
        >
          <Maximize2 size={18} color={BLUE} />
        </TouchableOpacity>
      </View>

      {coord ? (
        <Text className="text-xs text-[#8E8E93] mt-1">
          Pin: {coord.latitude.toFixed(5)}, {coord.longitude.toFixed(5)} — drag the
          marker or tap expand to adjust
        </Text>
      ) : (
        <Text className="text-xs text-[#8E8E93] mt-1">
          Search above, tap the map, or expand to drop a pin
        </Text>
      )}

      {/* ── Fullscreen expanded picker ── */}
      <Modal
        visible={expanded}
        animationType="slide"
        onRequestClose={() => setExpanded(false)}
      >
        {expanded && (
          <View className="flex-1 bg-white">
            {/* Full-bleed map */}
            <MapView
              ref={fullMapRef}
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
                  anchor={{ x: 0.5, y: 1 }}
                  draggable
                  tracksViewChanges={tracksView}
                  onDragEnd={e => setPin(e.nativeEvent.coordinate)}
                >
                  {/* Custom glowing pin */}
                  <View style={{ alignItems: 'center' }}>
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        backgroundColor: BLUE,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 3,
                        borderColor: '#fff',
                        shadowColor: BLUE,
                        shadowOpacity: 0.45,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 7,
                      }}
                    >
                      <MapPin size={20} color="#fff" />
                    </View>
                    <View
                      style={{
                        width: 0,
                        height: 0,
                        borderLeftWidth: 6,
                        borderRightWidth: 6,
                        borderTopWidth: 9,
                        borderLeftColor: 'transparent',
                        borderRightColor: 'transparent',
                        borderTopColor: '#fff',
                        marginTop: -2,
                      }}
                    />
                  </View>
                </Marker>
              )}
            </MapView>

            {/* ── Floating search pill (top) ── */}
            <View
              style={{ position: 'absolute', top: Math.max(insets.top, 12) + 4, left: 16, right: 16 }}
            >
              <View
                className="flex-row items-center bg-white rounded-full pl-2 pr-3"
                style={{
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 3 },
                }}
              >
                <TouchableOpacity
                  onPress={() => setExpanded(false)}
                  className="w-9 h-9 items-center justify-center rounded-full"
                >
                  <ArrowLeft size={20} color="#1A1C1E" />
                </TouchableOpacity>
                <TextInput
                  className="flex-1 py-3 px-1 text-[#1A1C1E]"
                  placeholder={t('components.locationPicker.searchPlaceholder', {
                    label: label.toLowerCase(),
                  })}
                  placeholderTextColor="#9AA0A6"
                  value={query}
                  onChangeText={text => {
                    setQuery(text);
                    onChange(text, coord);
                  }}
                />
                {searching ? (
                  <ActivityIndicator size="small" color={BLUE} />
                ) : query.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      setQuery('');
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="w-7 h-7 items-center justify-center"
                  >
                    <X size={18} color="#8E8E93" />
                  </TouchableOpacity>
                ) : (
                  <Search size={18} color="#8E8E93" />
                )}
              </View>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <View
                  className="bg-white rounded-2xl mt-2 overflow-hidden"
                  style={{
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 3 },
                  }}
                >
                  {suggestions.map((s, i) => (
                    <TouchableOpacity
                      key={i}
                      className={`flex-row items-start p-3 ${
                        i < suggestions.length - 1 ? 'border-b border-[#F1F1F1]' : ''
                      }`}
                      onPress={() => selectSuggestion(s)}
                    >
                      <MapPin size={16} color={BLUE} style={{ marginTop: 2 }} />
                      <Text
                        className="text-sm text-[#1A1C1E] ml-2 flex-1"
                        numberOfLines={2}
                      >
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Hint pill (only before a pin is set) */}
            {!coord && (
              <View className="absolute self-center bg-black/55 px-4 py-2 rounded-full" style={{ top: '46%' }}>
                <Text className="text-white text-xs">{t('components.locationPicker.tapMap')}</Text>
              </View>
            )}

            {/* ── Locate-me FAB ── */}
            <TouchableOpacity
              onPress={locateMe}
              className="absolute right-4 w-12 h-12 rounded-full bg-white items-center justify-center"
              style={{
                bottom: 196 + Math.max(insets.bottom, 0),
                elevation: 5,
                shadowColor: '#000',
                shadowOpacity: 0.18,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              {locating ? (
                <ActivityIndicator size="small" color={BLUE} />
              ) : (
                <LocateFixed size={22} color={BLUE} />
              )}
            </TouchableOpacity>

            {/* ── Bottom card ── */}
            <View
              className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl px-5 pt-5"
              style={{
                paddingBottom: Math.max(insets.bottom, 16) + 8,
                elevation: 12,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: -3 },
              }}
            >
              <View className="flex-row items-center mb-3">
                <View className="w-2.5 h-2.5 rounded-full bg-[#036BB4] mr-2" />
                <Text className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wide">
                  {label}
                </Text>
              </View>

              <Text className="text-base font-semibold text-[#1A1C1E]" numberOfLines={2}>
                {coord
                  ? query || t('components.locationPicker.pinned')
                  : t('components.locationPicker.noneSelected')}
              </Text>
              {coord && (
                <Text className="text-xs text-[#8E8E93] mt-1">
                  {coord.latitude.toFixed(5)}, {coord.longitude.toFixed(5)}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => setExpanded(false)}
                disabled={!coord}
                activeOpacity={0.85}
                className={`flex-row items-center justify-center p-4 rounded-full mt-4 ${
                  coord ? 'bg-[#036BB4]' : 'bg-[#B9C7D1]'
                }`}
              >
                <Check size={18} color="#fff" />
                <Text className="text-white font-semibold ml-2">{t('components.locationPicker.confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}
