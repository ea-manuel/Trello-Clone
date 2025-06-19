import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

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

  // Filter templates based on selectedFilter
  const filteredTemplates =
    selectedFilter === "All"
      ? TEMPLATES
      : TEMPLATES.filter((tpl) => tpl.category === selectedFilter);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Start with a template</Text>
      </View>

      {/* Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive
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
        contentContainerStyle={styles.templatesList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardWrapper}
            activeOpacity={0.85}
            onPress={() => {
              /* Add navigation or action here */
            }}
          >
            <View style={[styles.card, { backgroundColor: item.cardColor }]}>
              {item.rectangles.map((rect, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.rect,
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
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.cardDescRow}>
              <Ionicons
                name="person"
                size={14}
                color="#b0b0b0"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1F3A"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B1F3A",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12
  },
  filterBar: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    paddingBottom: 50
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "gray",
    marginRight: 10,
    height: 35
  },
  filterButtonActive: {
    backgroundColor: "#23272F",
    borderColor: "#fff"
  },
  filterText: {
    color: "#fff",
    fontWeight: "600"
  },
  filterTextActive: {
    color: "#fff"
  },
  templatesList: {
    padding: 16
  },
  cardWrapper: {
    marginBottom: 24
  },
  card: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
    justifyContent: "flex-start"
  },
  rect: {
    position: "absolute",
    borderRadius: 8
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8
  },
  cardDescRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8
  },
  cardDesc: {
    color: "#b0b0b0",
    fontSize: 14
  }
});
