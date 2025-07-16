import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Modal from "react-native-modal";
import SettingsContent from "./SettingsContent";
import { useTheme } from "../ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { theme } = useTheme();
  const themeStyles = theme === "dark" ? darkTheme : lightTheme;
  const styles = getSettingsModalStyles(themeStyles);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      style={styles.modalContainer}
      useNativeDriver={true}
      swipeDirection="down"
      onSwipeComplete={onClose}
      swipeThreshold={100}
    >
      <View style={styles.fullScreenModal}>
        <View style={styles.sheetHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={30} color={themeStyles.headerText.color} />
          </TouchableOpacity>
          <Text style={styles.sheetTitle}>Settings</Text>
          <View style={{ width: 30 }} /> {/* Spacer */}
        </View>

        {/* Make content scrollable inside modal */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <SettingsContent />
        </ScrollView>
      </View>
    </Modal>
  );
}

const getSettingsModalStyles = (theme: any) =>
  StyleSheet.create({
    modalContainer: {
      margin: 0,
      justifyContent: "flex-end",
      elevation: 8,
    },
    fullScreenModal: {
     backgroundColor: theme.settingsModal.backgroundColor,
     borderTopColor: theme.settingsModal.borderTopColor,

      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      paddingTop: 20,
      height: "100%",
      borderTopWidth: 2,
      
    },
    sheetHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 10,
      justifyContent: "space-between",
    },
    sheetTitle: {
      fontSize: 22,
      fontWeight: "bold",
     color: theme.settingsModal.headerTextColor,

    },
  });
