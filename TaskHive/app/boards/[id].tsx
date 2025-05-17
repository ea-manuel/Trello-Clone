// app/boards/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PRIMARY_COLOR = "#34495e";

export default function BoardDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse the board param (JSON string)
  const board = params.board ? JSON.parse(params.board as string) : null;

  return (
    <View style={styles.container}>
      {/* Top bar with only back button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{board?.title ?? "Board"}</Text>
      </View>
      {/* Board Title in the center */}
      <View style={styles.content}>
        <View>
          <TouchableOpacity>
            <Ionicons name='add' size={25} color='white'/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ADD8E6",
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
    paddingTop: 25,
    left:10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    left:30,
    top:15,
    alignItems:'center',
  }
});
