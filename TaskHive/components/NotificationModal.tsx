import React, { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { useNotificationStore } from "../app/stores/notificationsStore";
import { useTheme } from "../ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";

const PRIMARY_COLOR = "#0B1F3A";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const MOSQUITO_IMAGE = require("../assets/images/bee.png");

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

interface NotificationItem {
  id: string;
  type: string;
  text: string;
  read: boolean;
}

const getNotificationStyles = (theme: string) => StyleSheet.create<{ [key: string]: ViewStyle | TextStyle | ImageStyle }>({
  notificationItem: {
    backgroundColor: theme === "dark" ? "#22345A" : "#f4f6fa",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  notificationUnread: {
    borderLeftWidth: 4,
    borderLeftColor: "#2C8CFF",
  },
  notificationRead: {
    opacity: 0.6,
  },
  notificationText: {
    color: theme === "dark" ? "#fff" : "#22345A",
    fontSize: 16,
  },
  notificationType: {
    marginTop: 6,
    color: theme === "dark" ? "#BFC9D6" : "#888",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default function NotificationsModal({ visible, onClose }: NotificationModalProps) {
  const { theme } = useTheme();
  const styles = theme === "dark" ? darkTheme : lightTheme;
  const notificationStyles = getNotificationStyles(theme);
  const { notifications, markAsRead } = useNotificationStore();
  const [readFilter, setReadFilter] = useState<string>("Unread");
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false);

  // Filtering logic
  const filteredNotifications = notifications.filter(
    (n: NotificationItem) => (readFilter === "All" || !n.read)
  );

  // When a notification is tapped
  const handleNotificationPress = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    setShowMessageModal(true);
    if (!notification.read) markAsRead(notification.id);
  };

  // Close the small message modal
  const closeMessageModal = () => {
    setShowMessageModal(false);
    setSelectedNotification(null);
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={{ margin: 0, justifyContent: "flex-end" } as ViewStyle}
      propagateSwipe={true}
      swipeDirection="down"
      onSwipeComplete={onClose}
      swipeThreshold={100}
    >
      <View style={{
        flex: 1,
        backgroundColor: theme === "dark" ? "#16253A" : "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: "hidden",
        paddingTop: 0,
      }}>
        {/* Header */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 36,
          paddingBottom: 18,
          backgroundColor: theme === "dark" ? "#16253A" : "#f7fafd",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderBottomWidth: 1,
          borderBottomColor: theme === "dark" ? "#22345A" : "#e6e6e6",
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
          zIndex: 2,
        }}>
          <TouchableOpacity
            onPress={onClose}
            accessibilityLabel="Close notifications"
            style={{ marginRight: 10 }}
          >
            <Ionicons name="arrow-back" size={30} color={theme === "dark" ? "#fff" : "#22345A"} />
          </TouchableOpacity>
          <Text style={{
            fontSize: 22,
            fontWeight: "bold",
            color: theme === "dark" ? "#fff" : "#22345A",
            flex: 1,
            textAlign: "left"
          }}>Notifications</Text>
          <MaterialCommunityIcons
            name="filter-variant"
            size={25}
            color={theme === "dark" ? "#BFC9D6" : "#22345A"}
            style={{ marginRight: 10 }}
          />
          <Ionicons name="ellipsis-vertical" size={23} color={theme === "dark" ? "#BFC9D6" : "#22345A"} />
        </View>
        {/* Tabs for Filters */}
        <View style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 8,
          backgroundColor: theme === "dark" ? "#16253A" : "#f7fafd",
        }}>
          <TouchableOpacity
            onPress={() => setReadFilter(readFilter === "Unread" ? "All" : "Unread")}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 18,
              borderRadius: 18,
              backgroundColor: readFilter === "Unread"
                ? (theme === "dark" ? "#22345A" : "#e6e6e6")
                : (theme === "dark" ? "#2B3A56" : "#f7fafd"),
              flexDirection: "row",
              alignItems: "center",
            }}
            activeOpacity={0.7}
          >
            {readFilter === "Unread" && (
              <Ionicons
                name="checkmark"
                size={16}
                color={theme === "dark" ? "#fff" : "#22345A"}
                style={{ marginRight: 5 }}
              />
            )}
            <Text style={{
              color: readFilter === "Unread"
                ? (theme === "dark" ? "#fff" : "#22345A")
                : (theme === "dark" ? "#BFC9D6" : "#888"),
              fontSize: 15,
              fontWeight: "600"
            }}>Unread</Text>
          </TouchableOpacity>
        </View>
        {/* Notifications List or Empty State */}
        <View style={{ flex: 1, backgroundColor: theme === "dark" ? "#16253A" : "#fff", paddingTop: 8 }}>
          {filteredNotifications.length === 0 ? (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Image
                source={MOSQUITO_IMAGE}
                style={{ width: 160, height: 120, marginBottom: 28 }}
                resizeMode="contain"
              />
              <Text style={{
                color: theme === "dark" ? "#fff" : "#22345A",
                fontSize: 16,
                textAlign: "center",
                marginBottom: 18,
                fontWeight: "500",
                lineHeight: 22,
              }}>
                You don’t have any notifications
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredNotifications}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 20,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleNotificationPress(item)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      notificationStyles.notificationItem as ViewStyle,
                      item.read
                        ? (notificationStyles.notificationRead as ViewStyle)
                        : (notificationStyles.notificationUnread as ViewStyle),
                    ]}
                  >
                    <Text style={notificationStyles.notificationText as TextStyle}>{item.text}</Text>
                    <Text style={notificationStyles.notificationType as TextStyle}>{item.type || "Info"}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        {/* Small message modal */}
        <Modal
          isVisible={showMessageModal}
          onBackdropPress={closeMessageModal}
          animationIn="zoomIn"
          animationOut="zoomOut"
          style={{ justifyContent: "center", alignItems: "center", margin: 0 } as ViewStyle}
        >
          <View style={{
            backgroundColor: theme === "dark" ? "#22345A" : "#fff",
            borderRadius: 18,
            padding: 28,
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 10,
            minWidth: 220,
            maxWidth: 320,
          } as ViewStyle}>
            <Ionicons
              name="notifications"
              size={38}
              color={theme === "dark" ? "#2C8CFF" : PRIMARY_COLOR}
              style={{ marginBottom: 12 }}
            />
            <Text style={{
              color: theme === "dark" ? "#EAEFFF" : "#22345A",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center"
            } as TextStyle}>
              Notification
            </Text>
            <Text style={{
              color: theme === "dark" ? "#BFC9D6" : "#333",
              fontSize: 16,
              textAlign: "center",
              marginBottom: 10
            } as TextStyle}>
              {selectedNotification?.text}
            </Text>
            <TouchableOpacity
              onPress={closeMessageModal}
              style={{
                marginTop: 10,
                backgroundColor: theme === "dark" ? "#2C8CFF" : PRIMARY_COLOR,
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 24,
              } as ViewStyle}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 } as TextStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}
