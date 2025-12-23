import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground       // ✅ FIXED: IMPORTED
} from "react-native";
import CustomButton from "../components/CustomButton";
import { useToast } from "react-native-toast-notifications";
import config from "../config/config";

export default function LoginScreen({ navigation }) {
    const toast = useToast();
    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const IP_ADDRESS = config.IP_ADDRESS;

    const handleLogin = async () => {
        if (!username || !password || !role) {
            toast.show("Complete all fields before submitting.", { type: "danger" });
            return;
        }

        let id = toast.show("Loading...");
        try {
            const response = await fetch(`${IP_ADDRESS}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                if (role === "Field Overseer") {
                    navigation.navigate("FieldOverseer", { userID: data.user.UserID });
                /*} else if (role == "Grower") {
                    navigation.navigate("GrowerProfile");*/
                } else {
                    navigation.navigate("Admin", { userID: data.user.UserID });
                }

                toast.show("Login Success!", { type: "success" });
            } else {
                toast.show("Invalid Credentials!", { type: "warning" });
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.show("Login Failed!", { type: "danger" });
        } finally {
            toast.hide(id);
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/sugarcane.png")}
            resizeMode="cover"
            style={styles.background}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.subContainer}>
                    <Text style={styles.label}>Username/युसर नाव</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your username"
                        value={username}
                        onChangeText={setUsername}
                    />

                    <Text style={styles.label}>Password/पासवर्ड</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Text style={styles.label}>Role/रोल</Text>
                    <View style={styles.roleContainer}>
                        {["Field Overseer", "Admin"].map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.roleButton,
                                    role === item && styles.roleButtonSelected,
                                ]}
                                onPress={() => setRole(item)}
                            >
                                <Text
                                    style={[
                                        styles.roleText,
                                        role === item && styles.roleTextSelected,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <CustomButton
                        title="Log In"
                        onPress={handleLogin}
                        backgroundColor="#2E7D32"
                    />

                    <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "rgba(255,255,255,0.0)",   // ✅ transparent overlay
    },
    subContainer: {
        marginTop: 20,
        backgroundColor: "rgba(255,255,255,0.8)",   // optional white box
        padding: 15,
        borderRadius: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginBottom: 18,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    roleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    roleButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#eee",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    roleButtonSelected: {
        backgroundColor: "#2E7D32",
    },
    roleText: {
        fontSize: 16,
        color: "#000",
    },
    roleTextSelected: {
        color: "#fff",
    },
    forgotPassword: {
        marginTop: 5,
        color: "#000",
        fontSize: 18,
        fontWeight: "500",
    },
});
