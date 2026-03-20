import Config from "react-native-config";
import AppConfig from "../config/app.config";

export const toLatLng = ([lat, lng]: number[]) => ({
    latitude: lat,
    longitude: lng,
});

// Generate smooth dummy route between 2 points
export const generateRoute = (start: any, end: any, steps = 20) => {
    const latStep = (end.latitude - start.latitude) / steps;
    const lngStep = (end.longitude - start.longitude) / steps;

    return Array.from({ length: steps + 1 }, (_, i) => ({
        latitude: start.latitude + latStep * i,
        longitude: start.longitude + lngStep * i,
    }));
};


export const getRouteFromDirectionsAPI = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${AppConfig.map_key}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.routes?.length) return [];

    const points = data.routes[0].overview_polyline.points;

    return decodePolyline(points);
};

export const decodePolyline = (t: string) => {
    let points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < t.length) {
        let b, shift = 0, result = 0;
        do {
            b = t.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        const dlat = result & 1 ? ~(result >> 1) : result >> 1;
        lat += dlat;

        shift = 0;
        result = 0;

        do {
            b = t.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        const dlng = result & 1 ? ~(result >> 1) : result >> 1;
        lng += dlng;

        points.push({
            latitude: lat / 1e5,
            longitude: lng / 1e5,
        });
    }

    return points;
};