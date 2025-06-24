import { useColorScheme } from "@/hooks/useColorScheme";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from "react-native";

import CreateWorkspaceModal from "@/components/CreateWorkspaceModal";
import EditWorkspaceModal from "@/components/EditWorkspaceModal";
import Header from "@/components/Header";
import WorkspaceMenuModal from "@/components/WorkspaceMenuModal"; // Import the new modal
import { useWorkspaceStore } from "../app/stores/workspaceStore";
import axios from "axios";

const BADGE_COLORS = [
  "#2980B9",
  "#00C6AE",
  "#007CF0",
  "#636B2F",
  "#8E44AD",
  "#FF7F7F",
  "#FFA500"
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * BADGE_COLORS.length);
  return BADGE_COLORS[randomIndex];
};

const InitialCircle = ({ text, backgroundColor }) => {
  const initial = text ? text.charAt(0).toUpperCase() : "?";
  return (
    <View style={[styles.initialCircle, { backgroundColor }]}>
      <Text style={styles.initialText}>{initial}</Text>
    </View>
  );
};

export default function RootLayout() {
  const { workspaces, setCurrentWorkspaceId } = useWorkspaceStore();
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });
  const router = useRouter();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  type Workspace = {
    id: string;
    name: string;
    visibility: string;
    createdAt: number;
    badgeColor: string; // New property
  };
  // const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [menuWorkspace, setMenuWorkspace] = useState(null);

  // Assume you have a user object or username from your auth system
  // For demo, hardcoding username:
  const username = "JohnDoe";

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Drawer
        drawerContent={(props) => {
          const navState = props.navigation.getState();
          const params = navState?.routes[navState.index]?.params;
          const workspaceId =
            params && typeof params === "object" && "workspaceId" in params
              ? params.workspaceId
              : workspaces.length > 0
              ? workspaces[0].id
              : null;
          const [currentWorkspaceId, setCurrentWorkspaceIdLocal] = useState(
            workspaces.length > 0 ? workspaces[0].id : null
          );

          // Override default workspace name with username + " workspace"
          const modifiedWorkspaces = workspaces.map((ws, idx) => {
            if (idx === 0) {
              return {
                ...ws,
                name: `${username} workspace`
              };
            }
            return ws;
          });

          const openMenuForWorkspace = (workspace) => {
            props.navigation.closeDrawer();
            setMenuWorkspace(workspace);
            setMenuModalVisible(true);
          };

          return (
            <DrawerContentScrollView
              {...props}
              style={{ backgroundColor: "#0B1F3A", flex: 1 }}
            >
              <Text style={styles.workspacesHeader}>Workspaces</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(true)}>
                <LinearGradient
                  colors={["#00C6AE", "#007CF0"]}
                  style={styles.createWorkspaceButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.createWorkspaceButtonText}>
                    + Create Workspace
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.yourWorkspacesLabel}>Your Workspaces</Text>
              {modifiedWorkspaces.map((workspace) => (
                <View key={workspace.id} style={styles.workspaceRow}>
                  <TouchableOpacity
                    style={[
                      styles.workspaceItem,
                      workspace.id === currentWorkspaceId &&
                        styles.activeWorkspaceItem
                    ]}
                    onPress={() => {
                      setCurrentWorkspaceIdLocal(workspace.id);
                      setCurrentWorkspaceId(workspace.id);
                      router.push({
                        pathname: "/(tabs)",
                        params: { workspaceId: workspace.id }
                      });
                    }}
                    onLongPress={() => {
                      setSelectedWorkspace(workspace);
                      setEditModalVisible(true);
                    }}
                  >
                    <View
                      style={[
                        styles.workspaceIndicator,
                        workspace.id !== currentWorkspaceId && {
                          backgroundColor: "transparent"
                        }
                      ]}
                    />
                    <InitialCircle
                      text={workspace.name}
                      backgroundColor={getRandomColor()}
                    />
                    <Text style={styles.workspaceText}>{workspace.name}</Text>
                  </TouchableOpacity>
                  {/* 3 dots button */}
                  <TouchableOpacity
                    onPress={() => openMenuForWorkspace(workspace)}
                    style={styles.menuButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.menuButtonText}>⋯</Text>
                  </TouchableOpacity>
                </View>
              ))}
             <CreateWorkspaceModal
  visible={createModalVisible}
  onClose={() => setCreateModalVisible(false)}
  onCreate={async (workspaceData) => {
    try {
      await useWorkspaceStore.getState().createWorkspace(workspaceData);
      setCreateModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to create workspace");
    }
  }}
/>

              {selectedWorkspace && (
                <EditWorkspaceModal
                  visible={editModalVisible}
                  onClose={() => {
                    setEditModalVisible(false);
                    setSelectedWorkspace(null);
                  }}
                  workspace={selectedWorkspace}
                  onUpdate={() => {
                    setEditModalVisible(false);
                    setSelectedWorkspace(null);
                  }}
                />
              )}
              <WorkspaceMenuModal
                visible={menuModalVisible}
                onClose={() => setMenuModalVisible(false)}
                workspace={menuWorkspace}
                onRename={() => {
                  setMenuModalVisible(false);
                  setSelectedWorkspace(menuWorkspace);
                  setEditModalVisible(true);
                }}
                onSettings={() => {
                  setMenuModalVisible(false);
                  // Navigate to settings screen or handle accordingly
                  router.push({
                    pathname: "/workspace-settings",
                    params: { workspaceId: menuWorkspace?.id }
                  });
                }}
                onDelete={() => {
                  setMenuModalVisible(false);
                  // Implement delete logic here or open a confirmation modal
                  alert(
                    `Delete workspace: ${menuWorkspace?.name} (implement delete logic)`
                  );
                }}
              />
            </DrawerContentScrollView>
          );
        }}
        screenOptions={{
          header: () =>
            createModalVisible ||
            editModalVisible ||
            pathname === "/auth/login" ||
            pathname === "/auth/welcome" ||
            pathname === "/templates" ||
            pathname === "/auth/signup" ||
            pathname.includes("OfflineBoards") ||
            pathname === "/screens/SearchScreen" ||
            pathname === "/screens/NotificationScreen" ||
            pathname.startsWith("/boards") ? null : (
              <Header />
            ),
          drawerStyle: {
            backgroundColor: colorScheme === "dark" ? "#0B1F3A" : "#34495e"
          },
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#ccc"
        }}
      />
      <StatusBar
        style={colorScheme === "dark" ? "light" : "light"}
        backgroundColor={colorScheme === "dark" ? "#34495e" : "#34495e"}
      />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  workspacesHeader: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 16,
    marginTop: 16,
    marginBottom: 8
  },
  createWorkspaceButton: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: "center"
  },
  createWorkspaceButtonText: {
    color: "white",
    fontWeight: "bold"
  },
  yourWorkspacesLabel: {
    color: "white",
    fontSize: 16,
    paddingLeft: 16,
    marginBottom: 8
  },
  workspaceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 8
  },
  workspaceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1
  },
  workspaceIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2980B9",
    marginRight: 10
  },
  initialCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8
  },
  initialText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold"
  },
  workspaceText: {
    color: "white",
    fontSize: 16
  },
  activeWorkspaceItem: {
    backgroundColor: "#1A324F",
    borderRadius: 8
  },
  menuButton: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center"
  },
  menuButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold"
  }
});
