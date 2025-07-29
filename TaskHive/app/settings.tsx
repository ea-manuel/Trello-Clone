import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useWorkspaceStore } from "./stores/workspaceStore";
import { getCurrentUser } from "../src/api/userApi.js";

const PRIMARY_COLOR = "#0B1F3A";
const SCREEN_HEIGHT = Dimensions.get("window").height;

interface UserProfile {
  username: string;
  email: string;
}

export default function Settings() {
  const router = useRouter();
  const { clearAllData } = useWorkspaceStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found');
        setLoading(false);
        return;
      }

      const userData = await getCurrentUser(token);
      if (userData) {
        setUserProfile(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear workspace data
              await clearAllData();
              
              // Clear auth token
              await AsyncStorage.removeItem("authToken");
              
              // Navigate to login
              router.replace("/auth/login");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

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
    // This useEffect is for navigation options, but navigation is not defined in this component.
    // Assuming it's meant to be part of a larger context or will be added later.
    // For now, removing the navigation-related code as it's not directly applicable here.
  }, []);

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
                {loading ? (
                  <Text style={styles.profileText}>Loading profile...</Text>
                ) : userProfile ? (
                  <>
                    <Text style={styles.profileText}>{userProfile.username}</Text>
                    <Text style={styles.profileText}>@{userProfile.username.toLowerCase().replace(/\s+/g, '')}</Text>
                    <Text style={styles.profileText}>{userProfile.email}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.profileText}>Failed to load profile</Text>
                    <Text style={styles.profileText}>@user</Text>
                    <Text style={styles.profileText}>user@example.com</Text>
                  </>
                )}
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={fetchUserProfile}
                  disabled={loading}
                >
                  <Ionicons 
                    name="refresh" 
                    size={20} 
                    color={loading ? "#ccc" : PRIMARY_COLOR} 
                  />
                </TouchableOpacity>
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
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={[styles.sectionSubtext, { color: '#E74C3C', fontWeight: 'bold' }]}>Log out</Text>
                </TouchableOpacity>
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
  refreshButton: {
    marginTop: 10,
    padding: 5,
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
