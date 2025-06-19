import React from "react";
import { StyleSheet, View } from "react-native";

const PRIMARY_COLOR = "#0B1F3a";

export default function TabBarBackground() {
  return <View style={styles.background} />;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR // Use the primary color as solid background
  }
});
