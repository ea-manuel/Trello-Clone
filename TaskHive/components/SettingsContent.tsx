import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

const PRIMARY_COLOR = "#0B1F3A";

export default function SettingsContent() {
  // Local state for switches; you can lift this up if needed
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Ionicons name="person-circle" size={90} color={PRIMARY_COLOR} />
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
          <Text style={styles.sectionSubtext}>
            Show label names on card front
          </Text>
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
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
    backgroundColor:'#B6D0E2'
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor:'#5B7C99',
    marginHorizontal:-20,
    paddingBottom:15,
  },
  profileText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
    marginTop: 4
  },
  section: {
    borderBottomColor: "white",
    borderBottomWidth: 0.5,
    paddingVertical: 10
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
    marginBottom: 5
  },
  sectionSubtext: {
    fontSize: 14,
    color: "white",
    marginBottom: 5
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  }
});
