import CreateWorkspaceModal from "@/components/CreateWorkspaceModal";
import EditWorkspaceModal from "@/components/EditWorkspaceModal";
import Header from "@/components/Header";
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
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useWorkspaceStore } from "../app/stores/workspaceStore";

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
  };
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Drawer
        drawerContent={(props) => {
          const navState = props.navigation.getState();
          const workspaceId =
            navState?.routes[navState.index]?.params?.workspaceId ||
            (workspaces.length > 0 ? workspaces[0].id : null);
          console.log("Layout: Current workspaceId", workspaceId);
          const [currentWorkspaceId, setCurrentWorkspaceIdLocal] = useState(
            workspaces.length > 0 ? workspaces[0].id : null
          );

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
              {workspaces.map((workspace) => (
                <TouchableOpacity
                  key={workspace.id}
                  style={[
                    styles.workspaceItem,
                    workspace.id === currentWorkspaceId && styles.activeWorkspaceItem
                  ]}
                  onPress={() => {
                    console.log("Layout: Navigating to workspaceId", workspace.id);
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
                  <Text style={styles.workspaceText}>{workspace.name}</Text>
                </TouchableOpacity>
              ))}
              <CreateWorkspaceModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onCreate={() => setCreateModalVisible(false)}
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
            </DrawerContentScrollView>
          );
        }}
        screenOptions={{
          header: () =>
            // Hide header if either modal is visible or pathname matches exclusions
            createModalVisible || editModalVisible ||
            pathname === "/auth/login" ||
            pathname === "/auth/welcome" ||
            pathname === "/templates" ||
            pathname === "/auth/signup" ||
            pathname === "/screens/SearchScreen" ||
            pathname === "/screens/NotificationScreen" ||
            pathname.startsWith("/boards")
              ? null
              : <Header />,
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
  workspaceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  workspaceIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2980B9",
    marginRight: 10
  },
  workspaceText: {
    color: "white",
    fontSize: 16
  },
  activeWorkspaceItem: {
    backgroundColor: "#1A324F",
    borderRadius: 8
  },
});