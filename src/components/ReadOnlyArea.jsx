import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const ReadOnlyArea = ({ label, totalArea }) => {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.readOnlyContainer}>
                <TextInput style={styles.readOnlyInput} value={`Hectare: ${totalArea.hectare}`} editable={false} />
                <TextInput style={styles.readOnlyInput} value={`Acre: ${totalArea.acre}`} editable={false} />
            </View>
            <View style={styles.readOnlyContainer}>
                <TextInput style={styles.readOnlyInput} value={`Gunta: ${totalArea.gunta}`} editable={false} />
                <TextInput style={styles.readOnlyInput} value={`Sqft: ${totalArea.sqft}`} editable={false} />
            </View>
        </View>
    );
};

export default ReadOnlyArea;

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#333",
    },
    readOnlyContainer: {
        marginVertical: 10,
        flexDirection: "row",
        gap: 20,

    },
    readOnlyInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#f9f9f9",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
});
