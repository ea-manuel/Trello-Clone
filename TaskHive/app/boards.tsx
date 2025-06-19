import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PRIMARY_COLOR = "0B1F3A";

export default function BoardDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // Expecting board param as a JSON string
  const board = params.board ? JSON.parse(params.board as string) : null;

  return (
    <View style={styles.container}>
      {/* Top bar with only back button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#1F80E0" />
        </TouchableOpacity>
      </View>
      {/* Board Title in the center */}
      <View style={styles.content}>
        <Text style={styles.title}>{board?.title ?? "Board"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    color: "black"
  },
  topBar: {
    height: 110,
    backgroundColor: PRIMARY_COLOR, // Use your primary color here
    paddingTop: 40,
    textAlign: "left",
    display: "flex",
    flexDirection: "row",
    paddingLeft: 10,
    bottom: 20
  },
  backButton: {
    paddingTop: 25
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#34495e",
    textAlign: "center"
  }
});
