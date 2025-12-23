import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({ title, onPress,backgroundColor }) => {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: backgroundColor || "#2E7D32" }]} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default CustomButton;

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 20,
        backgroundColor: "#2E7D32",
        borderRadius: 5,
        paddingVertical: 13,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "500",
    },

});
