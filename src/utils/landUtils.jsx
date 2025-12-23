import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

export const pickPhoto = async (photos, setPhotos, calculateLandArea, setTotalArea, setCoordinates) => {
    if (photos.length >= 8) {
        return {
            success: false,
            title: "Limit Reached",
            message: "You can only add up to 8 photos."
        };
    }

    // Request location permission
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (locationStatus !== "granted") {
        return {
            success: false,
            title: "Permission Denied",
            message: "Location permission is required."
        };
    }

    // Request camera permission
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== "granted") {
        return {
            success: false,
            title: "Permission Denied",
            message: "Camera permission is required."
        };
    }

    // Launch camera
    const photoResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
    });

    if (!photoResult.canceled && photoResult.assets?.length > 0) {
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
        });

        const newPhoto = {
            uri: photoResult.assets[0].uri,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        };

        const updatedPhotos = [...photos, newPhoto];
        setPhotos(updatedPhotos);

        if (updatedPhotos.length >= 3) {
            calculateLandArea(updatedPhotos, setTotalArea, setCoordinates);
        }

        return { success: true };
    }

    return {
        success: false,
        title: "Photo Error",
        message: "No photo was taken."
    };
};
/*New code added here */
export const calculateLandArea = (photoData, setTotalArea, setCoordinates) => {
    if (photoData.length < 3) {
        setTotalArea({
            hectare: 0,
            acre: 0,
            gunta: 0,
            sqft: 0,
        });
        return;
    }

    // More precise WGS84 Earth radius (mean radius)
    const R = 6371008.8;

    const toRad = (deg) => (deg * Math.PI) / 180;

    // Extract lat/lon
    const coords = photoData.map(p => ({
        latitude: p.latitude,
        longitude: p.longitude
    }));

    setCoordinates(coords);

    // Reference origin = mean latitude & longitude
    const meanLat = coords.reduce((s, p) => s + p.latitude, 0) / coords.length;
    const meanLon = coords.reduce((s, p) => s + p.longitude, 0) / coords.length;

    const lat0 = toRad(meanLat);
    const lon0 = toRad(meanLon);

    // Convert GPS → Local Cartesian using high-precision Equirectangular projection
    const xy = coords.map(p => {
        const lat = toRad(p.latitude);
        const lon = toRad(p.longitude);

        return {
            x: R * (lon - lon0) * Math.cos(lat0),
            y: R * (lat - lat0)
        };
    });

    // Shoelace formula (optimized & stable)
    let sum = 0;
    for (let i = 0; i < xy.length; i++) {
        const j = (i + 1) % xy.length;
        sum += (xy[i].x * xy[j].y) - (xy[j].x * xy[i].y);
    }

    const areaInSqMeters = Math.abs(sum / 2);

    // Unit conversions (more accurate constants)
    const areaInHectare = areaInSqMeters / 10000;
    const areaInAcre = areaInSqMeters / 4046.8564224;
    const areaInGunta = areaInAcre * 40;
    const areaInSqFeet = areaInSqMeters * 10.7639104167;

    setTotalArea({
        hectare: areaInHectare.toFixed(4),
        acre: areaInAcre.toFixed(4),
        gunta: areaInGunta.toFixed(4),
        sqft: areaInSqFeet.toFixed(2),
    });

    console.log("High-precision Area (sq meters):", areaInSqMeters);
};

/*export const calculateLandArea = (photoData, setTotalArea, setCoordinates) => {
    if (photoData.length < 3) {
        setTotalArea({
            hectare: 0,
            acre: 0,
            gunta: 0,
            sqft: 0,
        });
        return;
    }

    // Shoelace formula
    const calculatePolygonArea = (points) => {
        if (points.length < 3) return 0;

        const meanLat = points.reduce((sum, p) => sum + p.latitude, 0) / points.length;
        const meanLatRad = (meanLat * Math.PI) / 180;
        const R = 6378137; // Earth radius in meters

        const xyPoints = points.map(p => {
            const latRad = (p.latitude * Math.PI) / 180;
            const lonRad = (p.longitude * Math.PI) / 180;
            return {
                x: R * lonRad * Math.cos(meanLatRad),
                y: R * latRad
            };
        });

        let area = 0;
        for (let i = 0; i < xyPoints.length; i++) {
            const j = (i + 1) % xyPoints.length;
            area += xyPoints[i].x * xyPoints[j].y - xyPoints[j].x * xyPoints[i].y;
        }

        return Math.abs(area / 2);
    };

    const coords = photoData.map(photo => ({
        latitude: photo.latitude,
        longitude: photo.longitude
    }));

    setCoordinates(coords);
    console.log("Photo Coordinates:", coords);

    const areaInSqMeters = calculatePolygonArea(coords);

    const areaInHectare = areaInSqMeters / 10000;
    const areaInAcre = areaInSqMeters / 4046.86;
    const areaInGunta = areaInAcre * 40;
    const areaInSqFeet = areaInSqMeters * 10.7639;

    setTotalArea({
        hectare: areaInHectare.toFixed(4),
        acre: areaInAcre.toFixed(4),
        gunta: areaInGunta.toFixed(4),
        sqft: areaInSqFeet.toFixed(2),
    });

    console.log("Calculated Area (sq meters):", areaInSqMeters);
}; */
