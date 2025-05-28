// (tabs)/_layout.tsx
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { View } from "react-native";

export default function TabsLayout() {
  return (
     
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground() {
          return <View style={{backgroundColor: "#0B1F3A"}} ><TabBarBackground /></View>;
        },
        tabBarActiveTintColor: "#2EC", // or any color you want for active tab
        tabBarInactiveTintColor: "white", // inactive tabs will be white
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "transparent",
            height: 60, paddingTop: 5 
          },
          default: { backgroundColor: "#0B1F3A", height: 60, paddingTop: 5 }
        }), 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Workspace",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="OfflineBoards"
        options={{
          title: "Offline Boards",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="rectangle.stack.fill" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: "Templates",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="folder.fill" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "Help",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="questionmark.circle" color={color} />
          )
        }}
      />
      
      </Tabs>
    
  );
}
