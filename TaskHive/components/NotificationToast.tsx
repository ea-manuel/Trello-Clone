import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TYPE_COLORS = {
  success: "#2ecc40",
  error: "#e74c3c",
  warning: "#f1c40f",
  info: "#3498db",
};

const TYPE_ICONS = {
  success: "checkmark-circle",
  error: "close-circle",
  warning: "warning",
  info: "information-circle",
};

export default function NotificationToast({ visible, message, type = "info", onHide }) {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 350,
          useNativeDriver: true,
        }).start(() => onHide && onHide());
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: TYPE_COLORS[type] || TYPE_COLORS.info,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Ionicons
        name={TYPE_ICONS[type] || TYPE_ICONS.info}
        size={22}
        color="#fff"
        style={{ marginRight: 8 }}
      />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  toastText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
}); 