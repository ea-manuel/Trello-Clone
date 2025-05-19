import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SettingsModal from "./SettingsModal"; // Adjust path as needed

const PRIMARY_COLOR = "#34495e";

export default function Header() {
  const navigation = useNavigation();

  // Control modal visibility here
  const [isSettingsVisible, setSettingsVisible] = useState(false);

  return (
    <View style={styles.mainpage}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.userContainer}
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle" size={35} color="white" />
          <Text style={styles.headerText}>User@31...</Text>
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconButton}
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Modal */}
      <SettingsModal
        visible={isSettingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainpage: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 20,
  },
});
