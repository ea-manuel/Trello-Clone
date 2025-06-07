import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

const MOSQUITO_IMAGE = require("../assets/images/bee.png");

const NOTIFICATION_TYPES = ["All types", "Me", "Comments", "Join Request"];

const SAMPLE_NOTIFICATIONS = [
  { id: "1", type: "Me", read: false, text: "You were assigned to a task." },
  { id: "2", type: "Comments", read: true, text: "New comment on your card." },
  {
    id: "3",
    type: "Join Request",
    read: false,
    text: "User requested to join your board."
  },
  { id: "4", type: "Me", read: true, text: "You completed a checklist item." },
  {
    id: "5",
    type: "Comments",
    read: false,
    text: "Someone mentioned you in a comment."
  }
];

export default function NotificationsModal({ visible, onClose }) {
  const [typeFilter, setTypeFilter] = useState("All types");
  const [readFilter, setReadFilter] = useState("Unread");
  const [modalVisible, setModalVisible] = useState(false);

  const notifications = SAMPLE_NOTIFICATIONS;

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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={() => {}}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerIcon} onPress={onClose}>  
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
                      {typeFilter === item ? (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color="#2C8CFF"
                          style={{ width: 24 }}
                        />
                      ) : (
                        <View style={{ width: 24 }} />
                      )}
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

          {/* Notifications List or Empty State */}
          {filteredNotifications.length === 0 ? (
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
          ) : (
            <FlatList
              data={filteredNotifications}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 20
              }}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.notificationItem,
                    item.read
                      ? styles.notificationRead
                      : styles.notificationUnread
                  ]}
                >
                  <Text style={styles.notificationText}>{item.text}</Text>
                  <Text style={styles.notificationType}>{item.type}</Text>
                </View>
              )}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(22,37,58,0.7)",
    justifyContent: "flex-end"
  },
  modalContainer: {
    backgroundColor: "#16253A",
    paddingTop: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "100%",
    minHeight: "90%"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 60,
    backgroundColor: "#0B1F3A",
    justifyContent: "space-between",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18
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
  notificationItem: {
    backgroundColor: "#22345A",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12
  },
  notificationUnread: {
    borderLeftWidth: 4,
    borderLeftColor: "#2C8CFF"
  },
  notificationRead: {
    opacity: 0.6
  },
  notificationText: {
    color: "white",
    fontSize: 16
  },
  notificationType: {
    marginTop: 6,
    color: "#BFC9D6",
    fontSize: 13,
    fontWeight: "600"
  }
});
