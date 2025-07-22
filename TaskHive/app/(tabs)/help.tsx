import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useTheme } from "../../ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";
import { useRouter } from "expo-router";

export const options = {
  headerShown: false,
};

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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { theme } = useTheme();
  const styles = theme === "dark" ? darkTheme : lightTheme;
  const router = useRouter();

  // Filter topics by search
  const filteredTopics = HELP_TOPICS.filter((topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Custom header with back and search
  const renderHeader = () => (
    <View style={styles.helpHeader as any}>
      <TouchableOpacity onPress={() => router.replace("/screens/HomeScreen")}
        style={styles.helpHeaderBackButton as any}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.helpHeaderTitle as any}>Help</Text>
      <View style={styles.helpHeaderSearchBar as any}>
        <TextInput
          style={styles.helpSearchInput as any}
          placeholder="Search..."
          placeholderTextColor="#bbb"
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons
          name="search"
          size={20}
          color="#bbb"
          style={styles.helpSearchIcon as any}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.helpContainer as any}>
      {renderHeader()}
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {filteredTopics.map((topic) => (
          <View key={topic.key} style={styles.helpCardContainer as any}>
            <TouchableOpacity
              style={styles.helpCard as any}
              onPress={() => toggleExpand(topic.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.helpCardTitle as any}>{topic.title}</Text>
              <Ionicons
                name={expanded[topic.key] ? "chevron-up" : "chevron-down"}
                size={24}
                color="#E100FF"
              />
            </TouchableOpacity>
            {expanded[topic.key] && (
              <View style={styles.helpCardContent as any}>
                <Text style={styles.helpCardContentText as any}>{topic.content}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
