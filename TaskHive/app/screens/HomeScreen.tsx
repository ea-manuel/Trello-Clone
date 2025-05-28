import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur"; // <-- Import BlurView
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import bee from "../../assets/images/bee.png";

const PRIMARY_COLOR = "#0B1F3A";

export default function HomeScreen() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [boards, setBoards] = useState<{ id: number; title: string }[]>([]);
  const [boardTitle, setBoardTitle] = useState("");
  const handleCreateBoard = () => {
    if (!boardTitle.trim()) return;
    const newBoard = {
      id: Date.now(),
      title: boardTitle,
      createdAt: new Date().toLocaleString()
    };
    setBoards([...boards, newBoard]);
    setShowModal(false);
    setBoardTitle("");
    router.push({
      pathname: "/boards",
      params: { board: JSON.stringify(newBoard) }
    });
  };

  return (
    <View style={styles.mainpage}>
      {boards.length > 0 && (
        <Text
          style={{
            alignItems: "center",
            marginTop: 70,
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
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: `/boards/${item.id}`,
                params: { board: JSON.stringify(item) }
              })
            }
            ListHeaderComponent={
              boards.length > 0 ? (
                <Text style={styles.boardsTitle}>Boards</Text>
              ) : null
            }
          >
            <View style={styles.boardcard}>
              <Ionicons name="grid" size={30} color="#34495e" />
              <Text style={styles.boardcardtext}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.body}>
            <Image source={bee} style={{ width: 300, height: 300 }} />
            <Text style={styles.maintext}>No Boards</Text>
            <Text style={styles.subtext}>Create Your First Task Board</Text>
          </View>
        }
      />

      {showModal && (
        <Modal visible={showModal} transparent animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalBackground}
          >
            <BlurView
              intensity={100}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Enter Board Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sprint Tasks"
                value={boardTitle}
                onChangeText={setBoardTitle}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <View
                  style={{
                    backgroundColor: PRIMARY_COLOR,
                    borderRadius: 6,
                    margin: 5
                  }}
                >
                  <Button
                    title="Create"
                    onPress={handleCreateBoard}
                    color="#34495e"
                  />
                </View>
                <View style={{ borderRadius: 6, margin: 5 }}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowModal(false)}
                    color="#ADD8E6"
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}
      <View style={styles.createBoardButton}>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.button}
          activeOpacity={0.8}
          accessibilityLabel="Create a new board"
          accessible={true}
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
    backgroundColor: "white"
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingVertical: 20,
    marginTop: 80
  },
  boardcard: {
    backgroundColor: "white",
    paddingVertical: 15,
    borderColor: PRIMARY_COLOR,
    borderWidth: 0.5,
    paddingHorizontal: 15,
    flexDirection: "row",
    elevation: 8
  },
  boardcardtext: {
    color: "Black",
    fontWeight: "500",
    fontSize: 22,
    left: 15
  },
  body: {
    padding: 20,
    alignItems: "center"
  },
  maintext: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#36454F"
  },
  subtext: {
    fontSize: 18,
    fontWeight: "500",
    color: "#808080",
    marginBottom: 20
  },
  createBoardButton: {
    width: 170,
    left: 200,
    bottom: 10
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 14,
    elevation: 5,
    borderRadius: 8
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // fallback for blur
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    backgroundColor: "rgba(255, 255, 255, 0.85)", // semi-transparent for extra blur effect
    padding: 40,
    margin: 30,
    borderRadius: 20, // More rounded corners
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    minWidth: 300,
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    width: 220,
    backgroundColor: "#f8f8f8"
  },
  boardsTitle: {
    fontWeight: "bold",
    fontSize: 24,
    color: "gray",
    marginVertical: 20,
    textAlign: "center"
  }
});
