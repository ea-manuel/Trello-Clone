import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const PRIMARY_COLOR = "#34495e";
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function Settings() {
  const navigation = useNavigation();

  // State to control bottom sheet visibility
  const [isSheetVisible, setSheetVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  // Set header with settings icon that opens bottom sheet
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setSheetVisible(true)}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="settings-sharp" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
      title: "Settings",
      headerStyle: {
        backgroundColor: PRIMARY_COLOR,
      },
      headerTintColor: "#fff",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Main content can be empty or summary */}
      <Text style={styles.mainText}>Settings Summary or Placeholder</Text>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={isSheetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            {/* Header of Bottom Sheet */}
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setSheetVisible(false)}>
                <Ionicons name="arrow-down" size={30} color={PRIMARY_COLOR} />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Settings</Text>
              <View style={{ width: 30 }} /> {/* Spacer for alignment */}
            </View>

            <ScrollView style={{ flex: 1 }}>
              {/* Profile Card */}
              <View style={styles.profileCard}>
                <Ionicons name="person-circle" size={70} color={PRIMARY_COLOR} />
                <Text style={styles.profileText}>TaskHive User</Text>
                <Text style={styles.profileText}>@taskhiveuser1324</Text>
                <Text style={styles.profileText}>taskhiveuser@gmail.com</Text>
              </View>

              {/* Settings Sections */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Notifications</Text>
                <Text style={styles.sectionSubtext}>Open system settings</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Application Theme</Text>
                <Text style={styles.sectionSubtext}>Select Theme</Text>
              </View>

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

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Sync</Text>
                <Text style={styles.sectionSubtext}>Sync queue</Text>
              </View>

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
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#36393e",
    justifyContent: "center",
    alignItems: "center",
  },
  mainText: {
    color: "white",
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    height: SCREEN_HEIGHT * 0.85,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileText: {
    fontWeight: "bold",
    fontSize: 16,
    color: PRIMARY_COLOR,
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
