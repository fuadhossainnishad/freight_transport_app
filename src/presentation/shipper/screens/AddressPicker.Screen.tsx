import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    Alert,
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { useRoute, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

const { width, height } = Dimensions.get('window')

const DEFAULT_LOCATION = {
    latitude: 23.8103,
    longitude: 90.4125,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

const API_HEADERS = {
    'User-Agent': 'LawapanTruck/1.0',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
}

export default function AddressPickerScreen() {
    const { t } = useTranslation()
    const route = useRoute()
    const navigation = useNavigation()
    const { field } = route.params as any

    const [searchQuery, setSearchQuery] = useState('')
    const [predictions, setPredictions] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [selectedLocation, setSelectedLocation] = useState<any>(null)
    const [currentRegion, setCurrentRegion] = useState<Region>(DEFAULT_LOCATION)

    const searchTimeoutRef = useRef<number | null>(null)
    const mapRef = useRef<MapView>(null)

    // Mount-only: seed the map with the default location. reverseGeocode now
    // closes over `t`, so the linter wants it as a dependency — but adding it
    // would re-fire this geocode request on every language switch for no reason.
    useEffect(() => {
        reverseGeocode(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Search using OpenStreetMap Nominatim API
    const searchLocationsAPI = async (query: string) => {
        if (!query.trim()) return

        try {
            setLoading(true)
            setError('')

            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=20&addressdetails=1`

            const response = await fetch(url, { headers: API_HEADERS })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()

            if (data && data.length > 0) {
                const formattedPredictions = data.map((item: any) => ({
                    place_id: item.place_id,
                    description: item.display_name,
                    lat: parseFloat(item.lat),
                    lon: parseFloat(item.lon),
                    address: {
                        formatted_address: item.display_name,
                        city: item.address?.city || item.address?.town || item.address?.village || '',
                        state: item.address?.state || '',
                        country: item.address?.country || '',
                        pincode: item.address?.postcode || ''
                    }
                }))
                setPredictions(formattedPredictions)
                setError('')
            } else {
                setPredictions([])
                setError(t('shipper.addressPicker.noResults', { query }))
            }
        } catch (err) {
            console.error('Search Error:', err)
            setError(t('shipper.addressPicker.searchFailed'))
            setPredictions([])
        } finally {
            setLoading(false)
        }
    }

    const searchLocations = (text: string) => {
        setSearchQuery(text)

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        if (!text.trim()) {
            setPredictions([])
            setError('')
            return
        }

        searchTimeoutRef.current = setTimeout(() => {
            searchLocationsAPI(text)
        }, 500)
    }

    const reverseGeocode = async (latitude: number, longitude: number) => {
        try {
            setLoading(true)

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
                { headers: API_HEADERS }
            )

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()

            if (data && data.display_name) {
                const addressData = {
                    latitude,
                    longitude,
                    formatted_address: data.display_name,
                    address: data.display_name,
                    city: data.address?.city || data.address?.town || data.address?.village || '',
                    state: data.address?.state || '',
                    country: data.address?.country || '',
                    pincode: data.address?.postcode || '',
                    coordinates: { lat: latitude, lng: longitude }
                }
                setSelectedLocation(addressData)
                setError('')
            }
        } catch (err) {
            console.error('Reverse geocoding error:', err)
            const addressData = {
                latitude,
                longitude,
                formatted_address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
                city: '',
                state: '',
                country: '',
                pincode: '',
                coordinates: { lat: latitude, lng: longitude }
            }
            setSelectedLocation(addressData)
            setError(t('shipper.addressPicker.addressFailed'))
        } finally {
            setLoading(false)
        }
    }

    const handleMapPress = (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate
        reverseGeocode(latitude, longitude)
        setPredictions([])
        setSearchQuery('')
    }

    const handleMarkerDragEnd = (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate
        reverseGeocode(latitude, longitude)
    }

    const handleSelectAddress = (prediction: any) => {
        const addressData = {
            place_id: prediction.place_id,
            description: prediction.description,
            formatted_address: prediction.description,
            address: prediction.address?.formatted_address || prediction.description,
            city: prediction.address?.city || '',
            state: prediction.address?.state || '',
            country: prediction.address?.country || '',
            pincode: prediction.address?.pincode || '',
            latitude: prediction.lat,
            longitude: prediction.lon,
            coordinates: { lat: prediction.lat, lng: prediction.lon }
        }

        const newRegion = {
            latitude: prediction.lat,
            longitude: prediction.lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }

        setCurrentRegion(newRegion)
        setSelectedLocation(addressData)
        mapRef.current?.animateToRegion(newRegion, 1000)
        setPredictions([])
        setSearchQuery('')
        setError('')
    }

    const confirmAddress = () => {
        if (selectedLocation) {
            navigation.navigate("CreateShipment", {
                selectedLocation: selectedLocation,
                field: field
            })
        } else {
            Alert.alert(
                t('shipper.addressPicker.noneSelectedTitle'),
                t('shipper.addressPicker.noneSelectedMessage'),
            )
        }
    }

    const renderPrediction = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#F0F0F0',
                backgroundColor: 'white'
            }}
            onPress={() => handleSelectAddress(item)}
            activeOpacity={0.7}
        >
            <Text style={{ fontSize: 20, marginRight: 12 }}>📍</Text>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, color: '#333333', lineHeight: 20 }} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
            <Text style={{ fontSize: 18, color: '#999999' }}>›</Text>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ height: height * 0.6 }}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    region={currentRegion}
                    onPress={handleMapPress}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    zoomEnabled={true}
                    zoomControlEnabled={true}
                >
                    {selectedLocation && (
                        <Marker
                            coordinate={{
                                latitude: selectedLocation.latitude,
                                longitude: selectedLocation.longitude
                            }}
                            draggable
                            onDragEnd={handleMarkerDragEnd}
                            title={t('shipper.addressPicker.selectedLocation')}
                            description={selectedLocation.formatted_address?.substring(0, 100)}
                        />
                    )}
                </MapView>

                <View style={{
                    position: 'absolute',
                    top: 10,
                    alignSelf: 'center',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 25,
                }}>
                    <Text style={{ color: 'white', fontSize: 12 }}>
                        📍 Tap on map or search below
                    </Text>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <View style={{ padding: 16, backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#D1D5DB',
                        paddingHorizontal: 12,
                    }}>
                        <Text style={{ fontSize: 18, color: '#9CA3AF' }}>🔍</Text>
                        <TextInput
                            style={{
                                flex: 1,
                                paddingVertical: 14,
                                paddingHorizontal: 10,
                                fontSize: 16,
                                color: '#1F2937'
                            }}
                            placeholder={t('shipper.addressPicker.searchPlaceholder')}
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={searchLocations}
                            returnKeyType="search"
                        />
                        {searchQuery ? (
                            <TouchableOpacity
                                onPress={() => {
                                    setSearchQuery('')
                                    setPredictions([])
                                    setError('')
                                }}
                                style={{ padding: 4 }}
                            >
                                <Text style={{ fontSize: 16, color: '#9CA3AF' }}>✕</Text>
                            </TouchableOpacity>
                        ) : null}
                        {loading && <ActivityIndicator size="small" color="#036BB4" style={{ marginLeft: 8 }} />}
                    </View>
                    {error ? (
                        <View style={{ marginTop: 8, padding: 12, backgroundColor: '#FEE2E2', borderRadius: 8 }}>
                            <Text style={{ color: '#DC2626', fontSize: 13 }}>{error}</Text>
                        </View>
                    ) : null}
                </View>

                {selectedLocation && !searchQuery && (
                    <View style={{
                        padding: 16,
                        backgroundColor: '#EFF6FF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#DBEAFE',
                    }}>
                        <Text style={{ fontSize: 12, color: '#1E40AF', marginBottom: 4 }}>✓ {t('shipper.addressPicker.selectedLocation')}</Text>
                        <Text style={{ fontSize: 14, color: '#1E3A8A' }} numberOfLines={2}>
                            {selectedLocation.formatted_address}
                        </Text>
                    </View>
                )}

                {predictions.length > 0 ? (
                    <FlatList
                        data={predictions}
                        keyExtractor={(item, index) => item.place_id?.toString() || index.toString()}
                        renderItem={renderPrediction}
                        keyboardShouldPersistTaps="handled"
                        style={{ flex: 1 }}
                    />
                ) : (
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 48, marginBottom: 16 }}>🗺️</Text>
                            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 8 }}>
                                {!selectedLocation
                                    ? t('shipper.addressPicker.tapHint')
                                    : t('shipper.addressPicker.selectedHint')
                                }
                            </Text>
                            {!selectedLocation && (
                                <Text style={{ fontSize: 14, color: '#999', textAlign: 'center' }}>
                                    {t('shipper.addressPicker.searchWorldwide')}
                                </Text>
                            )}
                        </View>
                    </ScrollView>
                )}

                <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#E5E5E5', backgroundColor: 'white' }}>
                    <TouchableOpacity
                        onPress={confirmAddress}
                        style={{
                            backgroundColor: selectedLocation ? '#036BB4' : '#9CA3AF',
                            padding: 16,
                            borderRadius: 12,
                            alignItems: 'center'
                        }}
                        disabled={!selectedLocation}
                    >
                        {/* Two complete sentences, not "Confirm " + word + " Location":
                            French word order will not survive concatenation. */}
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                            {field === 'pickup_address'
                                ? t('shipper.addressPicker.confirmPickup')
                                : t('shipper.addressPicker.confirmDelivery')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}