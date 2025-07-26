import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LabelsModalProps {
  visible: boolean;
  labels: string[];
  onClose: () => void;
  onAddLabel: (label: string) => void;
  onRemoveLabel: (label: string) => void;
  styles: any;
}

export default function LabelsModal({
  visible,
  labels,
  onClose,
  onAddLabel,
  onRemoveLabel,
  styles,
}: LabelsModalProps) {
  const [inputText, setInputText] = useState("");

  const handleAddLabel = () => {
    const trimmed = inputText.trim();
    if (trimmed !== "" && !labels.includes(trimmed)) {
      onAddLabel(trimmed);
      setInputText("");
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Manage Urgency Labels</Text>
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Add new label"
              placeholderTextColor="#888"
              onSubmitEditing={handleAddLabel}
              autoFocus
            />
            <TouchableOpacity
              onPress={handleAddLabel}
              style={[styles.addButton, { marginLeft: 8 }]}
              accessibilityLabel="Add label"
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={labels}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.labelRow}>
                <Text style={styles.labelText}>{item}</Text>
                <TouchableOpacity onPress={() => onRemoveLabel(item)}>
                  <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ color: "#888" }}>No labels yet.</Text>
            }
          />
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { marginTop: 16 }]}
          >
            <Text style={{ color: "#3b82f6", fontWeight: "600" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const stylesInner = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 20,
    maxHeight: 400,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  labelText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  textInput: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "white",
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
});
