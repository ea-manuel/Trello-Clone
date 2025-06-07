// components/NotificationContent.js
import React from "react";
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MOSQUITO_IMAGE = require("../assets/images/bee.png");

export default function NotificationContent({
  typeFilter,
  setTypeFilter,
  readFilter,
  setReadFilter,
  modalVisible,
  setModalVisible,
  NOTIFICATION_TYPES,
  SAMPLE_NOTIFICATIONS,
  styles
}) {
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
    <>
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
    </>
  );
}
