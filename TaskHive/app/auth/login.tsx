// app/auth/login.tsx
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { makeRedirectUri } from "expo-auth-session";
WebBrowser.maybeCompleteAuthSession(); // Required for auth to work right on mobile

const PRIMARY_COLOR = "#1F80E0";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidepassword, setHidepassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const redirectUri = makeRedirectUri({
    useProxy: false,
    scheme: "mobileappdev53",
  } as any);

  console.log("Redirect URI:", redirectUri);
  const router = useRouter();

  // 👇 Google OAuth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "446088618650-ln9468vbrhs00gv8s20pe5uu9qst0a0t.apps.googleusercontent.com",
    androidClientId:
      "446088618650-123aprvhu993jhpr44fvnb365sab8kfl.apps.googleusercontent.com",
    iosClientId:
      "446088618650-u7uqkjh7tvs1lvsl2rv20hbqrgngs158.apps.googleusercontent.com",
    webClientId:
      "446088618650-a9i9akf872soauef7r78lbdr61h8vblr.apps.googleusercontent.com",
    redirectUri,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        loginWithGoogle(authentication.accessToken);
      }
    }
  }, [response]);

  const loginWithGoogle = async (accessToken: string) => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://192.168.8.196:8080/api/auth/google",
        {
          token: accessToken,
        }
      );

      const token = res.data.token;
      if (!token) throw new Error("JWT token not returned");

      await AsyncStorage.setItem("authToken", token);
      Alert.alert("Login Successful", "Welcome via Google!");
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Google login failed", err.response?.data || err.message);
      Alert.alert("Google Login Failed", "Could not authenticate with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("http://10.36.13.65:8080/api/auth/login", {
        email,
        password
      });

      const token = response.data.token;
      if (!token) throw new Error("Token not found in response.");

      await AsyncStorage.setItem("authToken", token);
      Alert.alert("Login Success", "You're now logged in.");
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Login Error:", error.response?.data || error.message);
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Login failed. Please check your credentials.";
      Alert.alert(
        "Login Failed",
        typeof message === "string" ? message : "Unknown error."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../../assets/images/splash.png")}
        style={styles.topImage}
      />
      <View style={{ height: 60 }} />

      <Text style={styles.title}>Login to continue</Text>
      <TextInput
        style={[styles.input, loading && { opacity: 0.6 }]}
        placeholder="Enter your email or username"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <View style={{ width: "100%", position: "relative", marginBottom: 25 }}>
        <TextInput
          style={[
            styles.input,
            { paddingRight: 40, marginBottom: 0 },
            loading && { opacity: 0.6 },
          ]}
          placeholder="Enter your password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          keyboardType="default"
          secureTextEntry={hidepassword}
          autoCapitalize="none"
          editable={!loading}
        />
        <TouchableOpacity
          onPress={() => setHidepassword(!hidepassword)}
          style={{
            position: "absolute",
            right: 12,
            top: 0,
            height: "100%",
            justifyContent: "center",
          }}
        >
          {hidepassword ? (
            <Ionicons name="eye" size={22} color="#888" />
          ) : (
            <Ionicons name="eye-off" size={22} color="#888" />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.terms}>
        By signing up, you agree to our{" "}
        <Text style={styles.link}>Terms of service</Text> and the{" "}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007CF0"
          style={{ marginTop: 20 }}
        />
      ) : (
        <TouchableOpacity onPress={handleLogin} style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Login</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.orText}>Or continue with:</Text>
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => promptAsync()}
          disabled={!request}
        >
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

      <TouchableOpacity onPress={() => router.push("/auth/signup")}>
        <Text style={styles.loginText}>
          Don't have an account? <Text style={styles.loginLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// [styles remain unchanged — no need to paste again]
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    alignItems: "center",
  },
  topImage: {
    width: 200,
    height: 100,
    resizeMode: "cover",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 40,
    marginTop: -40,
    // textTransform: "lowercase"
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
    elevation: 2,
  },
  terms: {
    fontSize: 13,
    color: "#222",
    marginBottom: 18,
    marginTop: 2,
    textAlign: "center",
  },
  link: {
    textDecorationLine: "underline",
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
    elevation: 3,
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  orText: {
    fontSize: 16,
    color: "#444",
    alignSelf: "center",
    marginVertical: 12,
  },
  socialButtonsContainer: {
    width: "100%",
    gap: 14,
    marginBottom: 24,
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
    marginBottom: 10,
  },

  socialButtonText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  loginText: {
    fontSize: 15,
    color: "#4C99E6",
    alignSelf: "center",
    marginTop: 10,
  },
  loginLink: {
    color: "#1F80E0",
    textDecorationLine: "underline",
  },
});
