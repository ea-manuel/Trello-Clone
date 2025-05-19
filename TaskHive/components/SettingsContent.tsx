import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY_COLOR = "#34495e";

export default function SettingsContent() {
  // Local state for switches; you can lift this up if needed
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Ionicons name="person-circle" size={70} color={PRIMARY_COLOR} />
        <Text style={styles.profileText}>TaskHive User</Text>
        <Text style={styles.profileText}>@taskhiveuser1324</Text>
        <Text style={styles.profileText}>taskhiveuser@gmail.com</Text>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Notifications</Text>
        <Text style={styles.sectionSubtext}>Open system settings</Text>
      </View>

      {/* Application Theme Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Application Theme</Text>
        <Text style={styles.sectionSubtext}>Select Theme</Text>
      </View>

      {/* Accessibility Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Accessibility</Text>
        <View style={styles.row}>
          <Text style={styles.sectionSubtext}>Color blind friendly mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#636B2F" }}
            thumbColor={isEnabled ? "#006400" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.sectionSubtext}>Enable Animations</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#636B2F" }}
            thumbColor={isEnabled ? "#006400" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.sectionSubtext}>Show label names on card front</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#636B2F" }}
            thumbColor={isEnabled ? "#006400" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
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
            trackColor={{ false: "#767577", true: "#636B2F" }}
            thumbColor={isEnabled ? "#006400" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <Text style={styles.sectionSubtext}>Delete account</Text>
        <Text style={styles.sectionSubtext}>About Trello</Text>
        <Text style={styles.sectionSubtext}>More Atlassian apps</Text>
        <Text style={styles.sectionSubtext}>Contact support</Text>
        <Text style={styles.sectionSubtext}>Manage accounts on browser</Text>
        <Text style={styles.sectionSubtext}>Log out</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileText: {
    fontWeight: "bold",
    fontSize: 16,
    color: PRIMARY_COLOR,
    marginTop: 4,
  },
  section: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 16,
    color: PRIMARY_COLOR,
    marginBottom: 5,
  },
  sectionSubtext: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});
