import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const HELP_TOPICS = [
  {
    key: "archive",
    title: "Archive A Card",
    content:
      "To archive a card, swipe left on the card and tap the archive icon."
  },
  {
    key: "checklist",
    title: "Add A Checklist",
    content: "Open a card and tap 'Add Checklist' to insert a checklist."
  },
  {
    key: "board",
    title: "Add A Board",
    content:
      "To add a new board from the TaskHive home screen tap the '+' plus sign at the bottom right of the screen"
  },
  {
    key: "filter",
    title: "Filter Cards",
    content:
      "Tap the filter icon on the top right to filter cards by status or label."
  }
];

export default function HelpScreen() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  // Filter topics by search
  const filteredTopics = HELP_TOPICS.filter((topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#bbb"
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons
          name="search"
          size={20}
          color="#bbb"
          style={styles.searchIcon}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {filteredTopics.map((topic) => (
          <View key={topic.key} style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => toggleExpand(topic.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardTitle}>{topic.title}</Text>
              <Ionicons
                name={expanded[topic.key] ? "chevron-up" : "chevron-down"}
                size={24}
                color="#E100FF"
              />
            </TouchableOpacity>
            {expanded[topic.key] && (
              <View style={styles.cardContent}>
                <Text style={styles.cardContentText}>{topic.content}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#edeceb",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 16
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dedede",
    borderRadius: 16,
    marginBottom: 24,
    paddingHorizontal: 12,
    height: 44,
    alignSelf: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: "#888",
    fontWeight: "bold",
    letterSpacing: 1
  },
  searchIcon: {
    marginLeft: 8
  },
  cardContainer: {
    marginBottom: 18
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    letterSpacing: 1
  },
  cardContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  cardContentText: {
    fontSize: 15,
    color: "#222",
    lineHeight: 20
  }
});
