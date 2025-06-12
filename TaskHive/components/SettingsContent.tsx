import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Touchable } from "react-native";
import { ScrollView, StyleSheet, Switch, Text, View,TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
const PRIMARY_COLOR = "#0B1F3A";

export default function SettingsContent() {
  const router=useRouter();
  // State to control individual switches
  const [switchStates, setSwitchStates] = useState({
    colorBlindMode: false,
    enableAnimations: false,
    showLabelNames: false,
    showQuickAdd: false
  });

  // Toggle function for individual switches
  const toggleSwitch = (key: keyof typeof switchStates) => {
    setSwitchStates((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const logout = ()=>{
    router.push({
      pathname:"/auth/login"
    })
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Ionicons name="person-circle" size={90} color='#ffffff' />
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
          <Text style={styles.sectionSubtext}>
            Show label names on card front
          </Text>
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
        <TouchableOpacity onPress={logout}>
        <Text style={styles.sectionSubtext}>Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor:'#142f4d'
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor:'#0B1F3A',
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