import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useWorkspaceStore } from "../stores/workspaceStore";

interface Board {
  id: string;
  title: string;
}

export default function OfflineBoards() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { workspaces, getBoards } = useWorkspaceStore();

  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>({});

  const workspaceId = params.workspaceId;
  const selectedWorkspace = workspaceId
    ? workspaces.find(ws => ws.id === workspaceId) || workspaces[0]
    : workspaces[0];

  // Initialize switch states for boards
  useEffect(() => {
    if (selectedWorkspace) {
      const fetchedBoards = getBoards(selectedWorkspace.id);
      const initialSwitchStates = fetchedBoards.reduce((acc, board) => ({
        ...acc,
        [board.id]: false
      }), {});
      setSwitchStates(initialSwitchStates);
      console.log('OfflineBoards: Loaded boards for workspace', selectedWorkspace.id, ':', JSON.stringify(fetchedBoards, null, 2));
    }
  }, [selectedWorkspace, getBoards]);

  const toggleSwitch = (boardId) => {
    setSwitchStates((prev) => ({
      ...prev,
      [boardId]: !prev[boardId]
    }));
  };

  const navigateBack = () => {
    router.push({
      pathname: "/(tabs)",
    });
  };

  return (
    <View style={styles.mainpage}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Offline Boards</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {getBoards(selectedWorkspace.id).length > 0 && (
        <Text style={styles.headerText}>Boards</Text>
      )}

      <FlatList
        contentContainerStyle={styles.scrollContent}
        data={getBoards(selectedWorkspace.id)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.boardcard}>
            <TouchableOpacity
              onPress={() => {
                console.log('OfflineBoards: Navigating to board:', item.id);
                router.push({
                  pathname: "/boards/[id]",
                  params: { id: item.id, board: JSON.stringify(item) }
                });
              }}
              style={styles.boardcardTouchable}
            >
              <Ionicons name="grid" size={30} color="#34495e" />
              <Text style={styles.boardcardText}>{item.title}</Text>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={switchStates[item.id] ? "#339dff" : "#f4f3f4"}
              onValueChange={() => toggleSwitch(item.id)}
              value={switchStates[item.id]}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Boards</Text>
            <Text style={styles.emptySubText}>No boards available for this workspace</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainpage: {
    flex: 1,
    backgroundColor: "white"
  },
  headerText: {
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 24,
    color: "gray",
    marginBottom: 10
  },
  topBar: {
    height: 110,
    backgroundColor: "#0B1F3A",
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    bottom: 20
  },
  backButton: {
    padding: 10
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "left"
  },
  iconContainer: {
    flexDirection: "row",
    position: "absolute",
    right: -5,
    top: 50,
    alignItems: "center"
  },
  iconButton: {
    padding: 10
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingVertical: 20
  },
  boardcard: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderTopColor: "#34495e",
    borderBottomColor: "#34495e",
    borderWidth: 0.5,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 8,
    marginVertical: 5,
    marginHorizontal: 0
  },
  boardcardTouchable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  boardcardText: {
    color: "black",
    fontWeight: "500",
    fontSize: 22,
    marginLeft: 15
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center"
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333"
  },
  emptySubText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#808080",
    marginBottom: 20,
    textAlign: 'center',
  }
});