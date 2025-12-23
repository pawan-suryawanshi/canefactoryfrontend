// CustomToast.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomToast = ({ toast }) => {
    const { type, message } = toast;
    return (
        <View style={[styles.toastContainer, styles[type]]}>
            <Text style={styles.toastText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        padding: 10,
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    toastText: {
        color: 'white',
        fontWeight: 'bold',
    },
    success: {
        backgroundColor: 'green',
    },
    error: {
        backgroundColor: 'red',
    },
    info: {
        backgroundColor: 'blue',
    },
});

export default CustomToast;
