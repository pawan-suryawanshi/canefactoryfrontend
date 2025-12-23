// Haversine distance (in kilometers)
export const haversineDistance = (coords1, coords2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Convert lat/lon to Cartesian coordinates (meters), equirectangular approximation
export const latLonToXY = (latDeg, lonDeg, meanLatRad) => {
    const R = 6378137; // Earth's radius in meters
    const latRad = (latDeg * Math.PI) / 180;
    const lonRad = (lonDeg * Math.PI) / 180;

    const x = R * lonRad * Math.cos(meanLatRad);
    const y = R * latRad;

    return { x, y };
};

// Calculate area using Shoelace formula and set result
export const calculateLandArea = (coords, setArea) => {
    if (!coords || coords.length < 3){
        setArea({
            hectare: 0,
            acre: 0,
            gunta: 0,
            sqft: 0,
        });
        
        return;
    }

    const meanLat = coords.reduce((sum, p) => sum + p.latitude, 0) / coords.length;
    const meanLatRad = (meanLat * Math.PI) / 180;

    const xyCoords = coords.map(p => latLonToXY(p.latitude, p.longitude, meanLatRad));

    let area = 0;
    for (let i = 0; i < xyCoords.length; i++) {
        const j = (i + 1) % xyCoords.length;
        area += xyCoords[i].x * xyCoords[j].y - xyCoords[j].x * xyCoords[i].y;
    }

    const areaInSqMeters = Math.abs(area / 2);
        setArea({
           /* hectare: (areaInSqMeters / 10000).toFixed(4),
            acre: (areaInSqMeters / 4046.86).toFixed(4),
            gunta: (areaInSqMeters / 101.1714).toFixed(4),
            sqft: (areaInSqMeters * 10.7639).toFixed(2),*/

             hectare: (areaInSqMeters / 10000),
            acre: (areaInSqMeters / 4046.86),
            gunta: (areaInSqMeters / 101.1714),
            sqft: (areaInSqMeters * 10.7639),
        });
    
};
