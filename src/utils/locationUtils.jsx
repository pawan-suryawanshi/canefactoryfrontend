import { Alert } from "react-native";
import * as Location from "expo-location";

export const getCoordinates = async (address) => {
    if (!address) {
        console.error("Invalid address provided.");
        return null;
    }

    // const newaddress = "Barshi Rd, Pakharsangvi, Latur, Maharashtra 413531"

    const apiKey = "Il2QQd9F7CFZbO9MkruwZcDo5ZVIbpoFPLP5K7gMXe3W27Zj6bKGx33CuLUCRsHV"; // Replace with your API Key
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.distancematrix.ai/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    console.log("Fetching coordinates for:", address);

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("API Response:", data);

        // Check if data and result are defined and have at least one entry
        if (data && data.result && data.result.length > 0) {
            const { lat, lng } = data.result[0].geometry.location;
            const coordinates = { latitude: parseFloat(lat), longitude: parseFloat(lng) };
            console.log("Coordinates:", coordinates);
            return coordinates;
        } else {
            console.error("No coordinates found for address:", address);
            return null;
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
};



// Get user's current GPS location
export const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return null;
    }

    const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 0,
    });
    return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    };
};

// Calculate distance using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
};

export const getDistanceFromAI = async (origin, destination) => {

    console.log("origin", origin)
    console.log("destination", destination)
    try {
        const apiKey = "vD2BEENOjxIuwg2rtJ9hmoQ5SLTW5giESIAh9rNpJotLhkj1PASqu1cBBiBAufV2"; // 🔥 Replace with your API Key
        const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${apiKey}`;

        console.log("Fetching distance from Distance Matrix AI...");

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK" && data.rows.length > 0 && data.rows[0].elements.length > 0) {
            const distanceText = data.rows[0].elements[0].distance.text; // Example: "96.7 km"
            const distanceValue = data.rows[0].elements[0].distance.value / 1000; // Convert meters to km

            console.log("AI Distance:", distanceValue, "km");
            return distanceValue + " KM";
        } else {
            console.error("Error: No valid distance found in response:", data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching distance from AI:", error);
        return null;
    }
};
