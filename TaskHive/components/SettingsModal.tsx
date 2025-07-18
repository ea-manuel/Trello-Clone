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
        

        {/* Make content scrollable inside modal */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <SettingsContent visible={visible} onClose={onClose} />
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
      paddingTop: 0,
      height: "100%",
      borderTopWidth: 2,
      
    },
    
  });
