import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useWorkspaceStore } from "../app/stores/workspaceStore";
import NotificationsModal from "./NotificationModal";
import SearchModal from "./SearchModal"; // Import SearchModal
import SettingsModal from "./SettingsModal";

const PRIMARY_COLOR = "#0B1F3A";

export default function Header() {
  const navigation = useNavigation();
  const router = useRouter();
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false); // Search modal state

  // Zustand store
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId
  );

  const currentWorkspace = workspaces.find(
    (ws) => ws.id === currentWorkspaceId
  );
  const workspaceName = currentWorkspace ? currentWorkspace.name : "Workspace";

  return (
    <View style={styles.mainpage}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.userContainer}
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle" size={35} color="white" />
          <Text style={styles.headerText}>{workspaceName} Workspace</Text>
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconButton}
            onPress={() => setSearchVisible(true)} // Open search modal
          >
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconButton}
            onPress={() => setNotificationsVisible(true)}
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconButton}
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
          <SettingsModal
            visible={isSettingsVisible}
            onClose={() => setSettingsVisible(false)}
          />
        </View>
      </View>

      {/* Modals */}
      <NotificationsModal
        visible={isNotificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
      <SearchModal
        visible={isSearchVisible}
        onClose={() => setSearchVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainpage: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 20,
    paddingHorizontal: 10
  },
  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconButton: {
    marginLeft: 10
  }
});
