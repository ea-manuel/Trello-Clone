// app/auth/login.tsx
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const PRIMARY_COLOR = "#1F80E0";

export default function Login() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.mainpage}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.body}>
        <View style={styles.createBoardButton}>
          <TouchableOpacity
            onPress={() => router.push("/")} // Navigate to /login route
            style={styles.button}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Go Home</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainpage: {
    flex: 1,
    backgroundColor: "white"
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20
  },
  body: {
    padding: 20,
    alignItems: "center"
  },
  maintext: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#36454F"
  },
  subtext: {
    fontSize: 18,
    fontWeight: "500",
    color: "#808080",
    marginBottom: 20
  },
  createBoardButton: {
    marginTop: 20
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8
  }
});
