// src/components/ScreenWrapper.js
import React from "react";
import { View, StyleSheet } from "react-native";

export default function ScreenWrapper({ children, style }) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#696969", // ✅ global background
  },
});
