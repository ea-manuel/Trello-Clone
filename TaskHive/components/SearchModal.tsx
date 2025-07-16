import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

const QUICK_SEARCHES = [
  { title: "My cards", description: "@me", key: "my-cards" },
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

export default function SearchModal({ visible, onClose }) {
  const [searchText, setSearchText] = useState("");

  const handleClear = () => setSearchText("");

  const filteredSearches = QUICK_SEARCHES.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={400}
      style={styles.modalContainer}
      useNativeDriver={true}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" color="white" size={28} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="gray"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Ionicons
                name="close"
                size={28}
                color="white"
                style={{ top: 3 }}
              />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView>
          <View style={styles.quickSearchContainer}>
            <Text style={styles.quickSearchHeader}>Quick searches</Text>
            <View style={styles.divider} />
            {filteredSearches.length > 0 ? (
              filteredSearches.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.quickSearchItem}
                  activeOpacity={0.7}
                  // Add your onPress navigation or actions here
                >
                  <Text style={styles.quickSearchTitle}>{item.title}</Text>
                  <Text style={styles.quickSearchDesc}>{item.description}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResults}>No results found</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: "#16253A",
    paddingTop: 0,
  },
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
    marginRight: 10,
    paddingVertical: 2,
    fontSize: 20,
    color: "white",
    backgroundColor: "#22345A",
    paddingHorizontal: 15,
  },
  quickSearchContainer: {
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
