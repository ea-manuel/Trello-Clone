import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal"; // Import from react-native-modal
import SettingsContent from "./SettingsContent";

const PRIMARY_COLOR = "#0B1F3A";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({
  visible,
  onClose
}: SettingsModalProps) {
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
        <View style={styles.sheetHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={30} color={"white"} />
          </TouchableOpacity>
          <Text style={styles.sheetTitle}>Settings</Text>
          <View style={{ width: 30 }} /> {/* Spacer */}
        </View>
        <SettingsContent />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0, // Important to cover full screen without margin
    justifyContent: "flex-end", // Align modal content at the bottom
    elevation:8,
  },
  fullScreenModal: {
    backgroundColor: '#0B1F3A',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingTop: 20,
    height: "100%", // Adjust height as needed, e.g. 90% of screen height
    borderWidth:2,
    borderTopColor:'white',
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    justifyContent: "space-between"
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white"
  }
});
