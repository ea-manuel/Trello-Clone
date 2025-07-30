import { useColorScheme } from "@/hooks/useColorScheme";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import {
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image
} from "react-native";
import {ThemeProvider} from "../ThemeContext";
import CreateWorkspaceModal from "@/components/CreateWorkspaceModal";
import EditWorkspaceModal from "@/components/EditWorkspaceModal";
import Header from "@/components/Header";
import WorkspaceMenuModal from "@/components/WorkspaceMenuModal"; // Import the new modal
import ChatSection from "@/components/ChatSection";
import ChatModal from "@/components/ChatModal";
import { useWorkspaceStore } from "../app/stores/workspaceStore";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

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

// InitialCircle component
const InitialCircle = ({ text, backgroundColor }) => (
  <View
    style={[
      styles.initialCircle,
      { backgroundColor: backgroundColor || getRandomColor() },
    ]}
  >
    <Text style={styles.initialText}>
      {text ? text.charAt(0).toUpperCase() : "W"}
    </Text>
  </View>
);

export default function RootLayout() {
  const { workspaces, setCurrentWorkspaceId, deleteWorkspace, initializeStore } = useWorkspaceStore();
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
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedWorkspaceIds, setSelectedWorkspaceIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatOptions, setChatOptions] = useState({ conversationId: null, filter: null });

  // Initialize store when app starts
  useEffect(() => {
    initializeStore();
  }, []);

  // Assume you have a user object or username from your auth system
  // For demo, hardcoding username:
  //const username = "JohnDoe";

  if (!loaded) return null;

  const handleOpenChat = (options: any) => {
    setChatOptions(options || {});
    setChatModalVisible(true);
  };

  return (
    <ThemeProvider>
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
          const modifiedWorkspaces = workspaces.map((ws: any, idx: number) => {
            if (idx === 0) {
              return {
                ...ws,
                name: `Default workspace`
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
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={styles.workspacesHeader}>Workspaces</Text>
                {!selectionMode && (
                  <TouchableOpacity onPress={() => setSelectionMode(true)}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                  </TouchableOpacity>
                )}
                {selectionMode && (
                  <TouchableOpacity onPress={() => { setSelectionMode(false); setSelectedWorkspaceIds([]); }}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={() => setCreateModalVisible(true)} disabled={selectionMode}>
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
              {selectionMode && workspaces.length > 0 && (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginLeft: 8 }}
                  onPress={() => {
                    if (selectedWorkspaceIds.length === workspaces.length) {
                      setSelectedWorkspaceIds([]);
                    } else {
                      setSelectedWorkspaceIds(workspaces.map(ws => ws.id));
                    }
                  }}
                >
                  <Ionicons
                    name={selectedWorkspaceIds.length === workspaces.length ? "checkbox" : "square-outline"}
                    size={22}
                    color="#00C6AE"
                  />
                  <Text style={{ color: '#fff', marginLeft: 8, fontWeight: '500' }}>Select All</Text>
                </TouchableOpacity>
              )}
              {modifiedWorkspaces.map((workspace) => (
                <View key={workspace.id} style={styles.workspaceRow}>
                  {selectionMode && (
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedWorkspaceIds.includes(workspace.id)) {
                          setSelectedWorkspaceIds(selectedWorkspaceIds.filter(id => id !== workspace.id));
                        } else {
                          setSelectedWorkspaceIds([...selectedWorkspaceIds, workspace.id]);
                        }
                      }}
                      style={{ marginRight: 8 }}
                    >
                      <Ionicons
                        name={selectedWorkspaceIds.includes(workspace.id) ? "checkbox" : "square-outline"}
                        size={22}
                        color={selectedWorkspaceIds.includes(workspace.id) ? "#00C6AE" : "#fff"}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.workspaceItem,
                      workspace.id === currentWorkspaceId &&
                        styles.activeWorkspaceItem
                    ]}
                    onPress={() => {
                      if (selectionMode) {
                        if (selectedWorkspaceIds.includes(workspace.id)) {
                          setSelectedWorkspaceIds(selectedWorkspaceIds.filter(id => id !== workspace.id));
                        } else {
                          setSelectedWorkspaceIds([...selectedWorkspaceIds, workspace.id]);
                        }
                        return;
                      }
                      setCurrentWorkspaceIdLocal(workspace.id);
                      setCurrentWorkspaceId(workspace.id);
                      router.push({
                        pathname: "/(tabs)",
                        params: { workspaceId: workspace.id }
                      });
                    }}
                    onLongPress={() => {
                      if (!selectionMode) {
                        setSelectedWorkspace(workspace);
                        setEditModalVisible(true);
                      }
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
                  {!selectionMode && (
                    <TouchableOpacity
                      onPress={() => openMenuForWorkspace(workspace)}
                      style={styles.menuButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={styles.menuButtonText}>⋯</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {/* Chat Section */}
              <ChatSection
                styles={styles}
              />
              {/* Floating Bulk Delete FAB */}
              {selectionMode && selectedWorkspaceIds.length > 0 && (
                <View style={{ position: 'absolute', right: 24, bottom: 32, zIndex: 2000, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ backgroundColor: '#fff', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 14, marginRight: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
                    <Text style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: 16 }}>{selectedWorkspaceIds.length} selected</Text>
                  </View>
                  <TouchableOpacity
                    style={{ backgroundColor: '#e74c3c', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 8, elevation: 6 }}
                    onPress={async () => {
                      Alert.alert(
                        "Delete Workspaces",
                        `Are you sure you want to delete ${selectedWorkspaceIds.length} workspaces? This action cannot be undone.`,
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: async () => {
                              setBulkLoading(true);
                              setBulkProgress({ current: 0, total: selectedWorkspaceIds.length });
                              try {
                                for (let i = 0; i < selectedWorkspaceIds.length; i++) {
                                  await deleteWorkspace(selectedWorkspaceIds[i]);
                                  setBulkProgress({ current: i + 1, total: selectedWorkspaceIds.length });
                                }
                                setSelectedWorkspaceIds([]);
                                setSelectionMode(false);
                              } catch (e) {
                                Alert.alert("Delete Failed", "Could not delete all workspaces. Please try again.");
                              } finally {
                                setTimeout(() => setBulkLoading(false), 800);
                              }
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Ionicons name="trash" size={28} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              {/* Loader for bulk delete */}
              {bulkLoading && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 1000 }}>
                  <BlurView style={StyleSheet.absoluteFill} intensity={40} tint="light" />
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <StatusBar style="light" />
                    <Ionicons name="trash" size={48} color="#e74c3c" />
                    <Text style={{ marginTop: 16, fontWeight: 'bold', fontSize: 18, color: '#e74c3c' }}>
                      Deleting {bulkProgress.current} of {bulkProgress.total} workspaces...
                    </Text>
                    <View style={{ width: 180, height: 8, backgroundColor: '#eee', borderRadius: 4, marginTop: 16, overflow: 'hidden' }}>
                      <View style={{ width: `${bulkProgress.total ? (bulkProgress.current / bulkProgress.total) * 100 : 0}%`, height: 8, backgroundColor: '#e74c3c', borderRadius: 4 }} />
                    </View>
                  </View>
                </View>
              )}
             <CreateWorkspaceModal
  visible={createModalVisible}
  onClose={() => setCreateModalVisible(false)}
  onCreate={() => {
    setCreateModalVisible(false);
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
          header: () => {
            // Hide header on splash screen and auth screens
            const hideHeaderPaths = [
              "/splash",
              "/index",
              "/auth/login",
              "/auth/welcome", 
              "/auth/signup",
              "/templates",
              "/help"
            ];
            
            const shouldHideHeader = 
              createModalVisible ||
              editModalVisible ||
              hideHeaderPaths.includes(pathname) ||
              pathname.includes("OfflineBoards") ||
              pathname.includes("SearchScreen") ||
              pathname.includes("NotificationScreen") ||
              pathname.includes("SplashScreen") ||
              pathname.startsWith("/boards");
            
            return shouldHideHeader ? null : <Header />;
          },
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
      <ChatModal
        visible={chatModalVisible}
        onClose={() => setChatModalVisible(false)}
        styles={styles}
        chatOptions={chatOptions}
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
