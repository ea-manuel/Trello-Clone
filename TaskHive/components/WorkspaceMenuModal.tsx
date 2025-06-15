import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Modal from "react-native-modal";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function WorkspaceMenuModal({
  visible,
  onClose,
  workspace,
  onManageCollaborators,
  onUpdateWorkspace // <-- Add this callback prop to handle updates
}) {
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Local state for settings
  const [workspaceName, setWorkspaceName] = useState(workspace?.name || "");
  const [isPrivate, setIsPrivate] = useState(
    workspace?.isPrivate !== undefined ? workspace.isPrivate : true
  );

  // When opening settings, sync local state with current workspace
  const openSettings = () => {
    setWorkspaceName(workspace?.name || "");
    setIsPrivate(
      workspace?.isPrivate !== undefined ? workspace.isPrivate : true
    );
    setSettingsVisible(true);
  };
  const closeSettings = () => setSettingsVisible(false);

  // Save changes and notify parent
  const handleSaveSettings = () => {
    if (onUpdateWorkspace) {
      onUpdateWorkspace({
        ...workspace,
        name: workspaceName,
        isPrivate
      });
    }
    closeSettings();
  };

  return (
    <>
      {/* Workspace Menu Modal */}
      <Modal
        isVisible={visible}
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor="#0B1F3A"
        backdropOpacity={0.95}
        style={styles.modal}
        useNativeDriver
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Workspace menu</Text>
            <TouchableOpacity
              onPress={openSettings}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="settings-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Workspace Card */}
            <View style={styles.workspaceCard}>
              <View style={styles.workspaceInfo}>
                <Text style={styles.workspaceName}>
                  {workspace?.name || "Workspace Name"}
                </Text>
                <Text style={styles.workspaceDetails}>
                  {workspace?.handle || "workspacehandle"} (Free){" "}
                  <Text style={{ color: "#F87171" }}>
                    {workspace?.isPrivate ? "🔒 Private" : "🌐 Public"}
                  </Text>
                </Text>
              </View>
              <View style={styles.workspaceIcon}>
                <Text style={styles.workspaceInitials}>
                  {workspace?.name?.[0]?.toUpperCase() || "W"}
                </Text>
              </View>
            </View>

            {/* Collaborators */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="user" size={16} color="#FFFFFFAA" />
                <Text style={styles.sectionTitle}>Collaborators</Text>
              </View>

              <View style={styles.collaboratorsList}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>JD</Text>
                </View>
                {/* Add more avatars here if needed */}
              </View>

              <TouchableOpacity
                style={styles.manageButton}
                onPress={onManageCollaborators}
              >
                <Text style={styles.manageButtonText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Synced Footer pinned to bottom */}
          <View style={styles.syncedFooter}>
            <Ionicons name="sync" size={16} color="#FFFFFFAA" />
            <Text style={styles.syncedText}>Synced</Text>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isVisible={settingsVisible}
        onBackdropPress={closeSettings}
        onBackButtonPress={closeSettings}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor="#0B1F3A"
        backdropOpacity={0.95}
        style={styles.settingsModal}
        useNativeDriver
      >
        <View style={styles.settingsContainer}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <TouchableOpacity
              onPress={closeSettings}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>
          {/* Settings Content */}
          <View style={{ flex: 1 }}>
            {/* Workspace Name Input */}
            <Text style={styles.inputLabel}>Workspace Name</Text>
            <TextInput
              style={styles.input}
              value={workspaceName}
              onChangeText={setWorkspaceName}
              placeholder="Enter workspace name"
              placeholderTextColor="#FFFFFF55"
              maxLength={32}
            />

            {/* Privacy Toggle */}
            <View style={styles.toggleRow}>
              <Text style={styles.inputLabel}>Private Workspace</Text>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                thumbColor={isPrivate ? "#3B82F6" : "#888"}
                trackColor={{ true: "#1E40AF", false: "#444" }}
                ios_backgroundColor="#444"
              />
              <Text
                style={[
                  styles.privacyLabel,
                  { color: isPrivate ? "#F87171" : "#34D399" }
                ]}
              >
                {isPrivate ? "Private" : "Public"}
              </Text>
            </View>
          </View>
          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveSettings}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-start",
    margin: 0,
    flex: 1
  },
  modalContainer: {
    backgroundColor: "#0B1F3A",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: SCREEN_HEIGHT,
    paddingBottom: 20,
    flexDirection: "column"
  },
  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F3A5A"
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  },
  scrollArea: {
    flex: 1,
    paddingTop: 10
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 16
  },
  workspaceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  workspaceInfo: {
    flex: 1,
    marginRight: 10
  },
  workspaceName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  workspaceDetails: {
    color: "#FFFFFFAA",
    fontSize: 14,
    marginTop: 4
  },
  workspaceIcon: {
    backgroundColor: "#3B82F6",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  workspaceInitials: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18
  },
  promoCard: {
    backgroundColor: "#152A45",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20
  },
  promoText: {
    color: "#FFFFFFB3",
    fontSize: 14,
    marginBottom: 8
  },
  startTrial: {
    color: "#60A5FA",
    fontWeight: "600"
  },
  section: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8
  },
  sectionTitle: {
    color: "#FFFFFFAA",
    fontSize: 14,
    marginLeft: 6
  },
  collaboratorsList: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1E40AF",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: "white",
    fontWeight: "600"
  },
  manageButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center"
  },
  manageButtonText: {
    color: "white",
    fontWeight: "600"
  },
  syncedFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#1F3A5A",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0B1F3A"
  },
  syncedText: {
    marginLeft: 6,
    color: "#FFFFFFAA"
  },
  // Settings modal styles
  settingsModal: {
    justifyContent: "flex-end",
    margin: 0
  },

  settingsContainer: {
    height: SCREEN_HEIGHT / 2,
    backgroundColor: "#0B1F3A",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    flexDirection: "column"
  },
  settingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  settingsTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600"
  },
  inputLabel: {
    color: "#FFFFFFAA",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16
  },
  input: {
    backgroundColor: "#1F3A5A",
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3B82F6"
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    justifyContent: "space-between"
  },
  privacyLabel: {
    marginLeft: 12,
    fontWeight: "600",
    fontSize: 15
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  }
});
