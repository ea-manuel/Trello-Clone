import React from "react";
import { StyleSheet, View } from "react-native";

const PRIMARY_COLOR = "#34495e";

export default function TabBarBackground() {
  return <View style={styles.background} />;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR // Use the primary color as solid background
  }
});
