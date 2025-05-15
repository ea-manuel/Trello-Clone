import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import "../global.css";

import type { DrawerHeaderProps } from "@react-navigation/drawer";

const PRIMARY_COLOR = "#1F80E0";

export default function Header(props: DrawerHeaderProps) {
  const router = useRouter();
  const navigation = useNavigation();
  return (
    <View style={styles.mainpage}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          className=""
        >
          <Ionicons name="person-circle" size={35} color="white" />{" "}
          <Text style={styles.headerText}>User@31...</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", right: -30 }}>
          <TouchableOpacity>
            <Ionicons
              name="search"
              size={24}
              color="white"
              style={styles.searchicon}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="white"
              style={styles.notificationicon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Ionicons
              name="settings-outline"
              size={24}
              color="white"
              style={styles.settingsicon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainpage: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 20
  },
  header: {
    height: 90,
    backgroundColor: PRIMARY_COLOR, // Use your primary color here
    paddingTop: 40,
    textAlign: "left",
    display: "flex",
    flexDirection: "row",
    paddingLeft: 10,
    bottom: 10
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 13,
    bottom: 30,
    left: 30
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
    left: 90
  },
  notificationicon: {
    marginTop: 7,
    left: 110
  },
  settingsicon: {
    marginTop: 7,
    left: 130
  },

  createBoardButton: {
    bottom: -220,
    left: 120
  },
  button: {
    backgroundColor: PRIMARY_COLOR, // Use primary color for buttons too!
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
