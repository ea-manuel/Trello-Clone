// CardDropdownMenu.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CardDropdownMenuProps {
  onArchive: () => void;
  onDelete: () => void;
  onRename: () => void;
  onCopy: () => void;
  onClose: () => void;
  style?: any;
}

export function CardDropdownMenu({
  onArchive,
  onDelete,
  onRename,
  onCopy,
  onClose,
  style,
}: CardDropdownMenuProps) {
  return (
    <TouchableOpacity
      style={[styles.overlay, style]}
      activeOpacity={1}
      onPressOut={onClose}
    >
      <View style={styles.menu}>
        <TouchableOpacity
          onPress={() => {
            onArchive();
            onClose();
          }}
          style={styles.menuItem}
        >
          <Text style={styles.menuText}>Archive Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onDelete();
            onClose();
          }}
          style={styles.menuItem}
        >
          <Text style={[styles.menuText, styles.destructive]}>Delete Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onRename();
            onClose();
          }}
          style={styles.menuItem}
        >
          <Text style={styles.menuText}>Rename Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onCopy();
            onClose();
          }}
          style={styles.menuItem}
        >
          <Text style={styles.menuText}>Copy Card</Text>
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
    top: 40,
    right: 10,
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
