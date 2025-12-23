import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import CustomButton from "../components/CustomButton";
import { useToast } from "react-native-toast-notifications";
import config from "../config/config";

export default function ForgotPasswordScreen({ navigation }) {
    const toast = useToast();
    const [username, setUsername] = useState("");
    const IP_ADDRESS = config.IP_ADDRESS;

    const handleSendReset = async () => {
        if (!username) {
            toast.show("Enter your registered username.", { type: "warning" });
            return;
        }

        toast.show("Sending reset link...");

        try {
            const response = await fetch(`${IP_ADDRESS}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.show("Reset link sent to your registered email.", { type: "success" });
                navigation.goBack();
            } else {
                toast.show(data.message || "User not found.", { type: "danger" });
            }
        } catch (error) {
            console.log("Forgot Password Error:", error);
            toast.show("Something went wrong.", { type: "danger" });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password?</Text>

            <TextInput
                placeholder="Enter Username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />

            <CustomButton
                title="Send Reset Link"
                backgroundColor="#2E7D32"
                onPress={handleSendReset}
            />

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: "#fff",
    },
    backText: {
        marginTop: 20,
        fontSize: 16,
        color: "#000",
        textAlign: "center",
    },
});
