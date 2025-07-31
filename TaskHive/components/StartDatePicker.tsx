import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform } from "react-native";
import SafeDateTimePicker from "./SafeDateTimePicker";
import { Ionicons } from "@expo/vector-icons";

interface StartDatePickerModalProps {
  visible: boolean;
  date: Date | null;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  styles: any;
}

export default function StartDatePickerModal({
  visible,
  date,
  onConfirm,
  onCancel,
  styles,
}: StartDatePickerModalProps) {
  const [pickerVisible, setPickerVisible] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      setPickerVisible(true);
    } else {
      setPickerVisible(false);
    }
  }, [visible]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setPickerVisible(false);
      if (event.type === 'dismissed') {
        onCancel();
        return;
      }
    }
    
    if (selectedDate) {
      onConfirm(selectedDate);
    } else {
      onCancel();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Start Date & Time</Text>
          {Platform.OS === 'ios' && (
            <SafeDateTimePicker
              value={date || new Date()}
              mode="datetime"
              display="spinner"
              onChange={handleDateChange}
              style={{ width: '100%' }}
            />
          )}
          {Platform.OS === 'android' && pickerVisible && (
            <SafeDateTimePicker
              value={date || new Date()}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity onPress={onCancel} style={{ marginRight: 16 }}>
              <Text style={{ color: "#3b82f6", fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
            {Platform.OS === 'ios' && (
              <TouchableOpacity onPress={() => onConfirm(date || new Date())}>
                <Text style={{ color: "#3b82f6", fontSize: 16 }}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const stylesInner = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.50)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 20,
    width: "90%",
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
});
