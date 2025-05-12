import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import "../global.css";

export default function Header() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#90EE90", "#0077B6"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          className="flex-row items-center pb-5"
        >
          <Ionicons name="person-circle" size={35} color="white" />{" "}
          <Text style={styles.headerText} className="text-3xl">User@31...</Text>
        </TouchableOpacity>
        <Ionicons
          name="search"
          size={28}
          color="white"
          style={styles.searchicon}
        />
        <Ionicons
          name="notifications-outline"
          size={28}
          color="white"
          style={styles.notificationicon}
        />
        <Ionicons
          name="settings-outline"
          size={28}
          color="white"
          style={styles.settingsicon}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  mainpage: {
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    height: 100,
    backgroundColor: "#0000FF",
    // justifyContent: 'center',
    paddingTop: 50,
    textAlign: "left",
    display: "flex",
    flexDirection: "row",
    paddingLeft: 10
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 11,
    bottom: -3
    // right:-60
  },
  body: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  maintext: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#36454F"
  },
  subtext: {
    fontSize: 18,
    fontWeight: "medium",
    color: "#808080"
  },

  searchicon: {
    marginTop: 7,
    left: 80
  },
  notificationicon: {
    marginTop: 7,
    left: 100
  },
  settingsicon: {
    marginTop: 7,
    left: 120
  },

  createBoardButton: {
    bottom: -220,
    left: 120
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 15
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    bottom: 5
  },
  addicon: {
    bottom: -7
  },
  footer: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 10
  },
  workspaceicon: {}
});
