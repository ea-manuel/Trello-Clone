import { StyleSheet, TextInput, Text, View, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

const QUICK_SEARCHES = [
  {
    title: "My cards",
    description: "@me",
    key: "my-cards",
  },
  {
    title: "My cards due today",
    description: "@me due:day",
    key: "my-cards-due-today",
  },
  {
    title: "My cards overdue",
    description: "@me due:overdue",
    key: "my-cards-overdue",
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const navigateBack = () => {
    router.push({
      pathname: "/(tabs)",
    });
  };

  const handleClear = () => {
    setSearchText("");
  };

  // Filter quick searches based on searchText
  const filteredSearches = QUICK_SEARCHES.filter(
    item =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#16253A" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateBack}>
          <Ionicons name="arrow-back" color="white" size={28} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close" size={28} color="white" style={{ top: 3 }} />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView>
        <View style={styles.quickSearchContainer}>
          <Text style={styles.quickSearchHeader}>Quick searches</Text>
          <View style={styles.divider} />
          {filteredSearches.map(item => (
            <TouchableOpacity
              key={item.key}
              style={styles.quickSearchItem}
              // You can add navigation or actions here
              // onPress={() => { ... }}
              activeOpacity={0.7}
            >
              <Text style={styles.quickSearchTitle}>{item.title}</Text>
              <Text style={styles.quickSearchDesc}>{item.description}</Text>
            </TouchableOpacity>
          ))}
          {filteredSearches.length === 0 && (
            <Text style={styles.noResults}>No results found</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 110,
    backgroundColor: "#0B1F3A",
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    bottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    marginLeft: 15,
    marginTop: 5,
    paddingVertical: 2,
    fontSize: 20,
    color: "white",
    backgroundColor: "#22345A",
    paddingHorizontal: 15,
  },
  quickSearchContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  quickSearchHeader: {
    color: "#BFC9D6",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#2B3A56",
    marginBottom: 16,
  },
  quickSearchItem: {
    marginBottom: 26,
  },
  quickSearchTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 3,
  },
  quickSearchDesc: {
    color: "#BFC9D6",
    fontSize: 15,
  },
  noResults: {
    color: "#BFC9D6",
    fontSize: 16,
    marginTop: 30,
    textAlign: "center",
  },
});
