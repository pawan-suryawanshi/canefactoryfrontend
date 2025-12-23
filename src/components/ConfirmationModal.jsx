import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from "react-native";

const ConfirmationModal = ({
    visible,
    onClose,
    onConfirm,
    title = "Confirm Submission",
    message = "Are you sure you want to submit?",
}) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalText}>{message}</Text>
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={styles.noButton}
                            onPress={onClose}
                        >
                            <Text style={styles.noButtonText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.yesButton}
                            onPress={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            <Text style={styles.yesButtonText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        width: "85%",
        padding: 30,
        borderRadius: 10,
        alignItems: "start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        paddingLeft: 4,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 40,
        paddingLeft: 4,
        color: "#666",
        textAlign: "start",
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    noButton: {
        flex: 1,
        marginRight: 10,
        backgroundColor: "#f5f5f5",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    noButtonText: {
        color: "#000",
        fontSize: 16,
    },
    yesButton: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: "#000",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    yesButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default ConfirmationModal;
