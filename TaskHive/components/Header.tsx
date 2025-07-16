import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // ✅ Add this
import { useWorkspaceStore } from "../app/stores/workspaceStore";
import NotificationsModal from "./NotificationModal";
import SearchModal from "./SearchModal";
import SettingsModal from "./SettingsModal";
import { useTheme } from "../ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";

export default function Header() {
  const navigation = useNavigation();
  const router = useRouter();
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const { theme } = useTheme();
  const styles = theme === "dark" ? darkTheme : lightTheme;

  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId
  );

  const currentWorkspace = workspaces.find(
    (ws) => ws.id === currentWorkspaceId
  );
  const workspaceName = currentWorkspace ? currentWorkspace.name : "Workspace";

  const HeaderContent = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.userContainer}
        activeOpacity={0.7}
      >
        <Ionicons name="menu-sharp" size={35} color="white" />
        <Text style={styles.headerText}>{workspaceName} Workspace</Text>
      </TouchableOpacity>

      <View style={styles.rightIcons}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.iconButton}
          onPress={() => setSearchVisible(true)}
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
  );

  return (
    <View>
      {theme === "dark" ? (
        <LinearGradient
          colors={["#05080B", "#375071"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 2.9 }} // 70% blend then full blue
          style={styles.Headermainpage}
        >
          <HeaderContent />
        </LinearGradient>
      ) : (
        <View style={styles.Headermainpage}>
          <HeaderContent />
        </View>
      )}

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
