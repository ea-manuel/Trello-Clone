import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  // Navigate to Sign Up screen
  const handleSignUp = () => {
    router.push("/auth/signup"); // Adjust path as per your routing structure
  };

  // Navigate to Login screen
  const handleLogin = () => {
    router.push("/auth/login"); // Adjust path as per your routing structure
  };

  return (
    <View style={styles.container}>
      {/* Illustration Section */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/welcomeIllustration.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.headline}>“Organize.Collaborate.Thrive.”</Text>

        <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By signing up you agree to the{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://yourapp.com/terms")}
          >
            Terms of service
          </Text>{" "}
          and{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://yourapp.com/privacy")}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:support@yourapp.com")}
        >
          <Text style={styles.supportText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "flex-start"
  },
  illustrationContainer: {
    height: height * 0.55, // Increased height to 55% for bigger image
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10
  },
  illustration: {
    width: width * 0.9, // 90% of screen width
    height: "100%"
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    justifyContent: "flex-start"
  },
  headline: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 32,
    marginTop: 10
  },
  signupBtn: {
    backgroundColor: "#E5E5E5",
    borderRadius: 0,
    paddingVertical: 13,
    width: "100%",
    marginBottom: 14,
    alignItems: "center"
  },
  signupText: {
    color: "#181818",
    fontWeight: "700",
    fontSize: 16
  },
  loginBtn: {
    borderColor: "#E5E5E5",
    borderWidth: 2,
    borderRadius: 0,
    paddingVertical: 13,
    width: "100%",
    marginBottom: 32,
    alignItems: "center"
  },
  loginText: {
    color: "#E5E5E5",
    fontWeight: "700",
    fontSize: 16
  },
  termsText: {
    color: "#bbb",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 8
  },
  link: {
    color: "#8ab4f8",
    textDecorationLine: "underline"
  },
  footer: {
    alignItems: "center",
    paddingBottom: 18
  },
  supportText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    textDecorationLine: "underline"
  }
});
