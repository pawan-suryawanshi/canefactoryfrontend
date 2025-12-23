import React, { useState } from "react";
import { TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import ConfirmationModal from "./ConfirmationModal";

const LogoutButton = ({ navigation }) => {

    const [modalVisible, setModalVisible] = useState(false);

    const handleLogout = () => {
        setModalVisible(true);
    };

    const confirmLogout = () => {
        setModalVisible(false);
        // Clear auth token or state
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
    };

    return (
        <>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            {/* Confirmation Modal */}
            <ConfirmationModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={confirmLogout}
                title="Logout Confirmation"
                message="Are you sure you want to log out?"
            />
        </>
    );
};

const styles = StyleSheet.create({
    logoutButton: {
        backgroundColor: "#000", // Black button (matching login)
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginRight: 10, // Align in header
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default LogoutButton;

