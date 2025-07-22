import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useTheme } from "../../ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";

const FILTERS = ["All", "Business", "Design", "Education"];

// Each template now has a category
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
      { width: 60, height: 100, left: 160, top: 30 }
    ]
  },
  {
    id: "2",
    title: "Project Management",
    description: "Made by TaskHive · Good for teams",
    category: "Design",
    cardColor: "#7b3ff2",
    rectangles: [
      { width: 60, height: 60, left: 20, top: 40 },
      { width: 60, height: 120, left: 90, top: 40 }
    ]
  },
  {
    id: "3",
    title: "Education Board",
    description: "Made by TaskHive · For teachers",
    category: "Education",
    cardColor: "#1ecbe1",
    rectangles: [
      { width: 60, height: 80, left: 20, top: 40 },
      { width: 60, height: 100, left: 90, top: 40 }
    ]
  }
];

export default function Templates() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { theme } = useTheme();
  const styles = theme === "dark" ? darkTheme : lightTheme;

  // Filter templates based on selectedFilter
  const filteredTemplates =
    selectedFilter === "All"
      ? TEMPLATES
      : TEMPLATES.filter((tpl) => tpl.category === selectedFilter);

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
              selectedFilter === filter && styles.templatesFilterButtonActive as any
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.templatesFilterText as any,
                selectedFilter === filter && styles.templatesFilterTextActive as any
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
              /* Add navigation or action here */
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
                      backgroundColor: "rgba(255,255,255,0.45)"
                    }
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
    </View>
  );
}
