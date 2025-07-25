import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { BlurView } from "expo-blur";
import { useWorkspaceStore } from "../app/stores/workspaceStore";

type EditWorkspaceModalProps = {
  visible: boolean;
  onClose: () => void;
  workspace: { id: string; name: string; visibility: string };
  onUpdate: (updatedWorkspace: { id: string; name: string; visibility: string } | null) => void;
};

export default function EditWorkspaceModal({ visible, onClose, workspace, onUpdate }: EditWorkspaceModalProps) {
  const [name, setName] = useState(workspace?.name || "");
  const [visibility, setVisibility] = useState(workspace?.visibility || "Private");
  const editWorkspace = useWorkspaceStore((state) => state.editWorkspace);
  const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const handleUpdate = () => {
    if (!name.trim()) return;
    const updatedWorkspace = editWorkspace(workspace.id, { name, visibility });
    if (updatedWorkspace) {
      onUpdate(updatedWorkspace);
    }
     onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Workspace",
      "Are you sure you want to delete this workspace? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setShowLoader(true);
            onClose(); // Close modal immediately
            try {
              await deleteWorkspace(workspace.id);
              onUpdate(null); // Signal deletion
            } catch (e) {
              setTimeout(() => {
                Alert.alert(
                  "Delete Failed",
                  "Could not delete workspace. Please check your connection or try again.",
                  [{ text: "OK", style: "default" }]
                );
              }, 800); // Show after loader disappears
            } finally {
              setLoading(false);
              setTimeout(() => setShowLoader(false), 800);
            }
          },
        },
      ]
    );
  };

  return (
    <>
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
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={[styles.buttonText, { color: '#e74c3c' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Custom Loader Overlay */}
      {showLoader && (
        <View style={styles.loaderOverlay}>
          <BlurView style={StyleSheet.absoluteFill} intensity={40} tint="light" />
          <View style={styles.loaderContent}>
            <ActivityIndicator size="large" color="#e74c3c" />
            <Text style={{ marginTop: 16, fontWeight: 'bold', fontSize: 18, color: '#e74c3c' }}>Deleting workspace...</Text>
          </View>
        </View>
      )}
    </>
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
  deleteButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e74c3c",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loaderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});