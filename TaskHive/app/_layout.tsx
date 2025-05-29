import Header from "@/components/Header";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { usePathname, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";

import { DrawerContentScrollView } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });

  const router = useRouter();
  const workspaces = ["Marketing", "Design", "Personal"];

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Drawer
        drawerContent={(props) => (
          <DrawerContentScrollView
            {...props}
            style={{ backgroundColor: "#0B1F3A", flex: 1 }}
          >
            {/* Workspaces Header */}
            <Text style={styles.workspacesHeader}>Workspaces</Text>

            {/* Create Workspace Button */}
            <TouchableOpacity onPress={() => {}}>
              <LinearGradient
                colors={["#00C6AE", "#007CF0"]}
                style={styles.createWorkspaceButton}
                start={{ x: 0, y: 0 }} // Optional: Adjust gradient direction
                end={{ x: 1, y: 0 }} // Optional: Adjust gradient direction
              >
                <Text style={styles.createWorkspaceButtonText}>
                  + Create Workspace
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Your Workspaces Label */}
            <Text style={styles.yourWorkspacesLabel}>Your Workspaces</Text>

            {/* List of Workspaces */}
            {workspaces.map((workspace, index) => (
              <TouchableOpacity
                key={index}
                style={styles.workspaceItem}
                onPress={() => {}}
              >
                <View style={styles.workspaceIndicator} />
                <Text style={styles.workspaceText}>{workspace}</Text>
              </TouchableOpacity>
            ))}
          </DrawerContentScrollView>
        )}
        screenOptions={{
          header:
            pathname !== "/auth/login" &&
            pathname !== "/templates" &&
            pathname !=="/auth/signup"&&
            !pathname.startsWith("/boards")
              ? (props) => <Header {...props} />
              : () => null,
          drawerStyle: {
            backgroundColor: colorScheme === "dark" ? "#0B1F3A" : "#34495e"
          },
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#ccc"
        }}
      />

      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
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
    backgroundColor: "#2ECC71", // Example Green Color
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
    backgroundColor: "#2980B9", // Example Blue Color
    marginRight: 10
  },
  workspaceText: {
    color: "white",
    fontSize: 16
  }
});
