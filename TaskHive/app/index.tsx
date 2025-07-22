import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      router.replace("/auth/welcome");
    }, 3000); // 2-second splash

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.container}>
        <Image source={require("../assets/images/splash.png")} style={styles.logo} />
        <Text style={styles.title}>TaskHive</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 390,
    height: 390,
    resizeMode: "contain",
    marginBottom: 45,
    marginLeft:32,
  },
  title: {
    fontSize: 28,
    color: "#FFF",
    fontWeight: "bold",
  },
});
