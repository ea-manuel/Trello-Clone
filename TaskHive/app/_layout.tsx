import Header from "@/components/Header";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";

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
        screenOptions={{
          header:
            pathname !== "/settings" && pathname !== "/auth/login"
              ? (props) => <Header {...props} />
              : () => null,
          drawerContentStyle: {
            backgroundColor: colorScheme === "dark" ? "#4C99E6" : "#7CCABE"
          }
        }}
      />

      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={colorScheme === "dark" ? "#4C99E6" : "#7CCABE"}
      />
    </ThemeProvider>
  );
}
