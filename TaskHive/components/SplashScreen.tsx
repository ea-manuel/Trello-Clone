// app/SplashScreen.tsx
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export const options = {
  headerShown: false,
};

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000); // splash stays for 2s
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/splash.png")} style={styles.logo} />
      <Text style={styles.title}>TaskHive</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 500,
    height: 500,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: "#FFF",
    fontWeight: "bold",
  },
});
