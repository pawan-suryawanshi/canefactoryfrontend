// Dropdown.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { FontAwesome6 } from 'react-native-vector-icons';

const Dropdown = ({ label, items, placeholder, selectedValue, onSelect }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (item) => {
        onSelect(item.value);
        setModalVisible(false);
    };

    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setModalVisible(true)}
            >
                <Text
                    style={
                        [styles.selectedText, { color: selectedValue ? "#000" : "#aaa" }]
                    }>
                    {selectedValue || placeholder}
                </Text>
                <FontAwesome6 style={styles.iconStyle} name="chevron-down" size={22} color="#666" />
            </TouchableOpacity>
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.modalItemText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#333",
    },
    dropdown: {
        fontSize: 16,
        borderColor: "#ccc",
        backgroundColor: "#f9f9f9",
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    selectedText: {
        color: "#000",
        fontSize: 16,
        flex: 1,
    },
    iconStyle: {
        position: 'absolute',
        right: 15, // Adjust this value to move the icon to the desired position
    },
    modalBackground: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: "70%",
    },
    modalItem: {
        padding: 16,
    },
    modalItemText: {
        color: "#000",
        fontSize: 16,
    },
});

export default Dropdown;
