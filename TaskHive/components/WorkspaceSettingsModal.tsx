import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function SettingsModalContent({ workspace, onClose, onSave }) {
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name || "");
      setIsPrivate(workspace.isPrivate ?? true);
    }
  }, [workspace]);

  const handleSave = () => {
    onSave({ ...workspace, name, isPrivate });
    onClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workspace Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Workspace Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter workspace name"
          placeholderTextColor="#888"
          maxLength={50}
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Private Workspace</Text>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            thumbColor={isPrivate ? "#3B82F6" : "#ccc"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0B1F3A",
    width: "100%",
    height: "100%",
    paddingTop: 40,
    paddingHorizontal: 20
  },
  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1F3A5A",
    marginBottom: 20
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600"
  },
  content: {
    flex: 1
  },
  label: {
    color: "white",
    fontSize: 16,
    marginBottom: 8
  },
  input: {
    backgroundColor: "#152A45",
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 24
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center"
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16
  }
});
