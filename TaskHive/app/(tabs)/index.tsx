import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import bee from '../../assets/images/bee.png';
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import { useWorkspaceStore } from '../stores/workspaceStore'; // Import the hook
import { useTheme } from "../../ThemeContext";
import {lightTheme,darkTheme} from "../../styles/themes";
export default function HomeScreen() {
  const {theme,toggleTheme}=useTheme();
  const styles = theme === "dark" ? darkTheme : lightTheme;
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  type Board = {
    id: string;
    title: string;
    workspaceId: string;
    backgroundColor: string;
    lists: any[]; // Replace 'any' with your actual list type if available
  };
  
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardTitle, setBoardTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
  const [longPressedBoardId, setLongPressedBoardId] = useState<string | null>(null);

  // Access store methods and state via the hook
  const { workspaces, getBoards, createBoard } = useWorkspaceStore();

  // Get selected workspace based on params or default to first workspace
  const workspaceId = params.workspaceId as string;
  const selectedWorkspace = workspaceId
    ? workspaces.find(ws => ws.id === workspaceId) || workspaces[0]
    : workspaces[0];

  // Load boards for selected workspace
  useEffect(() => {
    if (selectedWorkspace) {
      const fetchedBoards = getBoards(selectedWorkspace.id);
      setBoards(fetchedBoards);
      console.log('HomeScreen: Current boards state for workspace', selectedWorkspace.id, ':', JSON.stringify(fetchedBoards, null, 2));
    }
  }, [selectedWorkspace]);

  // Handle updated board from BoardDetails
  useEffect(() => {
    if (params.board) {
      try {
        const updatedBoard = JSON.parse(params.board as string);
        console.log('HomeScreen: Received updated board:', JSON.stringify(updatedBoard, null, 2));
        setBoards(prev => {
          const newBoards = prev.map(board =>
            board.id === updatedBoard.id ? { ...board, ...updatedBoard } : board
          );
          console.log('HomeScreen: Updated boards state:', JSON.stringify(newBoards, null, 2));
          return newBoards;
        });
      } catch (e) {
        console.error("HomeScreen: Failed to parse updated board:", e);
      }
    }
  }, [params.board]);

  const handleCreateBoard = () => {
    if (!boardTitle.trim()) return;
    const newBoard = createBoard({
      title: boardTitle,
      workspaceId: selectedWorkspace.id,
      backgroundColor: "#ADD8E6",
      lists: []
    });
    setBoards(prev => [...prev, newBoard]);
    setShowModal(false);
    setBoardTitle("");
    console.log('HomeScreen: Created new board:', JSON.stringify(newBoard, null, 2));
    router.push({
      k: "/boards/[id]",
      params: { id: newBoard.id, board: JSON.stringify(newBoard) }
    });
  };


  const handleLongPress = (boardId: string) => {
    setLongPressedBoardId(boardId);
    console.log('HomeScreen: Long pressed board:', boardId);
  };

  const handleDeleteBoard = (boardId: string) => {
    setBoardToDelete(boardId);
    setShowDeleteModal(true);
  };

  const confirmDeleteBoard = () => {
    if (boardToDelete !== null) {
      setBoards(prev => {
        const newBoards = prev.filter(board => board.id !== boardToDelete);
        console.log('HomeScreen: Deleted board', boardToDelete, 'New boards:', JSON.stringify(newBoards, null, 2));
        return newBoards;
      });
      setShowDeleteModal(false);
      setBoardToDelete(null);
      setLongPressedBoardId(null);
    }
  };
  const quickActions = [
  {
    id: "createBoard",
    title: "Create Board",
    icon: "add-circle-outline",
    onPress: () => setShowModal(true),
  },
  {
    id: "favorites",
    title: "Favorites",
    icon: "heart-outline",
    onPress: () => console.log("Favorites pressed"),
  },
  {
    id: "recent",
    title: "Recent",
    icon: "time-outline",
    onPress: () => console.log("Recent pressed"),
  },
  {
    id: "settings",
    title: "Settings",
    icon: "settings-outline",
    onPress: () => router.push("/settings"),
  },
];


  return (
  <View style={styles.mainpage}>

    {/* Quick Actions Container */}
    <View style={styles.quickActionsWrapper}>
  <Text style={styles.quickActionsHeading}>
    Welcome back 👋
  </Text>
  <Text style={styles.quickActionsSubheading}>
    What do you want to do today?
  </Text>

  <View style={styles.quickActionsGrid}>

        {quickActions.map((action) => {
          // Optional: Add border styles by action.id if you want different border colors
          let borderStyle = {};
          switch (action.id) {
            case "createBoard":
              borderStyle = styles.borderCreateBoard;
              break;
            case "favorites":
              borderStyle = styles.borderFavorites;
              break;
            case "recent":
              borderStyle = styles.borderRecent;
              break;
            case "settings":
              borderStyle = styles.borderSettings;
              break;
          }
          return (
            <TouchableOpacity
              key={action.id}
              onPress={action.onPress}
              style={[styles.quickActionCard, borderStyle]}
              activeOpacity={0.85}
            >
              <Ionicons
                name={action.icon}
                size={36}
                color={theme === "dark" ? "white" : "#0B1F3A"} // or any color that contrasts well with light bg
              />

              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>

    {/* Boards Title */}
{boards.length > 0 && (
  <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
    <Text
      style={{
        fontWeight: "bold",
        fontSize: 24,
        color: theme === "dark" ? "white" : "#333",
      }}
    >
      Boards
    </Text>
  </View>
)}


    {/* Boards List */}
    <FlatList
      contentContainerStyle={styles.scrollContent}
      data={boards}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.boardcard}>
          <TouchableOpacity
            onPress={() => {
              console.log('HomeScreen: Navigating to board:', item.id);
              setLongPressedBoardId(null); // Reset long press state on tap
              router.push({
                pathname: `/boards/${item.id}`,
                params: { board: JSON.stringify(item) }
              });
            }}
            onLongPress={() => handleLongPress(item.id)}
            style={styles.boardcardTouchable}
          >
            <Ionicons name="grid" size={30} color="#34495e" />
            <Text style={styles.boardcardText}>{item.title}</Text>
          </TouchableOpacity>
          {longPressedBoardId === item.id && (
            <TouchableOpacity
              onPress={() => handleDeleteBoard(item.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={24} color="#e74c3c" />
            </TouchableOpacity>
          )}
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          {/* <Image source={bee} style={{ width: 300, height: 300 }} /> */}
          <Text style={styles.emptyText}>No Boards</Text>
          <Text style={styles.emptySubText}>Create Your First Task Board</Text>
        </View>
      }
    />

      {showModal && (
        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalBackground}>
            <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Enter Board Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sprint Tasks"
                value={boardTitle}
                onChangeText={setBoardTitle}
              />
              <View style={styles.modalButtons}>
                <View style={styles.createButton}>
                  <Button
                    title="Create"
                    onPress={handleCreateBoard}
                    color="#0B1F3A"
                  />
                </View>
                <View style={styles.cancelButton}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowModal(false)}
                    color="#ADD8E6"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal visible={showDeleteModal} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Delete Board</Text>
              <Text style={styles.modalText}>
                Are you sure you want to delete this board? This action cannot be undone.
              </Text>
              <View style={styles.modalButtons}>
                <View style={styles.deleteConfirmButton}>
                  <Button
                    title="Delete"
                    onPress={confirmDeleteBoard}
                    color="red"
                  />
                </View>
                <View style={styles.cancelButton}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setShowDeleteModal(false);
                      setBoardToDelete(null);
                    }}
                    color="#ADD8E6"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* <View style={styles.createBoardButton}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.button}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.buttonText}>Create Board</Text>
          </View>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}
 