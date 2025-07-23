import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import { useTheme } from "../../ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";
import { useWorkspaceStore } from "../stores/workspaceStore";
import { useNotificationStore } from "../stores/notificationsStore";

const FILTERS = ["All", "Business", "Design", "Education"];

const TEMPLATES = [
  {
    id: "1",
    title: "Basic Board",
    description: "Made by TaskHive · Good for Personal Work",
    category: "Business",
    cardColor: "#1783e5",
    rectangles: [
      { width: 60, height: 100, left: 20, top: 30 },
      { width: 60, height: 60, left: 90, top: 30 },
      { width: 60, height: 100, left: 160, top: 30 },
    ],
  },
  {
    id: "2",
    title: "Project Management",
    description: "Made by TaskHive · Good for teams",
    category: "Design",
    cardColor: "#7b3ff2",
    rectangles: [
      { width: 60, height: 60, left: 20, top: 40 },
      { width: 60, height: 120, left: 90, top: 40 },
    ],
  },
  {
    id: "3",
    title: "Education Board",
    description: "Made by TaskHive · For teachers",
    category: "Education",
    cardColor: "#1ecbe1",
    rectangles: [
      { width: 60, height: 80, left: 20, top: 40 },
      { width: 60, height: 100, left: 90, top: 40 },
    ],
  },
];

export default function Templates() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { theme } = useTheme();
  const styles = theme === "dark" ? darkTheme : lightTheme;
  const boards = useWorkspaceStore((s) => s.boards);
  const updateBoard = useWorkspaceStore((s) => s.updateBoard);
  const { addNotification } = useNotificationStore();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Filter templates based on selectedFilter
  const filteredTemplates =
    selectedFilter === "All"
      ? TEMPLATES
      : TEMPLATES.filter((tpl) => tpl.category === selectedFilter);

  // Handle board selection for template application
  const handleBoardSelect = (board) => {
    updateBoard({ ...board, backgroundColor: selectedTemplate.cardColor });
    setModalVisible(false);
    setSelectedTemplate(null);
    addNotification({
      type: "success",
      text: `Applied template to board \"${board.title}\"!`,
    });
  };

  return (
    <View style={styles.templatesContainer as any}>
      {/* Header */}
      <View style={styles.templatesHeader as any}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.templatesHeaderTitle as any}>Start with a template</Text>
      </View>

      {/* Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.templatesFilterBar as any}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.templatesFilterButton as any,
              selectedFilter === filter && styles.templatesFilterButtonActive as any,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.templatesFilterText as any,
                selectedFilter === filter && styles.templatesFilterTextActive as any,
              ]}
            >
              {filter}
            </Text>
            {selectedFilter === filter && (
              <Ionicons
                name="checkmark"
                size={16}
                color="#fff"
                style={{ marginLeft: 4 }}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Templates List */}
      <FlatList
        data={filteredTemplates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.templatesList as any}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.templatesCardWrapper as any}
            activeOpacity={0.85}
            onPress={() => {
              setSelectedTemplate(item);
              setModalVisible(true);
            }}
          >
            <View style={[styles.templatesCard as any, { backgroundColor: item.cardColor }] }>
              {item.rectangles.map((rect, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.templatesRect as any,
                    {
                      width: rect.width,
                      height: rect.height,
                      left: rect.left,
                      top: rect.top,
                      backgroundColor: "rgba(255,255,255,0.45)",
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.templatesCardTitle as any}>{item.title}</Text>
            <View style={styles.templatesCardDescRow as any}>
              <Ionicons
                name="person"
                size={14}
                color="#b0b0b0"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.templatesCardDesc as any}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal for board selection */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: theme === "dark" ? "#23253A" : "#fff", borderRadius: 16, padding: 24, minWidth: 320, maxWidth: 400, maxHeight: 500 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 16, color: theme === "dark" ? "#fff" : "#22345A" }}>
              Select a Board to Apply "{selectedTemplate?.title}" Style
            </Text>
            <ScrollView style={{ maxHeight: 250, marginBottom: 16 }}>
              {boards.length === 0 ? (
                <Text style={{ color: "#888", textAlign: "center" }}>No boards available.</Text>
              ) : (
                boards.map((board) => (
                  <Pressable
                    key={board.id}
                    onPress={() => handleBoardSelect(board)}
                    style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                  >
                    <Ionicons name="grid" size={22} color="#007CF0" />
                    <Text style={{ marginLeft: 12, color: theme === "dark" ? "#fff" : "#22345A", fontWeight: "500", fontSize: 16 }}>{board.title}</Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: "#888", fontWeight: "bold", fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
