// SettingsModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SettingsContent from "./SettingsContent"; // Your detailed settings UI component

const PRIMARY_COLOR = "#34495e";
const SCREEN_HEIGHT = Dimensions.get("window").height;

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenModal}>
        <View style={styles.sheetHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={30} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <Text style={styles.sheetTitle}>Settings</Text>
          <View style={{ width: 30 }} /> {/* Spacer */}
        </View>

        {/* Render the detailed settings UI */}
        <SettingsContent />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenModal: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 40,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
});
