import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import axios from "axios";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL, AUTH_ENDPOINTS } from "../../appconstants/api.js";

const PRIMARY_COLOR = "#1F80E0";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hidepassword, setHidepassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const router = useRouter();

  // Step 1: Send OTP to email
  const handleVerifyEmail = async () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    try {
      // Register user first (unverified)
      await axios.post(`${API_BASE_URL}${AUTH_ENDPOINTS.REGISTER}`, {
        email,
        username,
        password,
      });
      // Then send OTP
      await axios.post(`${API_BASE_URL}${AUTH_ENDPOINTS.SEND_OTP}?email=${encodeURIComponent(email)}`);
      setShowOtpModal(true);
      Alert.alert("OTP Sent", "Check your email for the OTP.");
    } catch (error: any) {
      const message = error?.response?.data || "Failed to send OTP or register user.";
      Alert.alert("Error", message);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }
    setIsVerifyingOtp(true);
    try {
      // Call backend to verify OTP (as request param)
      const response = await axios.post(`${API_BASE_URL}${AUTH_ENDPOINTS.VERIFY_OTP}?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
      if (response.data === "Account verified successfully.") {
        setIsOtpVerified(true);
        setShowOtpModal(false);
        Alert.alert("Success", "Email verified. You can now sign up.");
      } else {
        Alert.alert("Error", "Invalid OTP. Try again.");
      }
    } catch (error: any) {
      const message = error?.response?.data || "Failed to verify OTP.";
      Alert.alert("Error", message);
    }
    setIsVerifyingOtp(false);
  };

  // Step 3: Signup after OTP verification
  const handleSignup = async () => {
    if (!isOtpVerified) {
      Alert.alert("Error", "Please verify your email first.");
      return;
    }
    // User is already registered, just show success and redirect
    Alert.alert("Success", "Signup complete. You can now log in.");
    router.push("/auth/login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/splash.png")}
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
      <View style={{ width: "100%", position: "relative", marginBottom: 25 }}>
        <TextInput
          style={[styles.input, { paddingRight: 40, marginBottom: 0 }]}
          placeholder="Enter your password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          keyboardType="default"
          secureTextEntry={hidepassword}
          autoCapitalize="none"
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
      <View style={{ width: "100%", position: "relative", marginBottom: 25 }}>
        <TextInput
          style={[styles.input, { paddingRight: 40, marginBottom: 0 }]}
          placeholder="Confirm your password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          keyboardType="default"
          secureTextEntry={hidepassword}
          autoCapitalize="none"
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

      {/* Terms text */}
      <Text style={styles.terms}>
        By signing up, you agree to our{" "}
        <Text style={styles.link}>Terms of service</Text> and the{" "}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>

      {/* Verify Email button (step 1) */}
      {!isOtpVerified && (
        <TouchableOpacity style={styles.signupButton} onPress={handleVerifyEmail}>
          <Text style={styles.signupButtonText}>Verify Email</Text>
        </TouchableOpacity>
      )}

      {/* Sign up button (step 3) */}
      {isOtpVerified && (
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign up</Text>
        </TouchableOpacity>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <View style={styles.otpModalOverlay}>
          <View style={styles.otpModalContainer}>
            <Text style={styles.otpModalTitle}>Enter OTP</Text>
            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              placeholderTextColor="#888"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
            <TouchableOpacity
              style={styles.otpVerifyButton}
              onPress={handleVerifyOtp}
              disabled={isVerifyingOtp}
            >
              <Text style={styles.otpVerifyButtonText}>{isVerifyingOtp ? "Verifying..." : "Verify"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowOtpModal(false)}>
              <Text style={{ color: "#1F80E0", marginTop: 10 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Or continue with */}
      <Text style={styles.orText}>Or continue with:</Text>

      {/* Social buttons */}
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons
            name="logo-google"
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
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: "cover",
    marginBottom: 10,
    marginTop: 0,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 10,
    textTransform: "capitalize",
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
    color: "#1F80E0",
    alignSelf: "center",
    marginTop: 10,
  },
  loginLink: {
    color: "#1F80E0",
    textDecorationLine: "underline",
  },
  otpModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  otpModalContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    elevation: 5,
  },
  otpModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  otpInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#B3B3B3",
    borderRadius: 5,
    padding: 12,
    fontSize: 18,
    marginBottom: 18,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  otpVerifyButton: {
    width: "100%",
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 8,
  },
  otpVerifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
