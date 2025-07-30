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
import { useNotificationStore } from "../app/stores/notificationsStore";

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
  
  // Show "Default workspace" for the first workspace to match the side drawer
  let workspaceName = "Workspace";
  if (currentWorkspace) {
    if (workspaces.length > 0 && currentWorkspace.id === workspaces[0].id) {
      workspaceName = "Default workspace";
    } else {
      workspaceName = currentWorkspace.name;
    }
  }

  const unreadCount = useNotificationStore((state) => state.notifications.filter(n => !n.read).length);

  const HeaderContent = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.userContainer}
        activeOpacity={0.7}
      >
        <Ionicons name="menu-sharp" size={35} color="white" />
        <Text style={styles.headerText}>{workspaceName}</Text>
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
          {unreadCount > 0 && (
            <View style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#2ecc40',
              borderWidth: 2,
              borderColor: 'white',
            }} />
          )}
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
          colors={["#05080B", "#09034E"]}
          start={{ x: 0, y: 1.0 }}
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
