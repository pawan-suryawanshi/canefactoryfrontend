import React from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";

const LandPhotos = ({ label, photos, setPhotos, pickPhoto, calculateLandArea, setTotalArea, setCoordinates }) => {
    const removePhoto = (index) => {
        const updatedPhotos = [...photos];
        updatedPhotos.splice(index, 1);
        setPhotos(updatedPhotos);

        // Recalculate the area only if there are at least 3 photos
        if (updatedPhotos.length >= 3) {
            calculateLandArea(updatedPhotos, setTotalArea, setCoordinates);
        } else if (setTotalArea) {
            setTotalArea({ hectare: 0, acre: 0, gunta: 0, sqft: 0 });
        }

    };

    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.photoContainer}>
                {photos.map((photo, index) => (
                    <View key={index} style={styles.photoWrapper}>
                        <Image source={{ uri: photo.uri }} style={styles.photo} />
                        <TouchableOpacity
                            onPress={() => removePhoto(index)}
                            style={styles.removeButton}
                        >
                            <Text style={styles.removeText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                {photos.length < 8 && (
                    <TouchableOpacity onPress={pickPhoto} style={styles.addPhoto}>
                        <Text style={styles.addPhotoText}>+</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>

    );
};

export default LandPhotos;

const styles = StyleSheet.create({

    photoContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#333",
    },
    photo: {
        width: 82,
        height: 82,
        borderRadius: 5,
        margin: 6,
    },
    addPhoto: {
        width: 82,
        height: 82,
        borderRadius: 5,
        margin: 6,
        borderWidth: 1,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
    },
    addPhotoText: {
        fontSize: 30,
        color: "#666",
    },
    removeButton: {
        position: "absolute",
        top: 1,
        right: 1,
        backgroundColor: "red",
        borderRadius: 12,
        padding: 5,
    },
    removeText: {
        color: "#fff",
        fontSize: 12
    },
});
