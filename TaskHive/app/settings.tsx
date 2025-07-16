import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY_COLOR = "#0B1F3A";
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function Settings() {
  const navigation = useNavigation();

  const [isSheetVisible, setSheetVisible] = useState(false);
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setSheetVisible(true)}
          style={{ marginRight: 15 }}
          accessibilityLabel="Open settings"
        >
          <Ionicons name="settings-sharp" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 15 }}
          accessibilityLabel="Go back"
        >
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
      <Text style={styles.mainText}>Settings Summary or Placeholder</Text>

      <Modal
        visible={isSheetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            {/* Bottom Sheet Header */}
            <View style={styles.sheetHeader}>
              <TouchableOpacity
                onPress={() => setSheetVisible(false)}
                accessibilityLabel="Close settings"
              >
                <Ionicons name="arrow-down" size={30} color={PRIMARY_COLOR} />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Settings</Text>
              <View style={{ width: 30 }} /> {/* Spacer */}
            </View>

            {/* Scrollable content */}
            <ScrollView
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Profile Card */}
              <View style={styles.profileCard}>
                <Ionicons
                  name="person-circle"
                  size={70}
                  color={PRIMARY_COLOR}
                />
                <Text style={styles.profileText}>TaskHive User</Text>
                <Text style={styles.profileText}>@taskhiveuser1324</Text>
                <Text style={styles.profileText}>taskhiveuser@gmail.com</Text>
              </View>

              {/* Sections */}
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
                  <Text style={styles.sectionSubtext}>
                    Color blind friendly mode
                  </Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#636B2F" }}
                    thumbColor={
                      switchStates.colorBlindMode ? "#006400" : "#f4f3f4"
                    }
                    onValueChange={() => toggleSwitch("colorBlindMode")}
                    value={switchStates.colorBlindMode}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.sectionSubtext}>Enable Animations</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#636B2F" }}
                    thumbColor={
                      switchStates.enableAnimations ? "#006400" : "#f4f3f4"
                    }
                    onValueChange={() => toggleSwitch("enableAnimations")}
                    value={switchStates.enableAnimations}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.sectionSubtext}>
                    Show label names on card front
                  </Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#636B2F" }}
                    thumbColor={
                      switchStates.showLabelNames ? "#006400" : "#f4f3f4"
                    }
                    onValueChange={() => toggleSwitch("showLabelNames")}
                    value={switchStates.showLabelNames}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Sync</Text>
                <Text style={styles.sectionSubtext}>Sync queue</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>General</Text>
                <Text style={styles.sectionSubtext}>
                  Profile and visibility
                </Text>
                <Text style={styles.sectionSubtext}>Set app language</Text>
                <View style={styles.row}>
                  <Text style={styles.sectionSubtext}>Show quick add</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#636B2F" }}
                    thumbColor={
                      switchStates.showQuickAdd ? "#006400" : "#f4f3f4"
                    }
                    onValueChange={() => toggleSwitch("showQuickAdd")}
                    value={switchStates.showQuickAdd}
                  />
                </View>
                <Text style={styles.sectionSubtext}>Delete account</Text>
                <Text style={styles.sectionSubtext}>About Trello</Text>
                <Text style={styles.sectionSubtext}>More Atlassian apps</Text>
                <Text style={styles.sectionSubtext}>Contact support</Text>
                <Text style={styles.sectionSubtext}>
                  Manage accounts on browser
                </Text>
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
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 15,
    maxHeight: SCREEN_HEIGHT * 0.85,
    // Use flexGrow to allow ScrollView to fill available space
  },
  scrollContentContainer: {
    paddingBottom: 30,
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
