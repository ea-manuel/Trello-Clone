import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { useWorkspaceStore } from "../app/stores/workspaceStore";
import { useRouter } from "expo-router";

export default function SearchModal({ visible, onClose }) {
  const [searchText, setSearchText] = useState("");
  const boards = useWorkspaceStore((state) => state.boards);
  const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
  const router = useRouter();

  const handleClear = () => setSearchText("");

  // Filter boards in current workspace by title matching searchText
  const filteredBoards = boards.filter(
    (board) =>
      board.workspaceId === currentWorkspaceId &&
      board.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBoardSelect = (board) => {
    onClose(); // close the modal
    setSearchText(""); // clear search text
    // Navigate to board detail page with board data
    router.push({
      pathname: `/boards/${board.id}`,
      params: { board: JSON.stringify(board) },
    });
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={400}
      style={styles.modalContainer}
      useNativeDriver={true}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" color="white" size={28} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search boards..."
            placeholderTextColor="gray"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Ionicons
                name="close"
                size={28}
                color="white"
                style={{ top: 3 }}
              />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView>
          <View style={styles.quickSearchContainer}>
            <Text style={styles.quickSearchHeader}>Boards</Text>
            <View style={styles.divider} />
            {filteredBoards.length > 0 ? (
              filteredBoards.map((board) => (
                <TouchableOpacity
                  key={board.id}
                  style={styles.quickSearchItem}
                  activeOpacity={0.7}
                  onPress={() => handleBoardSelect(board)}
                >
                  <Text style={styles.quickSearchTitle}>{board.title}</Text>
                  <Text style={styles.quickSearchDesc}>
                    Created: {new Date(board.createdAt).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResults}>No boards found</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: "#16253A",
    paddingTop: 0,
  },
  header: {
    height: 110,
    backgroundColor: "#0B1F3A",
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    bottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    marginLeft: 15,
    marginTop: 5,
    marginRight: 10,
    paddingVertical: 2,
    fontSize: 20,
    color: "white",
    backgroundColor: "#22345A",
    paddingHorizontal: 15,
  },
  quickSearchContainer: {
    paddingHorizontal: 20,
  },
  quickSearchHeader: {
    color: "#BFC9D6",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#2B3A56",
    marginBottom: 16,
  },
  quickSearchItem: {
    marginBottom: 26,
  },
  quickSearchTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 3,
  },
  quickSearchDesc: {
    color: "#BFC9D6",
    fontSize: 15,
  },
  noResults: {
    color: "#BFC9D6",
    fontSize: 16,
    marginTop: 30,
    textAlign: "center",
  },
});
// Use your existing styles from your SearchModal (no change needed)
