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
import { getWorkspaces, getBoards, createBoard } from '../stores/workspaceStore';


export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [boards, setBoards] = useState<{
    id: string;
    title: string;
    workspaceId: string;
    backgroundColor: string;
    createdAt: number;
    lists: { id: string; title: string; cards: { text: string; completed: boolean }[]; editingTitle: boolean; newCardText: string }[];
  }[]>([]);
  const [boardTitle, setBoardTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
  const [longPressedBoardId, setLongPressedBoardId] = useState<string | null>(null);

  // Get selected workspace based on params or default to first workspace
  const workspaceId = params.workspaceId as string;
  const selectedWorkspace = workspaceId
    ? getWorkspaces().find(ws => ws.id === workspaceId) || getWorkspaces()[0]
    : getWorkspaces()[0];

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
      pathname: `/boards/${newBoard.id}`,
      params: { board: JSON.stringify(newBoard) }
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

  return (
    <View style={styles.mainpage}>
      {boards.length > 0 && (
        <Text
          style={{
            alignItems: "center",
            marginTop: 10,
            marginLeft: 10,
            fontWeight: "bold",
            fontSize: 24,
            color: "gray",
            marginBottom: -80
          }}
        >
          Boards
        </Text>
      )}

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
            <Image source={bee} style={{ width: 300, height: 300 }} />
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

      <View style={styles.createBoardButton}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainpage: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingVertical: 20,
    marginTop: 80,
  },
  boardcard: {
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    borderColor: "#34495e",
    borderWidth: 0.5,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 8,
    marginVertical: 5,
  },
  boardcardTouchable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  boardcardText: {
    color: "black",
    fontWeight: "500",
    fontSize: 22,
    marginLeft: 15,
  },
  deleteButton: {
    padding: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  emptySubText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#808080",
    marginBottom: 20,
  },
  createBoardButton: {
    width: 170,
    alignSelf: "flex-end",
    marginRight: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0B1F3A",
    paddingVertical: 14,
    elevation: 5,
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 40,
    margin: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    minWidth: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    width: 220,
    backgroundColor: "#f8f8f8",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  createButton: {
    backgroundColor: "#0B1F3A",
    borderRadius: 6,
    margin: 5,
  },
  deleteConfirmButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 6,
    margin: 5,
  },
  cancelButton: {
    borderRadius: 6,
    margin: 5,
  },
});