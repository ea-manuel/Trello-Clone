import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY_COLOR = "#0B1F3A";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({
  visible,
  onClose,
}: SettingsModalProps) {
  const [switchStates, setSwitchStates] = useState({
    colorBlindMode: false,
    enableAnimations: false,
    showLabelNames: false,
    showQuickAdd: false,
  });

  const toggleSwitch = (key: keyof typeof switchStates) => {
    setSwitchStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handler placeholders for touchable items
  const handlePress = (item: string) => {
    // You can replace with navigation or other logic
    console.log("Pressed:", item);
  };

  return (
    <Modal
      isVisible={visible}
      backdropColor="transparent"
      style={styles.modal}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      swipeDirection="right"
      onSwipeComplete={onClose}
      swipeThreshold={100}
      propagateSwipe={true} // important to enable scroll inside modal
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
        >
          {/* Header */}
          <View style={styles.sheetHeader}>
            <TouchableOpacity
              onPress={onClose}
              accessibilityLabel="Close settings"
            >
              <Ionicons name="close" size={30} color={PRIMARY_COLOR} />
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>Settings</Text>
            <View style={{ width: 30 }} />
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <Ionicons
              name="person-circle"
              size={70}
              color={PRIMARY_COLOR}
              style={styles.icon}
            />
            <Text style={styles.profileText}>TaskHive User</Text>
            <Text style={styles.profileText}>@taskhiveuser1324</Text>
            <Text style={styles.profileText}>taskhiveuser@gmail.com</Text>
          </View>

          {/* Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Notifications</Text>
            <TouchableOpacity
              onPress={() => handlePress("Open system settings")}
            >
              <Text style={styles.sectionSubtext}>Open system settings</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Application Theme</Text>
            <TouchableOpacity onPress={() => handlePress("Select Theme")}>
              <Text style={styles.sectionSubtext}>Select Theme</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switches}>
            <Text style={styles.sectionHeader}>Accessibility</Text>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.sectionSubtext}>
                Color blind friendly mode
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#636B2F" }}
                thumbColor={switchStates.colorBlindMode ? "#006400" : "#f4f3f4"}
                onValueChange={() => toggleSwitch("colorBlindMode")}
                value={switchStates.colorBlindMode}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.sectionSubtext}>Enable Animations</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#636B2F" }}
                thumbColor={
                  switchStates.enableAnimations ? "#006400" : "#f4f3f4"
                }
                onValueChange={() => toggleSwitch("enableAnimations")}
                value={switchStates.enableAnimations}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.sectionSubtext}>
                Show label names on card front
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#636B2F" }}
                thumbColor={switchStates.showLabelNames ? "#006400" : "#f4f3f4"}
                onValueChange={() => toggleSwitch("showLabelNames")}
                value={switchStates.showLabelNames}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Sync</Text>
            <TouchableOpacity onPress={() => handlePress("Sync queue")}>
              <Text style={styles.sectionSubtext}>Sync queue</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>General</Text>

            <TouchableOpacity
              onPress={() => handlePress("Profile and visibility")}
            >
              <Text style={styles.sectionSubtext}>Profile and visibility</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePress("Set app language")}>
              <Text style={styles.sectionSubtext}>Set app language</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePress("Delete account")}>
              <Text style={styles.sectionSubtext}>Delete account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePress("Contact support")}>
              <Text style={styles.sectionSubtext}>Contact support</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePress("Log out")}>
              <Text style={styles.sectionSubtext}>Log out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-start",
  },
  container: {
    backgroundColor: PRIMARY_COLOR,
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingTop: 15,
    paddingLeft: 25,
    paddingRight: 20,
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: -3, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    color: "white",
  },
  scrollContent: {
    paddingBottom: 30,
    color: "white",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    color: "white",
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 20,
    color: "white",
  },
  icon: {
    backgroundColor: "white",
    borderRadius: 100,
  },
  profileText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },
  section: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
    paddingVertical: 10,
    color: "white",
  },
  switches: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
    paddingVertical: 10,
    color: "white",
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  sectionSubtext: {
    fontSize: 15,
    color: "white",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    color: "white",
  },
});
