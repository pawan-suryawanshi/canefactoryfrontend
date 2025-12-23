import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const InputField = ({ label, placeholder, value, onChangeText, editable = true, keyboardType = "default", maxLength, secureTextEntry = false }) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                maxLength={maxLength}
                secureTextEntry={secureTextEntry}
                editable={editable}

            />
        </View>
    );
};

export default InputField;

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#333333",
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#f9f9f9",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
    },
});
