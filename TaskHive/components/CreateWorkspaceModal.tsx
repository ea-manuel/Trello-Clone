import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
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
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const handleCreate = async () => {
  if (!name.trim()) return;
  setLoading(true);
  setShowLoader(true);
  onClose(); // Close modal immediately

  try {
    const workspace = await createWorkspace({ name, visibility });

    console.log("CreateWorkspaceModal: Created workspace:", workspace);
    onCreate(workspace);
    setName("");
    setVisibility("Private");
  } catch (error) {
    console.error("Error creating workspace from modal:", error);
    alert("Failed to create workspace. Please try again.");
  } finally {
    setLoading(false);
    setTimeout(() => setShowLoader(false), 800); // Hide loader after short delay
  }
};

  return (
    <>
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
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? "Creating..." : "Create"}</Text>
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
            <ActivityIndicator size="large" color="#0B1F3A" />
            <Text style={{ marginTop: 16, fontWeight: 'bold', fontSize: 18, color: '#0B1F3A' }}>Creating workspace...</Text>
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
