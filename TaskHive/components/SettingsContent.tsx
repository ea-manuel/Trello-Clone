import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View, TouchableOpacity, Modal, Button } from "react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { useTheme } from "../ThemeContext"; // your custom theme hook
import { lightTheme, darkTheme } from "../styles/themes"; // import your themes

export default function SettingsContent() {
  const router = useRouter();

  const { theme, toggleTheme } = useTheme();
  const themeColors = theme === "dark" ? darkTheme : lightTheme;
  const styles = getSettingsStyles(themeColors);

  const [switchStates, setSwitchStates] = useState({
    colorBlindMode: false,
    enableAnimations: false,
    showLabelNames: false,
    showQuickAdd: false
  });

  const toggleSwitch = (key: keyof typeof switchStates) => {
    setSwitchStates((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const logout = () => {
    router.push({ pathname: "/auth/login" });
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Ionicons name="person-circle" size={90} color={theme === "dark" ? "#ffffff" : "white"} />
        <Text style={styles.profileText}>TaskHive User</Text>
        <Text style={styles.profileText}>@taskhiveuser1324</Text>
        <Text style={styles.profileText}>taskhiveuser@gmail.com</Text>
      </View>

      {/* Logout Modal */}
      {showLogoutModal && (
        <Modal visible={showLogoutModal} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <BlurView style={StyleSheet.absoluteFill} intensity={100} tint={theme === "dark" ? "dark" : "light"} />
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Logout</Text>
              <Text style={styles.modalText}>
                Are you sure you want to Logout?
              </Text>
              <View style={styles.modalButtons}>
                <View style={styles.deleteConfirmButton}>
                  <Button
                    title="Logout"
                    onPress={logout}
                    color="red"
                  />
                </View>
                <View style={styles.cancelButton}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowLogoutModal(false)}
                    color="#ADD8E6"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Notifications Section */}
      <View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Notifications</Text>
          <Text style={styles.sectionSubtext}>Open system settings</Text>
        </View>

        {/* Application Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Application Theme</Text>
          <Text style={styles.sectionSubtext}>Select Theme</Text>
          <View style={styles.row}>
            <Text style={styles.sectionSubtext}>Dark Mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#339dff" }}
              thumbColor={theme === "dark" ? "#339dff" : "#f4f3f4"}
              onValueChange={toggleTheme}
              value={theme === "dark"}
            />
          </View>
        </View>

        {/* Accessibility Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Accessibility</Text>
          <View style={styles.row}>
            <Text style={styles.sectionSubtext}>Color blind friendly mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={switchStates.colorBlindMode ? "#339dff" : "#f4f3f4"}
              onValueChange={() => toggleSwitch("colorBlindMode")}
              value={switchStates.colorBlindMode}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.sectionSubtext}>Enable Animations</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={switchStates.enableAnimations ? "#339dff" : "#f4f3f4"}
              onValueChange={() => toggleSwitch("enableAnimations")}
              value={switchStates.enableAnimations}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.sectionSubtext}>Show label names on card front</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={switchStates.showLabelNames ? "#339dff" : "#f4f3f4"}
              onValueChange={() => toggleSwitch("showLabelNames")}
              value={switchStates.showLabelNames}
            />
          </View>
        </View>

        {/* Sync Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Sync</Text>
          <Text style={styles.sectionSubtext}>Sync queue</Text>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>General</Text>
          <Text style={styles.sectionSubtext}>Profile and visibility</Text>
          <Text style={styles.sectionSubtext}>Set app language</Text>
          <View style={styles.row}>
            <Text style={styles.sectionSubtext}>Show quick add</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={switchStates.showQuickAdd ? "#339dff" : "#f4f3f4"}
              onValueChange={() => toggleSwitch("showQuickAdd")}
              value={switchStates.showQuickAdd}
            />
          </View>
          <Text style={styles.sectionSubtext}>Delete account</Text>
          <Text style={styles.sectionSubtext}>About Trello</Text>
          <Text style={styles.sectionSubtext}>More Atlassian apps</Text>
          <Text style={styles.sectionSubtext}>Contact support</Text>
          <Text style={styles.sectionSubtext}>Manage accounts on browser</Text>
          <TouchableOpacity onPress={() => setShowLogoutModal(true)}>
            <Text style={styles.sectionSubtext}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// 🔁 Theme-aware styles
const getSettingsStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: theme.settings.backgroundColor,
    },
    profileCard: {
      alignItems: "center",
      marginBottom: 20,
      backgroundColor: theme.button.backgroundColor,
      marginHorizontal: -20,
      paddingBottom: 15,
    },
    profileText: {
      fontWeight: "bold",
      fontSize: 16,
      color: theme.settings.modalTextColor,
      marginTop: 4,
    },
    section: {
      borderBottomColor: theme.settings.sectionBorderColor,
      borderBottomWidth: 0.5,
      paddingVertical: 10,
    },
    sectionHeader: {
      fontWeight: "bold",
      fontSize: 16,
      color: theme.settings.sectionHeaderColor,
      marginBottom: 5,
    },
    sectionSubtext: {
      fontSize: 14,
      color: theme.settings.modalTextColor,
      marginBottom: 5,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      padding: 40,
      margin: 30,
      borderRadius: 20,
      elevation: 8,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 10,
      minWidth: 300,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 10,
    },
    modalText: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
      color: "#333",
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    deleteConfirmButton: {
      backgroundColor: "#e74c3c",
      borderRadius: 6,
      margin: 5,
    },
    cancelButton: {
      borderRadius: 6,
      margin: 5,
    },
  });
