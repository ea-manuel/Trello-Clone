import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

interface ListDropdownMenuProps {
  visible: boolean;
  onDeleteList: () => void;
  onClose: () => void;
  eyeVisible: boolean;
  onToggleEye: (newValue: boolean) => void;
  style?: any;
}

export default function ListDropdownMenu({
  visible,
  onDeleteList,
  onClose,
  eyeVisible,
  onToggleEye,
  style,
}: ListDropdownMenuProps) {
  if (!visible) return null;

  // Simple alert for toast replacement demo:
  const notify = (msg: string) => Alert.alert("Notification", msg);

  const toggleEye = () => {
    const newVal = !eyeVisible;
    onToggleEye(newVal);
    notify(newVal ? "List visibility turned ON" : "List visibility turned OFF");
  };

  return (
    <TouchableOpacity
      style={[styles.overlay, style]}
      activeOpacity={1}
      onPressOut={onClose}
    >
      <View style={styles.menu}>
        <TouchableOpacity
          onPress={() => {
            onDeleteList();
            onClose();
          }}
          style={styles.menuItem}
        >
          <Text style={[styles.menuText, styles.destructive]}>Delete List</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleEye} style={styles.menuItem}>
          <Text style={styles.menuText}>
            {eyeVisible ? "Hide List" : "Show List"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.menuItem}>
          <Text style={[styles.menuText, styles.cancel]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 32,
    right: 12,
    zIndex: 1000,
  },
  menu: {
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    minWidth: 140,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 10,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    color: "white",
    fontSize: 16,
  },
  destructive: {
    color: "#ff6b6b",
  },
  cancel: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});
