import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const MOSQUITO_IMAGE = require("../../assets/images/bee.png");

// Notification types for the modal
const NOTIFICATION_TYPES = ["All types", "Me", "Comments", "Join Request"];

export default function NotificationsScreen() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState("All types");
  const [readFilter, setReadFilter] = useState("Unread");
  const [modalVisible, setModalVisible] = useState(false);

  // Simulated notifications array (empty to show empty state)
  const notifications = [];

  // Filter logic (would normally filter based on real data)
  const filteredNotifications = notifications.filter(
    (n) =>
      (typeFilter === "All types" || n.type === typeFilter) &&
      (readFilter === "All" || !n.read)
  );

  const clearFilter = () => {
    setTypeFilter("All types");
    setReadFilter("All");
  };

  const openTypeModal = () => setModalVisible(true);
  const closeTypeModal = () => setModalVisible(false);

  const handleTypeSelect = (type) => {
    setTypeFilter(type);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color="#BFC9D6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="filter-variant"
            size={25}
            color="#BFC9D6"
            style={{ marginRight: 10 }}
          />
          <Ionicons name="ellipsis-vertical" size={23} color="#BFC9D6" />
        </View>
      </View>

      {/* Tabs for Filters */}
      <View style={[styles.tabBar, { marginTop: 8, marginBottom: 16 }]}>
        {/* Type Filter Button */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            { flexDirection: "row", alignItems: "center", minWidth: 110 }
          ]}
          onPress={openTypeModal}
          activeOpacity={0.7}
        >
          <Text style={styles.tabButtonText}>{typeFilter}</Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="#BFC9D6"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
        {/* Read Filter Button */}
        <TouchableOpacity
          onPress={() =>
            setReadFilter(readFilter === "Unread" ? "All" : "Unread")
          }
          style={[
            styles.tabButton,
            readFilter === "Unread" && styles.tabButtonActive,
            { flexDirection: "row", alignItems: "center" }
          ]}
          activeOpacity={0.7}
        >
          {readFilter === "Unread" && (
            <Ionicons
              name="checkmark"
              size={16}
              color="white"
              style={{ marginRight: 5 }}
            />
          )}
          <Text
            style={[
              styles.tabButtonText,
              readFilter === "Unread" && styles.tabButtonTextActive
            ]}
          >
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Type Filter */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeTypeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeTypeModal}>
          <View style={styles.modalContent}>
            <FlatList
              data={NOTIFICATION_TYPES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleTypeSelect(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={typeFilter === item ? "checkmark" : ""}
                    size={20}
                    color="#2C8CFF"
                    style={{ width: 24 }}
                  />
                  <Text
                    style={[
                      styles.modalItemText,
                      typeFilter === item && {
                        color: "#2C8CFF",
                        fontWeight: "bold"
                      }
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <View style={styles.emptyState}>
          <Image
            source={MOSQUITO_IMAGE}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>
            You don’t have any notifications that{"\n"}match the selected
            filters
          </Text>
          <TouchableOpacity onPress={clearFilter}>
            <Text style={styles.clearFilter}>Clear Filter</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16253A"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 14,
    height: 100,
    backgroundColor: "#0B1F3A",
    justifyContent: "space-between"
  },
  headerIcon: {
    padding: 4
  },
  headerTitle: {
    color: "#BFC9D6",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
    flex: 1,
    textAlign: "center",
    marginLeft: -28
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 16
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#22345A",
    marginRight: 12
  },
  tabButtonActive: {
    backgroundColor: "#2B3A56"
  },
  tabButtonText: {
    color: "#BFC9D6",
    fontSize: 15,
    fontWeight: "600"
  },
  tabButtonTextActive: {
    color: "white"
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -60
  },
  image: {
    width: 160,
    height: 120,
    marginBottom: 28
  },
  emptyText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 18,
    fontWeight: "500",
    lineHeight: 22
  },
  clearFilter: {
    color: "#2C8CFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(22,37,58,0.7)",
    justifyContent: "flex-end"
  },
  modalContent: {
    backgroundColor: "#22345A",
    paddingVertical: 18,
    paddingHorizontal: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    minHeight: 220
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32
  },
  modalItemText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8
  }
});
