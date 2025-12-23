import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AddMoreLand = ({ label, addMoreLand, setAddMoreLand }) => {
    return (
        <View>
            <Text style={styles.label}>Add More Land?</Text>
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.button, !addMoreLand && styles.selectedButton]}
                    onPress={() => setAddMoreLand(false)}
                >
                    <Text style={[styles.text, !addMoreLand && styles.selectedText]}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, addMoreLand && styles.selectedButton]}
                    onPress={() => setAddMoreLand(true)}
                >
                    <Text style={[styles.text, addMoreLand && styles.selectedText]}>Yes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddMoreLand;

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: "#333",
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    button: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
    },
    selectedButton: {
        backgroundColor: "#000",
    },
    text: {
        fontSize: 16,
        color: "#333",
    },
    selectedText: {
        color: "#fff",
    },
});

// modalActions: {
//     marginVertical: 15,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
// },
// noButton: {
//     flex: 1,
//     marginRight: 10,
//     backgroundColor: "#f5f5f5",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
// },
// noButtonText: {
//     color: "#000",
//     fontSize: 16,
// },
// yesButton: {
//     flex: 1,
//     marginLeft: 10,
//     backgroundColor: "#000",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
// },
// yesButtonText: {
//     color: "#fff",
//     fontSize: 16,
// },