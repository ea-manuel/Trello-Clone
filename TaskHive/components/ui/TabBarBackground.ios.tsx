// components/ui/TabBarBackground.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export default function TabBarBackground() {
  return (
    <LinearGradient
      colors={["#76C68F", "#005F94"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  }
});
