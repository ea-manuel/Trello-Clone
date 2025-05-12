// components/ui/TabBarBackground.tsx
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

export default function TabBarBackground() {
  return (
    <LinearGradient
      colors={["#76C68F", "#005F94"]} // Your gradient colors (green to blue)
      start={{ x: 0, y: 0 }} // Gradient start point (left)
      end={{ x: 1, y: 0 }} // Gradient end point (right)
      style={styles.gradient} // Fill the available space
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1 // Take up all available space of the tab bar background
  }
});
