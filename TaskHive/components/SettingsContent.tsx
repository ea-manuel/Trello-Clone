import { Ionicons } from "@expo/vector-icons";
import React, { useState, useMemo, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Button,
  TextInput,
  Image,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from '../src/api/userApi';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsContent({
  visible,
  onClose,
}: SettingsModalProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const themeColors = theme === "dark" ? darkTheme : lightTheme;
  const styles = getSettingsStyles(themeColors);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [user, setUser] = useState<{ name?: string; username?: string; email?: string } | null>(null);

  // Load profile image from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const uri = await AsyncStorage.getItem("profileImageUri");
      if (uri) setProfileImage(uri);
      // Fetch user info from backend
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const userInfo = await getCurrentUser(token);
        if (userInfo) setUser(userInfo);
      }
    })();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow access to your media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      await AsyncStorage.setItem("profileImageUri", result.assets[0].uri);
    }
  };

  const [switchStates, setSwitchStates] = useState({
    colorBlindMode: false,
    enableAnimations: false,
    showLabelNames: false,
    showQuickAdd: false,
  });

  const [searchText, setSearchText] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        setSwitchStates(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings: typeof switchStates) => {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const toggleSwitch = (key: keyof typeof switchStates) => {
    const newSettings = {
      ...switchStates,
      [key]: !switchStates[key],
    };
    setSwitchStates(newSettings);
    saveSettings(newSettings);
  };

  const logout = async () => {
    try {
      // Clear all stored data
      await AsyncStorage.multiRemove([
        'authToken',
        'userSettings',
        'profileImageUri',
        'taskhive_workspaces',
        'taskhive_boards',
        'taskhive_current_workspace'
      ]);
      
      // Close modal and redirect
      setShowLogoutModal(false);
      router.replace("/auth/login");
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if clearing fails
      router.replace("/auth/login");
    }
  };

  const contactSupport = () => {
    const email = 'support@taskhive.app';
    const subject = 'TaskHive Support Request';
    const body = 'Hello TaskHive Support Team,\n\nI need help with the following issue:\n\n[Please describe your issue here]\n\nThank you!';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(mailtoUrl).then(supported => {
      if (supported) {
        Linking.openURL(mailtoUrl);
      } else {
        Alert.alert('Error', 'No email app found. Please email us at support@taskhive.app');
      }
    });
  };

  const showAboutApp = () => {
    Alert.alert(
      'About TaskHive',
      'TaskHive v1.0.0\n\nA modern task management app for teams and individuals.\n\nMade with ❤️ by the TaskHive Team',
      [{ text: 'OK' }]
    );
  };

  const settingsData = [
    {
      section: "Notifications",
      items: [{ label: "Open system settings", type: "text" }],
    },
    {
      section: "Application Theme",
      items: [
        {
          label: "Dark Mode",
          type: "switch",
          value: theme === "dark",
          onToggle: toggleTheme,
        },
      ],
    },
    {
      section: "Accessibility",
      items: [
        {
          label: "Color blind friendly mode",
          type: "switch",
          value: switchStates.colorBlindMode,
          onToggle: () => toggleSwitch("colorBlindMode"),
        },
        {
          label: "Enable Animations",
          type: "switch",
          value: switchStates.enableAnimations,
          onToggle: () => toggleSwitch("enableAnimations"),
        },
        {
          label: "Show label names on card front",
          type: "switch",
          value: switchStates.showLabelNames,
          onToggle: () => toggleSwitch("showLabelNames"),
        },
      ],
    },
    {
      section: "Sync",
      items: [{ label: "Sync queue", type: "text" }],
    },
    {
      section: "General",
      items: [
        { label: "Profile and visibility", type: "text" },
        { label: "Set app language", type: "text" },
        {
          label: "Show quick add",
          type: "switch",
          value: switchStates.showQuickAdd,
          onToggle: () => toggleSwitch("showQuickAdd"),
        },
        { label: "Delete account", type: "text" },
        { 
          label: "About TaskHive", 
          type: "action",
          onPress: showAboutApp,
        },
        { label: "More Atlassian apps", type: "text" },
        { 
          label: "Contact support", 
          type: "action",
          onPress: contactSupport,
        },
        { label: "Manage accounts on browser", type: "text" },
        {
          label: "Log out",
          type: "action",
          onPress: () => setShowLogoutModal(true),
        },
      ],
    },
  ];

  const filteredSettings = useMemo(() => {
    if (!searchText.trim()) return settingsData;

    const lowerSearch = searchText.toLowerCase();
    return settingsData
      .map((section) => {
        const matchedItems = section.items.filter((item) =>
          item.label.toLowerCase().includes(lowerSearch)
        );
        if (
          matchedItems.length > 0 ||
          section.section.toLowerCase().includes(lowerSearch)
        ) {
          return {
            ...section,
            items: matchedItems.length > 0 ? matchedItems : section.items,
          };
        }
        return null;
      })
      .filter(Boolean) as typeof settingsData;
  }, [searchText]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled" // <-- helps taps pass through when keyboard is open
    >
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={() => profileImage && setShowFullImage(true)} style={{ alignItems: "center" }}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 10,
                borderWidth: 2,
                borderColor: "#ccc",
              }}
            />
          ) : (
            <Ionicons
              name="person-circle"
              size={90}
              color={theme === "dark" ? "#ffffff" : "white"}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage}>
          <Text style={{ color: "#339dff", marginTop: 6 }}>
            {profileImage ? "Change Photo" : "Add Photo"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.profileText}>{user?.username || "TaskHive User"}</Text>
        <Text style={styles.profileText}>{user?.username ? `@${user.username.toLowerCase().replace(/\s+/g, '')}` : "@taskhiveuser1324"}</Text>
        <Text style={styles.profileText}>{user?.email || "taskhiveuser@gmail.com"}</Text>
      </View>
      {/* Full Image Modal */}
      <Modal visible={showFullImage} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity style={{ position: "absolute", top: 40, right: 30, zIndex: 2 }} onPress={() => setShowFullImage(false)}>
            <Ionicons name="close" size={36} color="#fff" />
          </TouchableOpacity>
          {profileImage && (
            <Image
              source={{ uri: profileImage }}
              style={{ width: 320, height: 320, borderRadius: 16, borderWidth: 2, borderColor: "#fff" }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={20}
            color={theme === "dark" ? "white" : "#555"}
          />
          <TextInput
            placeholder="Search settings..."
            placeholderTextColor={theme === "dark" ? "#aaa" : "#888"}
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme === "dark" ? "white" : "#555"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Logout Modal */}
      {showLogoutModal && (
        <Modal visible={showLogoutModal} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <BlurView
              style={StyleSheet.absoluteFill}
              intensity={100}
              tint={theme === "dark" ? "dark" : "light"}
            />
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Logout</Text>
              <Text style={styles.modalText}>
                Are you sure you want to Logout?
              </Text>
              <View style={styles.modalButtons}>
                <View style={styles.deleteConfirmButton}>
                  <Button title="Logout" onPress={logout} color="red" />
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

      {/* Render filtered settings */}
      {filteredSettings.map((section, i) => (
        <View key={i} style={styles.section}>
          <Text style={styles.sectionHeader}>{section.section}</Text>
          {section.items.map((item, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.sectionSubtext}>{item.label}</Text>
              {item.type === "switch" && (
                <Switch
                  trackColor={{ false: "#767577", true: "#339dff" }}
                  thumbColor={item.value ? "#339dff" : "#f4f3f4"}
                  onValueChange={item.onToggle}
                  value={item.value}
                />
              )}
              {item.type === "action" && (
                <TouchableOpacity onPress={item.onPress}>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color={theme === "dark" ? "white" : "#555"}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const getSettingsStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: theme.settings.backgroundColor,
    },
    headerText: {
      color: theme.settings.headerTextColor,
    },
    profileCard: {
      alignItems: "center",
      marginBottom: 20,
      backgroundColor: theme.settings.profileCardBg,
      marginHorizontal: -20,
      paddingBottom: 15,
      paddingTop: 25,
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
    sheetHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 10,
      justifyContent: "space-between",
    },
    sheetTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.settingsModal.headerTextColor,
    },
    searchContainer: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 10,
    },
    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.settings.searchBackground || "#f0f0f0",
      borderRadius: 10,
      paddingHorizontal: 10,
      height: 50,
      borderColor: theme.settings.searchBorderColor,
      borderWidth: 2,
    },
    searchInput: {
      flex: 1,
      color: theme.settings.searchTextColor || "#000",
      marginLeft: 8,
      fontSize: 16,
      height: "100%",
    },
  });
