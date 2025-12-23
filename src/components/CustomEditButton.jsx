import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomEditButton = ({ title, onPress, disabled = false }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} disabled={disabled}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default CustomEditButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#eee",
        borderRadius: 8,
        borderColor: "#000",
        borderWidth: 2,
        paddingVertical: 13,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        paddingHorizontal: 10,
        color: "#000",
        fontSize: 18,
        fontWeight: "500",
    },

});
