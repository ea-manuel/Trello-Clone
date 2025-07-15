import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useWorkspaceStore } from "../app/stores/workspaceStore"; // Import the hook

type CreateWorkspaceModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (workspace: any) => void;
};

export default function CreateWorkspaceModal({
  visible,
  onClose,
  onCreate
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState("Private");
  const { createWorkspace } = useWorkspaceStore(); // Access createWorkspace via hook

  const handleCreate = async () => {
  if (!name.trim()) return;

  try {
    const workspace = await createWorkspace({ name, visibility });

    console.log("CreateWorkspaceModal: Created workspace:", workspace);
    onCreate(workspace);
    setName("");
    setVisibility("Private");
    onClose();
  } catch (error) {
    console.error("Error creating workspace from modal:", error);
    alert("Failed to create workspace. Please try again.");
  }
};

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Create Workspace</Text>
          <TextInput
            style={styles.input}
            placeholder="Workspace Name"
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity
            style={styles.visibilityButton}
            onPress={() =>
              setVisibility(visibility === "Private" ? "Public" : "Private")
            }
          >
            <Text style={styles.visibilityText}>{visibility}</Text>
            <Ionicons name="chevron-down" size={24} />
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreate}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 20,
    margin: 30,
    borderRadius: 20,
    minWidth: 300,
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    width: 220,
    marginBottom: 10
  },
  visibilityButton: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    width: 220,
    alignItems: "center",
    justifyContent: "center"
  },
  visibilityText: {
    color: "#0B1F3A",
    fontSize: 16
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  cancelButton: {
    backgroundColor: "#6B7280",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center"
  },
  createButton: {
    backgroundColor: "#0B1F3A",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  }
});
