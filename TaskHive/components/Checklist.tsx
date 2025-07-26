// Checklist.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  labels: string[];
  description?: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  createdAt: number;
}

interface ChecklistProps {
  storageKey?: string;
  title?: string;
}

export function Checklist({
  storageKey = "checklist-items",
  title = "My Checklist",
}: ChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        const savedItems = await AsyncStorage.getItem(storageKey);
        if (savedItems) {
          setItems(JSON.parse(savedItems));
        }
      } catch (error) {
        console.error("Error loading checklist items:", error);
      }
    };
    loadItems();
  }, [storageKey]);

  useEffect(() => {
    const saveItems = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(items));
      } catch (error) {
        console.error("Error saving checklist items:", error);
      }
    };
    saveItems();
  }, [items, storageKey]);

  const handleAddItem = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: trimmedValue,
        completed: false,
        createdAt: Date.now(),
        labels: [],
        description: "",
        comments: [],
      };
      setItems((prev) => [...prev, newItem]);
      setInputValue("");
      setShowInput(false);
    }
  };

  const toggleItemCompletion = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setItems((prev) => prev.filter((item) => item.id !== id)),
      },
    ]);
  };

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {totalCount > 0 && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressIcon}>✅</Text>
            <Text style={styles.progressText}>
              {completedCount}/{totalCount}
            </Text>
          </View>
        )}
      </View>

      {/* Add Item Section */}
      <View style={styles.addSection}>
        {!showInput ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowInput(true)}
            accessibilityLabel="Add checklist item button"
          >
            <Text style={styles.addButtonIcon}>➕</Text>
            <Text style={styles.addButtonText}>Add Checklist Item</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Enter checklist item..."
              placeholderTextColor="#9ca3af"
              autoFocus
              onSubmitEditing={handleAddItem}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: inputValue.trim() ? 1 : 0.5 },
              ]}
              onPress={handleAddItem}
              disabled={!inputValue.trim()}
              accessibilityLabel="Submit checklist item button"
            >
              <Text style={styles.sendButtonText}>📤</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Checklist Items */}
      {items.length > 0 ? (
        <ScrollView
          style={styles.itemsList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {items.map((item) => (
            <View
              key={item.id}
              style={[
                styles.itemContainer,
                item.completed ? styles.itemCompleted : styles.itemPending,
              ]}
            >
              {/* Checkbox */}
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => toggleItemCompletion(item.id)}
                accessibilityLabel={`Mark ${item.text} as ${
                  item.completed ? "incomplete" : "complete"
                }`}
              >
                <Text style={styles.checkboxIcon}>
                  {item.completed ? "✅" : "⬜"}
                </Text>
              </TouchableOpacity>

              {/* Text */}
              <Text
                style={[
                  styles.itemText,
                  item.completed && styles.itemTextCompleted,
                ]}
                numberOfLines={0}
              >
                {item.text}
              </Text>

              {/* Delete button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteItem(item.id)}
                accessibilityLabel={`Delete checklist item ${item.text}`}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : showInput ? null : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📝</Text>
          <Text style={styles.emptyStateText}>No items yet.</Text>
          <Text style={styles.emptyStateSubtext}>
            Add your first checklist item above!
          </Text>
        </View>
      )}

      {/* Hide Input Button */}
      {showInput && (
        <TouchableOpacity
          style={styles.hideInputButton}
          onPress={() => {
            setShowInput(false);
            setInputValue("");
          }}
          accessibilityLabel="Hide checklist input"
        >
          <Text style={styles.hideInputButtonText}>Hide Input</Text>
        </TouchableOpacity>
      )}

      {/* Progress Bar */}
      {totalCount > 0 && (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(completedCount / totalCount) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressBarText}>
            {Math.round((completedCount / totalCount) * 100)}% Complete
          </Text>
        </View>
      )}
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  addSection: {
    marginBottom: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#3b82f6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },
  sendButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#10b981",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonText: {
    fontSize: 18,
    color: "white",
  },
  itemsList: {
    flex: 1,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  itemPending: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
  },
  itemCompleted: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxIcon: {
    fontSize: 20,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    lineHeight: 24,
  },
  itemTextCompleted: {
    textDecorationLine: "line-through",
    color: "#6b7280",
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 18,
    color: "#ef4444",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  hideInputButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  hideInputButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "500",
  },
  progressBarContainer: {
    marginTop: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 4,
  },
  progressBarText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
});
