import Header from "@/components/Header";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { usePathname, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";

import React from "react";

function CustomDrawerContent(props) {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <DrawerContentScrollView
      {...props}
      style={{
        backgroundColor: colorScheme === "dark" ? "#34495e" : "#34495e", // fixed typo here
        flex: 1
      }}
    >
      {/* Custom links */}
      <DrawerItem
        label="Home"
        labelStyle={{ color: "white" }}
        onPress={() => router.push("/(tabs)")}
      />
      <DrawerItem
        label="Boards"
        labelStyle={{ color: "white" }}
        onPress={() => router.push("/boards")}
      />
      {/* Add more custom DrawerItem as needed */}
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          header:
            pathname !== "/auth/login" &&
            pathname !== "/templates" &&
            !pathname.startsWith("/boards")
              ? (props) => <Header {...props} />
              : () => null,
          drawerStyle: {
            backgroundColor: colorScheme === "dark" ? "#34495e" : "#34495e"
          },
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#ccc"
        }}
      />

      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={colorScheme === "dark" ? "#34495e" : "#34495e"}
      />
    </ThemeProvider>
  );
}
