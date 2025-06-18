import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const PRIMARY_COLOR = "#1F80E0";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/splash.png")} // Use your logo image path
        style={styles.logo}
      />

      <Text style={styles.title}>Signup to continue</Text>

      {/* Input fields */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        placeholderTextColor="#888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Terms text */}
      <Text style={styles.terms}>
        By signing up, you agree to our{" "}
        <Text style={styles.link}>Terms of service</Text> and the{" "}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>

      {/* Sign up button */}
      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Sign up</Text>
      </TouchableOpacity>

      {/* Or continue with */}
      <Text style={styles.orText}>Or continue with:</Text>

      {/* Social buttons */}
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign
            name="google"
            size={24}
            color="#EA4335"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome
            name="windows"
            size={24}
            color="#00A4EF"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.socialButtonText}>Microsoft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign
            name="apple1"
            size={24}
            color="#000"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.socialButtonText}>Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome5
            name="slack"
            size={24}
            color="#4A154B"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.socialButtonText}>Slack</Text>
        </TouchableOpacity>
      </View>

      {/* Link to Login page */}
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    alignItems: "center"
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: "cover",
    marginBottom: 10,
    marginTop: 0
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 10,
    textTransform: "capitalize"
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#B3B3B3",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    marginBottom: 25,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2
  },
  terms: {
    fontSize: 13,
    color: "#222",
    marginBottom: 18,
    marginTop: 2,
    textAlign: "center"
  },
  link: {
    textDecorationLine: "underline"
  },
  signupButton: {
    width: "100%",
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#1F80E0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18
  },
  orText: {
    fontSize: 16,
    color: "#444",
    alignSelf: "center",
    marginVertical: 12
  },
  socialButtonsContainer: {
    width: "100%",
    marginBottom: 24
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    marginBottom: 10
  },
  socialButtonText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500"
  },
  loginText: {
    fontSize: 15,
    color: "#1F80E0",
    alignSelf: "center",
    marginTop: 10
  },
  loginLink: {
    color: "#1F80E0",
    textDecorationLine: "underline"
  }
});
