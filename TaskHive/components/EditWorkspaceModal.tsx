import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useWorkspaceStore } from "../app/stores/workspaceStore";

type EditWorkspaceModalProps = {
  visible: boolean;
  onClose: () => void;
  workspace: { id: string; name: string; visibility: string };
  onUpdate: (updatedWorkspace: { id: string; name: string; visibility: string }) => void;
};

export default function EditWorkspaceModal({ visible, onClose, workspace, onUpdate }: EditWorkspaceModalProps) {
  const [name, setName] = useState(workspace?.name || "");
  const [visibility, setVisibility] = useState(workspace?.visibility || "Private");
  const editWorkspace = useWorkspaceStore((state) => state.editWorkspace);

  const handleUpdate = () => {
    if (!name.trim()) return;
    const updatedWorkspace = editWorkspace(workspace.id, { name, visibility });
    if (updatedWorkspace) {
      onUpdate(updatedWorkspace);
    }
     onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <BlurView style={StyleSheet.absoluteFill} intensity={100} tint="dark" />
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Edit Workspace</Text>
          <TextInput
            style={styles.input}
            placeholder="Workspace Name"
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity
            style={styles.visibilityButton}
            onPress={() => setVisibility(visibility === "Private" ? "Public" : "Private")}
          >
            <Text style={styles.visibilityText}>{visibility}</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Update</Text>
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
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 20,
    margin: 30,
    borderRadius: 20,
    minWidth: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    width: 220,
    marginBottom: 10,
  },
  visibilityButton: {
    backgroundColor: "#34495e",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    width: 220,
    alignItems: "center",
  },
  visibilityText: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#6B7280",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#0B1F3A",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});