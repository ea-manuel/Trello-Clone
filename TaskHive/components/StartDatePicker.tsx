import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
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
          <DateTimePicker
            isVisible={pickerVisible}
            mode="datetime"
            date={date || new Date()}
            onConfirm={(selectedDate) => {
              setPickerVisible(false);
              onConfirm(selectedDate);
            }}
            onCancel={() => {
              setPickerVisible(false);
              onCancel();
            }}
          />
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
