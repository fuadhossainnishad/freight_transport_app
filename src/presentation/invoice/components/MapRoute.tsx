import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from "react-native-maps";
import { getRouteFromDirectionsAPI, toLatLng } from "../../../shared/utils/map";
import Truck from '../../../../assets/icons/truck3.svg'
import Location from '../../../../assets/icons/location2.svg'

type LatLng = {
    latitude: number;
    longitude: number;
};
export default function MapRoute() {
    const pickupCoord = toLatLng([23.8103, 90.4125]);   // Dhaka center
    const deliveryCoord = toLatLng([23.7806, 90.4070]);
    const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
    const mapStyle = [
        {
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }],
        },
        {
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
        },
        {
            elementType: "labels.text.fill",
            stylers: [{ color: "#616161" }],
        },
    ];
    useEffect(() => {
        const loadRoute = async () => {
            const route = await getRouteFromDirectionsAPI(
                pickupCoord,
                deliveryCoord
            );

            if (route.length) {
                setRouteCoords(route);
            }
        };

        loadRoute();
    }, []);

    return (
        <View style={{ height: 200, borderRadius: 12, overflow: "hidden" }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: pickupCoord.latitude,
                    longitude: pickupCoord.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                customMapStyle={mapStyle}
                provider="google"
                showsCompass={false}
                // @ts-ignore
                showsPointsOfInterest={true}
                showsBuildings={true}
                showsTraffic={false}
                ref={(ref) => {
                    if (ref) {
                        setTimeout(() => {
                            ref.fitToCoordinates(routeCoords, {
                                edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
                                animated: true,
                            });
                        }, 300);
                    }
                }}
            >
                {/* 🚚 Pickup Marker */}
                <Marker coordinate={pickupCoord} title="Pickup Point">
                    <TouchableOpacity className='p-2 rounded-full bg-[#E6F0F7]'>
                        <Truck height={24} width={24} />
                    </TouchableOpacity>
                </Marker>

                {/* 📍 Delivery Marker */}
                <Marker coordinate={deliveryCoord} title="Delivery Point">
                    <TouchableOpacity className='p-2 rounded-full bg-[#E6F0F7]'>
                        <Location height={24} width={24} />
                    </TouchableOpacity>
                </Marker>

                {/* 🛣️ Route */}
                <Polyline
                    coordinates={routeCoords}
                    strokeWidth={4}
                    strokeColor="#036BB4"
                />
            </MapView>
        </View>
    );
};

