import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RoleSelector = ({ label, roles, selectedRole, onSelectRole }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.roleContainer}>
                {roles.map((role) => (
                    <TouchableOpacity
                        key={role}
                        style={[
                            styles.roleButton,
                            selectedRole === role && styles.roleButtonSelected,
                        ]}
                        onPress={() => onSelectRole(role)}
                    >
                        <Text
                            style={[
                                styles.roleText,
                                selectedRole === role && styles.roleTextSelected,
                            ]}
                        >
                            {role}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default RoleSelector;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: "#333333",
        marginBottom: 5,
    },
    roleContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 20,
    },
    roleButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#eee",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: "center",
    },
    roleButtonSelected: {
        backgroundColor: "#000",
    },
    roleText: {
        fontSize: 16,
        color: "#000",
    },
    roleTextSelected: {
        color: "#fff",
    },
});
