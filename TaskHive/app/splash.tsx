import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";

export default function Index() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  // Animated values
  const logoPosition = useRef(new Animated.Value(200)).current; // starts off-screen right
  const logoRotation = useRef(new Animated.Value(180)).current; // flipped
  const textPosition = useRef(new Animated.Value(200)).current; // starts off-screen right
  const textBounce = useRef(new Animated.Value(1)).current; // scale for bounce

  useEffect(() => {
    Animated.sequence([
      // 1. Logo slides in
      Animated.timing(logoPosition, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
      // 2. Logo flips back
      Animated.timing(logoRotation, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      // 3. Text slides in
      Animated.timing(textPosition, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
      // 4. Bounce effect on text
      Animated.spring(textBounce, {
        toValue: 1.1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(textBounce, {
        toValue: 1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate only after animation completes
      setShowSplash(false);
      router.replace("/auth/welcome");
    });
  }, []);

  const rotateInterpolate = logoRotation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  if (showSplash) {
    return (
      <View style={styles.container}>
        <Animated.Image
          source={require("../assets/images/splashLogo.png")}
          style={[
            styles.logo,
            {
              transform: [
                { translateX: logoPosition },
                { rotateY: rotateInterpolate },
              ],
            },
          ]}
        />
        <Animated.Image
          source={require("../assets/images/splashText.png")}
          style={[
            styles.text,
            {
              transform: [
                { translateX: textPosition },
                { scale: textBounce },
              ],
            },
          ]}
        />
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
    flexDirection: "row",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginRight: 10,
  },
  text: {
    width: 180,
    height: 60,
    resizeMode: "contain",
  },
});
