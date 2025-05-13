import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/Header";
import { usePathname } from "expo-router";

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
          header: pathname !== "/settings" ? (props) => <Header {...props} />:undefined,
          drawerContentStyle: {
            backgroundColor: colorScheme === "dark" ? "#18181b" : "#7CCABE"
          },
        }}
      />
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={colorScheme === "dark" ? "#18181b" : "#7CCABE"}
      />
    </ThemeProvider>
  );
}
