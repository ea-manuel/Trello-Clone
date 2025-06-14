import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import SearchModal from "@/components/SearchModal"; // Import your SearchModal

const PRIMARY_COLOR = "#0B1F3A";
const USER_ID = "134768944"; // Example user ID

const EXAMPLE_BOARDS = [
  { id: "1", title: "Me" },
  { id: "2", title: "Meee" },
  { id: "3", title: "Sb" }
];

export default function OfflineBoards() {
  const router = useRouter();
  const [boards, setBoards] = useState(EXAMPLE_BOARDS);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isSearchVisible, setSearchVisible] = useState(false);

  // Load boards from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("offlineBoards");
        if (stored) setBoards(JSON.parse(stored));
      } catch {}
    })();
  }, []);

  // Save boards to AsyncStorage
  const saveBoards = async (newBoards) => {
    setBoards(newBoards);
    await AsyncStorage.setItem("offlineBoards", JSON.stringify(newBoards));
  };

  const addBoard = () => {
    if (!newBoardTitle.trim()) {
      Alert.alert("Please enter a board title");
      return;
    }
    const newBoard = {
      id: Date.now().toString(),
      title: newBoardTitle.trim()
    };
    const updatedBoards = [...boards, newBoard];
    saveBoards(updatedBoards);
    setNewBoardTitle("");
    setModalVisible(false);
  };

  // Touchable board card
  const renderBoard = ({ item }) => (
    <TouchableOpacity
      style={styles.boardRow}
      activeOpacity={0.7}
      onPress={() => Alert.alert("Board pressed", item.title)}
    >
      <View style={styles.boardVisual} />
      <Text style={styles.boardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Header matching your main header style
  const renderHeader = () => (
    <View style={styles.mainpage}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Offline Boards</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.iconButton}
          onPress={() => setSearchVisible(true)}
        >
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <SearchModal
        visible={isSearchVisible}
        onClose={() => setSearchVisible(false)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <Text style={styles.workspaceLabel}>User {USER_ID}'s Workspace</Text>
      <FlatList
        data={boards}
        keyExtractor={(item) => item.id}
        renderItem={renderBoard}
        contentContainerStyle={{ paddingTop: 10 }}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
      {/* Add Board Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Board</Text>
            <TextInput
              placeholder="Board title"
              value={newBoardTitle}
              onChangeText={setNewBoardTitle}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addBoard}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  mainpage: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    paddingHorizontal: 10,
    paddingBottom: 5
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center"
  },
  iconButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  workspaceLabel: {
    fontWeight: "bold",
    marginTop: 12,
    marginLeft: 18,
    fontSize: 15,
    color: "#111"
  },
  boardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginLeft: 18
  },
  boardVisual: {
    width: 48,
    height: 32,
    backgroundColor: "#1783e5",
    borderRadius: 4,
    marginRight: 16
  },
  boardTitle: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500"
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007CF0",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    padding: 20
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0B1F3A",
    marginBottom: 12
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#222",
    marginBottom: 20,
    fontSize: 16
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end" },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10
  },
  cancelButton: { backgroundColor: "#555" },
  saveButton: { backgroundColor: "#007CF0" },
  modalButtonText: { color: "white", fontWeight: "bold" }
});
