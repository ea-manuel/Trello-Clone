import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import NotificationContent from "./NotificationContent";

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

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500}
      animationOutTiming={500}
      style={styles.modalContainer}
      useNativeDriver={true}
    >
      <View style={styles.fullScreenModal}>
        {/* Header */}
        <View style={styles.sheetHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={30} color={"white"} />
          </TouchableOpacity>
          <Text style={styles.sheetTitle}>Notifications</Text>
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
        {/* Notification Content */}
        <NotificationContent
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          readFilter={readFilter}
          setReadFilter={setReadFilter}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          NOTIFICATION_TYPES={NOTIFICATION_TYPES}
          SAMPLE_NOTIFICATIONS={SAMPLE_NOTIFICATIONS}
          styles={styles}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: "flex-end"
  },
  fullScreenModal: {
    backgroundColor: "#16253A",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 0,
    height: "100%"
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
    justifyContent: "space-between"
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white"
  },
  // ...rest of your styles from previous code...
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
