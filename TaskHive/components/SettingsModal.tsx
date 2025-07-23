import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import SettingsContent from "./SettingsContent";
import { useTheme } from "../ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";

const screenWidth = Dimensions.get("window").width;

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({
  visible,
  onClose,
}: SettingsModalProps) {
  const { theme } = useTheme();
  const themeStyles = theme === "dark" ? darkTheme : lightTheme;

  // Track if close initiated by back button
  const [isBackButtonClose, setIsBackButtonClose] = useState(false);

  // Handler for back button press
  const handleBackButtonPress = () => {
    setIsBackButtonClose(true);
    onClose();
  };

  // Reset on reopen
  useEffect(() => {
    if (visible) {
      setIsBackButtonClose(false);
    }
  }, [visible]);

  const styles = getStyles(themeStyles, theme);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={handleBackButtonPress}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      animationInTiming={300}
      animationOutTiming={200}
      style={styles.modal}
      useNativeDriver={true}
      swipeDirection="right"
      onSwipeComplete={onClose}
      swipeThreshold={100}
      propagateSwipe={true}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackButtonPress}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={30}
              color={themeStyles.settingsModal.headerTextColor}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Scrollable Settings Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable style={styles.pressable} android_disableSound>
            <SettingsContent visible={visible} onClose={onClose} />
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

const getStyles = (themeStyles: any, theme: string) =>
  StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: "flex-end",
      flexDirection: "row",
    },

    container: {
      width: screenWidth * 0.9,
      height: "100%",
      backgroundColor: themeStyles.settingsModal.backgroundColor,
      borderTopLeftRadius: 24,
      borderBottomLeftRadius: 24,
      overflow: "hidden",
      paddingTop: 0,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 36,
      paddingBottom: 18,
      backgroundColor: themeStyles.settingsModal.backgroundColor,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#22345A" : "#e6e6e6",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      zIndex: 2,
    },

    backButton: {
      marginRight: 10,
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: themeStyles.settingsModal.headerTextColor,
      flex: 1,
      textAlign: "left",
    },

    scrollContentContainer: {
      flexGrow: 1,
      paddingBottom: 20,
    },

    pressable: {
      flex: 1,
    },
  });
