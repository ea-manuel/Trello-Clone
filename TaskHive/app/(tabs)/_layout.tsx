import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { useTheme } from "../../ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Import

export default function TabsLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets(); // Get safe area insets

  const backgroundColor = theme === "dark" ? "#00102C" : "#0B1F3A";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground() {
          return (
            <View style={{ backgroundColor }}>
              <TabBarBackground />
            </View>
          );
        },
        tabBarActiveTintColor: "#2EC",
        tabBarInactiveTintColor: "white",
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "transparent",
            height: 60 + insets.bottom, // Add bottom inset
            paddingTop: 5,
            paddingBottom: insets.bottom, // Add safe area padding
          },
          default: {
            backgroundColor,
            height: 60 + insets.bottom, // Add bottom inset for android
            paddingBottom: insets.bottom,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Workspace",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="OfflineBoards"
        options={{
          title: "Offline Boards",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="rectangle.stack.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: "Templates",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="folder.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "Help",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="questionmark.circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
