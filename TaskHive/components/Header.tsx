import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import SettingsModal from "./SettingsModal";
import { getWorkspaces } from "../app/stores/workspaceStore";
import {Link,useRouter} from "expo-router";

const PRIMARY_COLOR = "#0B1F3A";

export default function Header() {
  const navigation = useNavigation();
  const router = useRouter();
  const { workspaceId } = useLocalSearchParams();
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("Workspace");

  // Update workspace name based on workspaceId
  useEffect(() => {
    const workspaces = getWorkspaces();
    const selectedWorkspace = workspaceId
      ? workspaces.find(ws => ws.id === workspaceId) || workspaces[0]
      : workspaces[0];
    if (selectedWorkspace) {
      setWorkspaceName(selectedWorkspace.name);
      console.log('Header: Updated workspace name to', selectedWorkspace.name, 'for workspaceId', workspaceId);
    } else {
      console.log('Header: No workspace found for workspaceId', workspaceId);
    }
  }, [workspaceId]);

  return (
    <View style={styles.mainpage}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.userContainer}
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle" size={35} color="white" />
          <Text style={styles.headerText}>{workspaceName}</Text>
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}
            onPress={() => {
              router.push({
                pathname: "/screens/SearchScreen",
               
              });
            }}>
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
          <SettingsModal
            visible={isSettingsVisible}
            onClose={() => setSettingsVisible(false)}
          />
        </View>
      </View>
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